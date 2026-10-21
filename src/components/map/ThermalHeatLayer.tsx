import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { escapeHtml } from '../../utils/safeHtml';

/**
 * Continuous thermal risk surface painted on one canvas inside Leaflet's
 * overlay pane.
 *
 * The earlier visual was a handful of hand-placed circles, which read as "ten
 * dots" instead of "a city under risk". Here every source point contributes to a
 * coarse intensity grid which is then upscaled with bilinear smoothing, so the
 * field spreads continuously from one hot zone to the next and stays readable
 * over both satellite imagery and street tiles.
 */

export interface HeatPoint {
  lat: number;
  lng: number;
  /** 0-100 risk score driving intensity and spread */
  score: number;
  /** metres */
  radiusMeters: number;
  label?: string;
  labelValue?: string;
}

interface ThermalHeatLayerProps {
  map: L.Map | null;
  points: HeatPoint[];
  visible: boolean;
}

const GRID_COLUMNS = 26;

// normalized intensity -> [r, g, b, alpha]
const RAMP: { at: number; rgba: [number, number, number, number] }[] = [
  { at: 0.0, rgba: [18, 184, 154, 0] },
  { at: 0.18, rgba: [18, 184, 154, 90] },
  { at: 0.34, rgba: [255, 209, 102, 140] },
  { at: 0.52, rgba: [255, 140, 50, 175] },
  { at: 0.7, rgba: [255, 99, 60, 205] },
  { at: 0.86, rgba: [233, 59, 47, 225] },
  { at: 1.0, rgba: [255, 232, 205, 245] },
];

function rampColor(v: number): [number, number, number, number] {
  const x = Math.max(0, Math.min(1, v));
  for (let i = 1; i < RAMP.length; i++) {
    if (x <= RAMP[i].at) {
      const a = RAMP[i - 1];
      const b = RAMP[i];
      const k = b.at === a.at ? 0 : (x - a.at) / (b.at - a.at);
      return [
        Math.round(a.rgba[0] + (b.rgba[0] - a.rgba[0]) * k),
        Math.round(a.rgba[1] + (b.rgba[1] - a.rgba[1]) * k),
        Math.round(a.rgba[2] + (b.rgba[2] - a.rgba[2]) * k),
        Math.round(a.rgba[3] + (b.rgba[3] - a.rgba[3]) * k),
      ];
    }
  }
  return [255, 232, 205, 245];
}

/** CSS gradient shared by the canvas ramp and the on-screen legend key. */
export const HEAT_LEGEND_GRADIENT = `linear-gradient(to right, ${RAMP.map((s) => {
  const [r, g, b, a] = s.rgba;
  return `rgba(${r},${g},${b},${a === 0 ? 0 : Math.min(255, a) / 255}) ${Math.round(s.at * 100)}%`;
}).join(', ')})`;

export const ThermalHeatLayer: React.FC<ThermalHeatLayerProps> = ({ map, points, visible }) => {
  const drawRef = useRef<(() => void) | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const frameRef = useRef<number | null>(null);

  // Readable from the once-bound map handlers without re-subscribing on every render
  const latest = useRef({ map, points, visible });
  useEffect(() => {
    latest.current = { map, points, visible };
  }, [map, points, visible]);

  useEffect(() => {
    if (!map) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'fw-thermal-canvas';
    L.DomUtil.addClass(canvas, 'leaflet-layer');
    map.getPanes().overlayPane.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let live = true;

    const draw = () => {
      if (!live || !ctx) return;
      const current = latest.current;
      const m = current.map;
      if (!m) return;

      const size = m.getSize();

      // A collapsed/hidden container reports 0x0; dividing by it would make the
      // grid geometry NaN and blank the layer until the next resize event.
      if (!size || !size.x || !size.y) return;

      if (!current.visible) {
        canvas.width = 0;
        canvas.height = 0;
        return;
      }

      canvas.width = size.x;
      canvas.height = size.y;
      L.DomUtil.setPosition(canvas, m.containerPointToLayerPoint([0, 0]));

      const cols = GRID_COLUMNS;
      const cellPx = size.x / cols;
      const rows = Math.max(4, Math.ceil(size.y / cellPx));

      const grid = new Float32Array(cols * rows);
      let peak = 0;

      for (let i = 0; i < current.points.length; i++) {
        const pt = current.points[i];
        const center = m.latLngToContainerPoint([pt.lat, pt.lng]);
        // Convert the metric radius into pixels at this exact zoom/latitude
        const north = m.latLngToContainerPoint([pt.lat + pt.radiusMeters / 111320, pt.lng]);
        const radiusPx = Math.max(8, Math.abs(center.y - north.y));
        const weight = Math.max(0.05, pt.score / 100);

        const gx0 = Math.max(0, Math.floor((center.x - radiusPx) / cellPx));
        const gx1 = Math.min(cols - 1, Math.ceil((center.x + radiusPx) / cellPx));
        const gy0 = Math.max(0, Math.floor((center.y - radiusPx) / (size.y / rows)));
        const gy1 = Math.min(rows - 1, Math.ceil((center.y + radiusPx) / (size.y / rows)));
        const cellH = size.y / rows;

        for (let gy = gy0; gy <= gy1; gy++) {
          const cy = gy * cellH + cellH / 2;
          for (let gx = gx0; gx <= gx1; gx++) {
            const cx = gx * cellPx + cellPx / 2;
            const d = Math.hypot(cx - center.x, cy - center.y) / radiusPx;
            if (d >= 1) continue;
            const falloff = (1 - d * d) * (1 - d * d);
            const idx = gy * cols + gx;
            grid[idx] += weight * falloff;
            if (grid[idx] > peak) peak = grid[idx];
          }
        }
      }

      ctx.clearRect(0, 0, size.x, size.y);
      if (peak <= 0) return;

      // Saturate slightly so overlapping cores stay hot instead of washing out
      const norm = 1 / Math.min(peak, 1.4);

      const field = document.createElement('canvas');
      field.width = cols;
      field.height = rows;
      const fctx = field.getContext('2d');
      if (!fctx) return;
      const img = fctx.createImageData(cols, rows);
      for (let i = 0; i < grid.length; i++) {
        const v = grid[i] * norm;
        const [r, g, b, a] = rampColor(v);
        img.data[i * 4] = r;
        img.data[i * 4 + 1] = g;
        img.data[i * 4 + 2] = b;
        img.data[i * 4 + 3] = a;
      }
      fctx.putImageData(img, 0, 0);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.globalAlpha = 0.92;
      ctx.drawImage(field, -cellPx / 2, -(size.y / rows) / 2, size.x + cellPx, size.y + size.y / rows);
      ctx.globalAlpha = 1;
    };

    drawRef.current = draw;

    const schedule = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        draw();
      });
    };

    draw();
    map.on('move', schedule);
    map.on('zoom', schedule);
    map.on('resize', schedule);

    return () => {
      live = false;
      map.off('move', schedule);
      map.off('zoom', schedule);
      map.off('resize', schedule);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      if (drawRef.current === draw) drawRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    drawRef.current?.();
  }, [points, visible]);

  // DOM labels stay crisp at any zoom and follow the pan for free
  useEffect(() => {
    if (!map) return;
    markersRef.current.forEach((mk) => mk.remove());
    markersRef.current = [];
    if (!visible) return;

    const labelled = points
      .filter((p) => p.label)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);

    markersRef.current = labelled.map((p) =>
      L.marker([p.lat, p.lng], {
        interactive: false,
        keyboard: false,
        pane: 'tooltipPane',
        icon: L.divIcon({
          className: 'fw-heat-label-wrap',
          html: `<div class="fw-heat-label"><span>${escapeHtml(p.label as string)}</span>${
            p.labelValue ? `<b>${escapeHtml(p.labelValue)}</b>` : ''
          }</div>`,
          iconSize: [132, 24],
          iconAnchor: [66, 12],
        }),
      }).addTo(map)
    );

    return () => {
      markersRef.current.forEach((mk) => mk.remove());
      markersRef.current = [];
    };
  }, [map, points, visible]);

  return null;
};
