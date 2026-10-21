import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { DistrictData, KhorooData, Language, ViewMode } from '../../types';
import {
  UB_CENTER_COORDS,
  UB_DISTRICTS,
  UB_FIRE_STATIONS,
  DEMO_HISTORICAL_INCIDENTS,
  TOTAL_HISTORICAL_INCIDENTS,
  UB_KHOROOS,
} from '../../data/ubGeoData';
import { AreaAnalysisPanel } from './AreaAnalysisPanel';
import { HEAT_LEGEND_GRADIENT, ThermalHeatLayer, type HeatPoint } from './ThermalHeatLayer';
import { getTranslation } from '../../i18n/translations';
import { escapeHtml } from '../../utils/safeHtml';
import { khorooLabel, riskLevelLabel, stationCodeLabel } from '../../i18n/labels';
import { useLiveWeather } from '../../hooks/liveWeather';

interface RiskMapProps {
  language: Language;
  viewMode: ViewMode;
  selectedDistrictId?: string | null;
  onSelectDistrict?: (districtId: string) => void;
  onNavigateToDetail?: (districtId: string) => void;
}

type MapTileStyle = 'satellite' | 'osm';
type DistrictSortMode = 'default' | 'risk_desc' | 'alpha';

/**
 * Leaflet's fly animation divides by the container size, so moving the camera
 * before the map has been measured throws "Invalid LatLng object: (NaN, NaN)".
 */
const focusMap = (map: L.Map, center: [number, number], zoom: number, duration = 0.8) => {
  if (!Number.isFinite(center[0]) || !Number.isFinite(center[1])) return;
  const size = map.getSize();
  if (size.x < 8 || size.y < 8) {
    map.setView(center, zoom, { animate: false });
    return;
  }
  map.flyTo(center, zoom, { duration });
};

// High-risk urban wildfire/residential hotspot centers for thermal GIS halo visualization
const UB_HEATMAP_HOTSPOTS: [number, number, number, string, number][] = [
  // [lat, lng, radiusMeters, name, dangerScore]
  [47.9450, 106.7850, 2000, 'Баянхошуу гэр хороолол', 79],
  [47.9300, 106.7450, 1800, 'Толгойт уулын бэл', 78],
  [47.9400, 107.0100, 1900, 'Дарь-Эх, Ганц худаг', 77],
  [47.9150, 107.0350, 1600, 'Амгалан, Цайз зах', 74],
  [47.9550, 106.9050, 1500, 'Дэнжийн 1000, Зурагт', 75],
  [47.9750, 106.9150, 1400, '7 буудал, Чингэлтэй уул', 73],
  [47.9480, 106.9350, 1300, '32-ын тойрог, Бэлх', 68],
  [47.8850, 106.8450, 1700, 'Яармаг, Нисэх гэр хороолол', 67],
  [47.9180, 106.8750, 1200, 'Гандан, 3-4 хороолол ар', 62],
  [47.9250, 107.0850, 1500, 'Шар хад, Улиастай', 76],
];

const HOTSPOT_NAME_EN: Record<string, string> = {
  'Баянхошуу гэр хороолол': 'Bayankhoroo ger belt',
  'Толгойт уулын бэл': 'Tolgoyt hill base',
  'Дарь-Эх, Ганц худаг': 'Darl-Ekh, Gants Khudag',
  'Амгалан, Цайз зах': 'Amgalan, Tsaiz market',
  'Дэнжийн 1000, Зурагт': 'Denj 1000, Zuragt',
  '7 буудал, Чингэлтэй уул': '7 Buudal, Chingltei hill',
  '32-ын тойрог, Бэлх': 'Ring 32, Belkh',
  'Яармаг, Нисэх гэр хороолол': 'Yarmag, Nisekh ger belt',
  'Гандан, 3-4 хороолол ар': 'Gandan, khoroo 3-4 rear',
  'Шар хад, Улиастай': 'Shar Khad, Uliastai',
};

const hotspotNameEn = (mn: string): string => HOTSPOT_NAME_EN[mn] ?? mn;

export const RiskMap: React.FC<RiskMapProps> = ({
  language,
  viewMode: _viewMode,
  selectedDistrictId,
  onSelectDistrict,
  onNavigateToDetail,
}) => {
  const t = getTranslation(language);
  const live = useLiveWeather();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsTileLayerRef = useRef<L.TileLayer | null>(null);

  // Active district & khoroo states
  const [activeDistrict, setActiveDistrict] = useState<DistrictData | null>(() => {
    return UB_DISTRICTS.find((d) => d.id === selectedDistrictId) || UB_DISTRICTS[0];
  });
  const [selectedKhoroo, setSelectedKhoroo] = useState<KhorooData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);

  // Map Tile Style: Default to realistic satellite
  const [tileStyle, setTileStyle] = useState<MapTileStyle>('satellite');

  // Layer toggles
  const [khorooMode, setKhorooMode] = useState<'district_only' | 'all' | 'none'>('district_only');
  const [showStations, setShowStations] = useState(true);
  const [showStationBuffers, setShowStationBuffers] = useState(true);
  const [showIncidents, setShowIncidents] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true); // Living thermal heatmap on by default
  const [showLayersDropdown, setShowLayersDropdown] = useState(false);
  const [satelliteOpacity] = useState<number>(0.22);
  const [mapZoom, setMapZoom] = useState<number>(11);

  // District Carousel Controls
  const [sortBy, setSortBy] = useState<DistrictSortMode>('risk_desc'); // Default to highest risk first for maximum safety value
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const layersDropdownRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Close layers dropdown on outside click / Escape
  useEffect(() => {
    if (!showLayersDropdown) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (layersDropdownRef.current && !layersDropdownRef.current.contains(e.target as Node)) {
        setShowLayersDropdown(false);
      }
    };
    const onKeyEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowLayersDropdown(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKeyEsc);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKeyEsc);
    };
  }, [showLayersDropdown]);

  // Universal fast search
  const [searchQuery, setSearchQuery] = useState('');
  const [geoLocating, setGeoLocating] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    type: 'district' | 'khoroo';
    item: DistrictData | KhorooData;
  }[]>([]);

  // Layer groups
  const districtsLayerGroup = useRef<L.LayerGroup | null>(null);
  const khoroosLayerGroup = useRef<L.LayerGroup | null>(null);
  const stationsLayerGroup = useRef<L.LayerGroup | null>(null);
  const stationBuffersLayerGroup = useRef<L.LayerGroup | null>(null);
  const incidentsLayerGroup = useRef<L.LayerGroup | null>(null);
  const userLocationLayerGroup = useRef<L.LayerGroup | null>(null);

  // 1. Initialize Leaflet Map (Runs once)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: UB_CENTER_COORDS,
      zoom: 11,
      zoomControl: false,
      minZoom: 8,
      maxZoom: 18,
      preferCanvas: true,
    });

    map.on('zoomend', () => {
      setMapZoom(map.getZoom());
    });

    // 4K Esri World Imagery (Satellite)
    const baseTile = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri World Imagery (4K Satellite)',
        maxZoom: 18,
      }
    ).addTo(map);

    // Hybrid Street and District Labels
    const labelsTile = L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18, opacity: 0.85 }
    ).addTo(map);

    baseTileLayerRef.current = baseTile;
    labelsTileLayerRef.current = labelsTile;

    // Zoom controls at bottom-left
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Layer groups
    districtsLayerGroup.current = L.layerGroup().addTo(map);
    stationBuffersLayerGroup.current = L.layerGroup().addTo(map);
    khoroosLayerGroup.current = L.layerGroup().addTo(map);
    stationsLayerGroup.current = L.layerGroup().addTo(map);
    incidentsLayerGroup.current = L.layerGroup().addTo(map);
    userLocationLayerGroup.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    setMapInstance(map);

    // Automatic layout recalibration for zero grey tiles and perfect responsive fit
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
    setTimeout(() => {
      map.invalidateSize();
    }, 450);

    let resizeObserver: ResizeObserver | null = null;
    if (mapContainerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      map.remove();
      mapInstanceRef.current = null;
      setMapInstance(null);
    };
  }, []);

  // 2. Tile Provider Switching
  const handleTileChange = (style: MapTileStyle) => {
    setTileStyle(style);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }
    if (labelsTileLayerRef.current) {
      map.removeLayer(labelsTileLayerRef.current);
      labelsTileLayerRef.current = null;
    }

    if (style === 'satellite') {
      const base = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri World Imagery (4K Satellite)',
          maxZoom: 18,
        }
      ).addTo(map);

      const labels = L.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, opacity: 0.85 }
      ).addTo(map);

      baseTileLayerRef.current = base;
      labelsTileLayerRef.current = labels;
    } else if (style === 'osm') {
      const base = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);
      baseTileLayerRef.current = base;
    }
  };

  // 3. Sync external district selection
  useEffect(() => {
    if (selectedDistrictId) {
      const match = UB_DISTRICTS.find((d) => d.id === selectedDistrictId);
      if (match) {
        setActiveDistrict(match);
        setSelectedKhoroo(null);
        setIsPanelOpen(true);
        if (mapInstanceRef.current) {
          focusMap(mapInstanceRef.current, match.center, 12);
        }
      }
    }
  }, [selectedDistrictId]);

  // 4. Render District Polygons
  useEffect(() => {
    const group = districtsLayerGroup.current;
    if (!group) return;
    group.clearLayers();

    UB_DISTRICTS.forEach((d) => {
      const isSelected = activeDistrict?.id === d.id;

      let fillColor = '#12B89A';
      if (d.riskLevel === 'very_high') fillColor = '#E93B2F';
      else if (d.riskLevel === 'high') fillColor = '#FF633C';
      else if (d.riskLevel === 'moderate') fillColor = '#F59E0B';

      const polygon = L.polygon(d.polygon, {
        color: isSelected ? '#FFFFFF' : fillColor,
        weight: isSelected ? 3.5 : 1.5,
        opacity: isSelected ? 1 : 0.75,
        fillColor: fillColor,
        fillOpacity: isSelected ? satelliteOpacity + 0.18 : satelliteOpacity,
      });

      polygon.on('click', () => {
        setActiveDistrict(d);
        setSelectedKhoroo(null);
        setIsPanelOpen(true);
        if (onSelectDistrict) onSelectDistrict(d.id);
        if (mapInstanceRef.current) {
          focusMap(mapInstanceRef.current, d.center, 12);
        }
      });

      polygon.bindTooltip(
        `<div style="font-family: inherit; padding: 4px;">
          <div style="font-weight: 700; color: #0B124D; font-size: 13px;">${escapeHtml(
            language === 'mn' ? `${d.nameMn} дүүрэг` : `${d.nameEn} District`
          )}</div>
          <div style="font-size: 11px; color: #72778A;">
            ${escapeHtml(t.riskIndicatorTitle)}: <b style="color:${fillColor}">${d.riskScore}/100</b>
          </div>
          <div style="font-size: 10px; color: #0B124D; margin-top: 2px;">
            ${language === 'mn'
              ? `${d.khoroosCount} хороотой · Дарж нарийвчлах`
              : `${d.khoroosCount} khoroos · Click to inspect`}
          </div>
        </div>`,
        { sticky: true }
      );

      group.addLayer(polygon);
    });
  }, [activeDistrict, satelliteOpacity, language, onSelectDistrict, t.riskIndicatorTitle]);

  // 5. Thermal risk surface (continuous interpolated canvas field)
  const heatPoints = useMemo<HeatPoint[]>(() => {
    const hotspots: HeatPoint[] = UB_HEATMAP_HOTSPOTS.map(([lat, lng, radius, name, dangerScore]) => ({
      lat,
      lng,
      radiusMeters: radius,
      score: dangerScore,
      label: language === 'mn' ? name : hotspotNameEn(name),
      labelValue: `${dangerScore}%`,
    }));

    // Every khoroo contributes its own modelled risk, so the surface spreads
    // across the whole capital instead of stopping at ten dots.
    const fromKhoroos: HeatPoint[] = UB_KHOROOS.map((k) => ({
      lat: k.center[0],
      lng: k.center[1],
      radiusMeters: 900 + k.gerHouseholdPercent * 18,
      score: k.riskScore,
    }));

    return [...hotspots, ...fromKhoroos];
  }, [language]);

  // Population-weighted city average — the honest number behind the ticker
  const ubAverageRisk = useMemo(() => {
    if (UB_KHOROOS.length === 0) {
      return Math.round(UB_DISTRICTS.reduce((s, d) => s + d.riskScore, 0) / UB_DISTRICTS.length);
    }
    const totalPeople = UB_KHOROOS.reduce((s, k) => s + k.population, 0);
    if (totalPeople <= 0) {
      return Math.round(UB_KHOROOS.reduce((s, k) => s + k.riskScore, 0) / UB_KHOROOS.length);
    }
    const weighted = UB_KHOROOS.reduce((s, k) => s + k.riskScore * k.population, 0) / totalPeople;
    return Math.round(weighted);
  }, []);

  // 6. Render Khoroo Markers
  const visibleKhoroos = useMemo(() => {
    if (khorooMode === 'none') return [];
    if (khorooMode === 'all') return UB_KHOROOS;
    if (!activeDistrict) return [];
    return UB_KHOROOS.filter((k) => k.districtId === activeDistrict.id);
  }, [khorooMode, activeDistrict]);

  // Boolean tier instead of raw zoom: markers only rebuild when crossing
  // the detail threshold, not on every single zoom tick (smooth zooming)
  const isDetailedZoom = mapZoom >= 13;

  useEffect(() => {
    const group = khoroosLayerGroup.current;
    if (!group) return;
    group.clearLayers();

    if (visibleKhoroos.length === 0) return;

    visibleKhoroos.forEach((kh) => {
      const isSelected = selectedKhoroo?.id === kh.id;

      let badgeBg = '#12B89A';
      if (kh.riskScore >= 75) badgeBg = '#E93B2F';
      else if (kh.riskScore >= 55) badgeBg = '#FF633C';
      else if (kh.riskScore >= 35) badgeBg = '#F59E0B';

      const isDetailed = isDetailedZoom || isSelected;

      const khorooIcon = isDetailed
        ? L.divIcon({
            className: 'custom-khoroo-marker',
            html: `
              <div style="
                display: inline-flex;
                align-items: center;
                gap: 4px;
                background: ${isSelected ? '#0B124D' : 'rgba(255, 255, 255, 0.96)'};
                color: ${isSelected ? '#FFFFFF' : '#0B124D'};
                padding: 2px 7px;
                border-radius: 9999px;
                border: 2px solid ${badgeBg};
                box-shadow: 0 3px 10px rgba(0,0,0,0.25);
                cursor: pointer;
                white-space: nowrap;
                font-size: 11px;
                font-weight: 700;
                transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
                transition: transform 0.15s ease;
              ">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: ${badgeBg};"></span>
                <span>${escapeHtml(
                  language === 'mn' ? `${kh.khorooNumber}-р хороо` : `Khoroo ${kh.khorooNumber}`
                )}</span>
                <span style="font-family: monospace; font-size: 10px; padding: 0.5px 4px; border-radius: 4px; background: ${badgeBg}; color: white;">${kh.riskScore}%</span>
              </div>
            `,
            iconSize: [100, 24],
            iconAnchor: [50, 12],
          })
        : L.divIcon({
            className: 'custom-khoroo-dot-marker',
            html: `
              <div style="
                width: 22px;
                height: 22px;
                border-radius: 50%;
                background: ${badgeBg};
                color: #FFFFFF;
                border: 2px solid #FFFFFF;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-family: monospace;
                font-weight: 800;
                cursor: pointer;
                transition: transform 0.15s ease;
              " title="${escapeHtml(
                language === 'mn' ? kh.nameMn : kh.nameEn
              )} (${kh.riskScore}%)">
                ${kh.khorooNumber}
              </div>
            `,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });

      const marker = L.marker(kh.center, { icon: khorooIcon });

      marker.on('click', () => {
        setSelectedKhoroo(kh);
        setIsPanelOpen(true);
        if (mapInstanceRef.current) {
          focusMap(mapInstanceRef.current, kh.center, 14);
        }
      });

      const khLevelText = riskLevelLabel(kh.riskLevel, language === 'mn');
      marker.bindTooltip(
        `<div style="font-family: inherit; padding: 4px;">
          <div style="font-weight: 700; color: #0B124D; font-size: 12px;">${escapeHtml(
            language === 'mn' ? kh.nameMn : kh.nameEn
          )}${
            kh.isModelled
              ? `<span style="font-size:9px;font-weight:600;color:#72778A;"> · ${
                  language === 'mn' ? 'загварчилсан' : 'modelled'
                }</span>`
              : ''
          }</div>
          <div style="font-size: 11px; color: ${badgeBg}; font-weight: 700;">
            ${language === 'mn' ? 'Эрсдэл' : 'Risk'}: ${kh.riskScore}% (
            ${escapeHtml(khLevelText)})
          </div>
          <div style="font-size: 10px; color: #72778A; margin-top: 2px;">
            ${language === 'mn' ? 'Гэр хороолол' : 'Ger households'}: ${kh.gerHouseholdPercent}% ·
            ${language === 'mn' ? 'Ирэх хугацаа' : 'Response'}: ~${kh.avgResponseTimeMin} ${
              language === 'mn' ? 'мин' : 'min'
            }
          </div>
        </div>`,
        { sticky: true }
      );

      group.addLayer(marker);
    });
  }, [visibleKhoroos, selectedKhoroo, language, isDetailedZoom]);

  // 7. Render Fire Stations & Access Buffers
  useEffect(() => {
    const group = stationsLayerGroup.current;
    const bufGroup = stationBuffersLayerGroup.current;
    if (!group || !bufGroup) return;

    group.clearLayers();
    bufGroup.clearLayers();

    if (!showStations) return;

    UB_FIRE_STATIONS.forEach((sta) => {
      // Station Buffer Circles (3km and 5km response thresholds)
      if (showStationBuffers) {
        const buffer3km = L.circle(sta.coordinates, {
          radius: 3000,
          color: '#12B89A',
          weight: 1.5,
          dashArray: '4, 6',
          fillColor: '#12B89A',
          fillOpacity: 0.04,
          interactive: false,
        });

        const buffer5km = L.circle(sta.coordinates, {
          radius: 5000,
          color: '#0B124D',
          weight: 1,
          dashArray: '2, 8',
          fillColor: '#0B124D',
          fillOpacity: 0.02,
          interactive: false,
        });

        bufGroup.addLayer(buffer3km);
        bufGroup.addLayer(buffer5km);
      }

      // Station Pin
      const stationIcon = L.divIcon({
        className: 'custom-station-marker',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 10px;
            background: #0B124D;
            color: #FFFFFF;
            border: 2px solid #FF633C;
            box-shadow: 0 4px 12px rgba(11, 18, 77, 0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            🚒
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(sta.coordinates, { icon: stationIcon });

      marker.bindTooltip(
        `<div style="font-family: inherit; padding: 4px;">
          <div style="font-weight: 700; color: #0B124D; font-size: 12px;">🚒 ${escapeHtml(
            language === 'mn' ? sta.nameMn : sta.nameEn
          )} (${escapeHtml(stationCodeLabel(sta.code, language === 'mn'))})</div>
          <div style="font-size: 10px; color: #72778A;">
            ${language === 'mn'
              ? `ОБЕГ харьяа анги · Хүрэх тойрог: ~${sta.coverageRadiusKm} км`
              : `NEMA company · Coverage radius: ~${sta.coverageRadiusKm} km`}
          </div>
        </div>`,
        { sticky: true }
      );

      group.addLayer(marker);
    });
  }, [showStations, showStationBuffers, language]);

  // 8. Render Incidents
  useEffect(() => {
    const group = incidentsLayerGroup.current;
    if (!group) return;
    group.clearLayers();

    if (!showIncidents) return;

    DEMO_HISTORICAL_INCIDENTS.forEach((inc) => {
      const circle = L.circleMarker(inc.coordinates, {
        radius: 4.5,
        fillColor: inc.severity === 'critical' ? '#E93B2F' : '#FF633C',
        color: '#FFFFFF',
        weight: 1.5,
        opacity: 0.95,
        fillOpacity: 0.85,
      });

      circle.bindTooltip(
        `<div style="font-family: inherit; font-size: 10px; padding: 2px;">
          <b>${escapeHtml(inc.date)}</b>: ${escapeHtml(
            language === 'mn' ? inc.causeGuessMn : inc.causeGuessEn
          )}
        </div>`
      );

      group.addLayer(circle);
    });
  }, [showIncidents, language]);

  // Handle Search
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const results: { type: 'district' | 'khoroo'; item: DistrictData | KhorooData }[] = [];

    UB_DISTRICTS.forEach((d) => {
      if (d.nameMn.toLowerCase().includes(q) || d.nameEn.toLowerCase().includes(q)) {
        results.push({ type: 'district', item: d });
      }
    });

    UB_KHOROOS.forEach((kh) => {
      if (
        kh.nameMn.toLowerCase().includes(q) ||
        kh.nameEn.toLowerCase().includes(q) ||
        `${kh.khorooNumber}` === q ||
        kh.landmarksMn.some((lm) => lm.toLowerCase().includes(q))
      ) {
        results.push({ type: 'khoroo', item: kh });
      }
    });

    setSearchResults(results.slice(0, 8));
  };

  const selectSearchResult = (res: { type: 'district' | 'khoroo'; item: DistrictData | KhorooData }) => {
    setSearchResults([]);
    setSearchQuery('');

    if (res.type === 'district') {
      const d = res.item as DistrictData;
      setActiveDistrict(d);
      setSelectedKhoroo(null);
      setIsPanelOpen(true);
      if (onSelectDistrict) onSelectDistrict(d.id);
      if (mapInstanceRef.current) {
        focusMap(mapInstanceRef.current, d.center, 12);
      }
    } else {
      const kh = res.item as KhorooData;
      const parentDist = UB_DISTRICTS.find((d) => d.id === kh.districtId);
      if (parentDist) {
        setActiveDistrict(parentDist);
      }
      setSelectedKhoroo(kh);
      setIsPanelOpen(true);
      if (mapInstanceRef.current) {
        focusMap(mapInstanceRef.current, kh.center, 14);
      }
    }
  };

  // Carousel scroll status checker
  const updateScrollStatus = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    updateScrollStatus();
    window.addEventListener('resize', updateScrollStatus);
    return () => window.removeEventListener('resize', updateScrollStatus);
  }, []);

  const handleScroll = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const amount = dir === 'left' ? -260 : 260;
    carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    setTimeout(updateScrollStatus, 320);
  };

  // Sorted districts
  const displayedDistricts = useMemo(() => {
    const list = [...UB_DISTRICTS];
    if (sortBy === 'risk_desc') {
      return list.sort((a, b) => b.riskScore - a.riskScore);
    }
    if (sortBy === 'alpha') {
      return list.sort((a, b) => a.nameMn.localeCompare(b.nameMn));
    }
    return list;
  }, [sortBy]);

  // Khoroos for active district
  const activeDistrictKhoroos = useMemo(() => {
    if (!activeDistrict) return [];
    return UB_KHOROOS.filter((k) => k.districtId === activeDistrict.id).sort((a, b) => b.riskScore - a.riskScore);
  }, [activeDistrict]);

  // Geo-location
  const handleAnalyzeCurrentArea = () => {
    if (!navigator.geolocation) return;
    setGeoLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        const { latitude: userLat, longitude: userLng } = pos.coords;

        if (mapInstanceRef.current && userLocationLayerGroup.current) {
          userLocationLayerGroup.current.clearLayers();

          const marker = L.circleMarker([userLat, userLng], {
            radius: 8,
            fillColor: '#0B124D',
            color: '#FFFFFF',
            weight: 3,
            fillOpacity: 1,
          });

          marker.addTo(userLocationLayerGroup.current);

          let closest = UB_DISTRICTS[0];
          let minDist = 99999;
          UB_DISTRICTS.forEach((d) => {
            const dist = Math.hypot(d.center[0] - userLat, d.center[1] - userLng);
            if (dist < minDist) {
              minDist = dist;
              closest = d;
            }
          });

          setActiveDistrict(closest);
          setSelectedKhoroo(null);
          setIsPanelOpen(true);
          focusMap(mapInstanceRef.current, [userLat, userLng], 13, 1.0);
        }
      },
      () => setGeoLocating(false),
      { timeout: 8000 }
    );
  };

  // Reset to whole UB view
  const handleResetToAllUB = () => {
    setActiveDistrict(null);
    setSelectedKhoroo(null);
    setIsPanelOpen(false);
    if (mapInstanceRef.current) {
      focusMap(mapInstanceRef.current, UB_CENTER_COORDS, 11);
    }
  };

  return (
    <div className="relative w-full h-[calc(100dvh-54px-64px)] lg:h-[calc(100vh-65px)] bg-[#0B124D] overflow-hidden select-none">
      
      {/* 
        ===================================================================
        TOP BAR: Super-Clean, Compact, Seamless Floating Controls
        Spans gracefully with no clipping or awkward truncation
        ===================================================================
      */}
      <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-auto z-[900] flex flex-col gap-2 w-auto max-w-[calc(100vw-16px)] sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl pointer-events-none">
        
        {/* Row 1: Search, Satellite Switcher, Thermal Heatmap & Layers Toggle */}
        <div className="flex items-center gap-1.5 w-full pointer-events-auto">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[130px] sm:min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={language === 'mn' ? 'Дүүрэг, хороо хайх...' : 'Search area...'}
              className="w-full pl-7 sm:pl-8 pr-7 py-1.5 sm:py-2 bg-white/95 backdrop-blur-xl rounded-full text-xs text-[#0B124D] placeholder-[#72778A] border border-black/[0.08] shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF633C]"
            />
            <svg
              className="w-3.5 h-3.5 absolute left-2.5 top-2 sm:top-2.5 text-[#72778A]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="absolute right-2 top-1.5 sm:top-2 text-xs text-slate-400 hover:text-slate-700 w-4 h-4 flex items-center justify-center rounded-full"
              >
                ✕
              </button>
            )}

            {/* Autocomplete Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-black/[0.08] overflow-hidden z-50 p-1 divide-y divide-black/[0.04] max-h-56 overflow-y-auto">
                {searchResults.map((res) => {
                  const isDist = res.type === 'district';
                  const d = res.item as DistrictData;
                  const kh = res.item as KhorooData;

                  return (
                    <button
                      key={isDist ? d.id : kh.id}
                      onClick={() => selectSearchResult(res)}
                      className="w-full text-left p-2 hover:bg-[#F7F8FA] rounded-xl flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>{isDist ? '🏙️' : '📍'}</span>
                        <span className="font-bold text-[#0B124D] truncate">
                          {isDist ? d.nameMn : kh.nameMn}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-[#FF633C] shrink-0 ml-1">
                        {isDist ? d.riskScore : kh.riskScore}%
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* SATELLITE SWITCHER */}
          <div className="flex items-center bg-white/95 backdrop-blur-xl p-0.5 rounded-full shadow-md border border-black/[0.08] text-xs shrink-0">
            <button
              onClick={() => handleTileChange('satellite')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold transition-all flex items-center gap-1 ${
                tileStyle === 'satellite'
                  ? 'bg-[#FF633C] text-white shadow-xs'
                  : 'text-[#72778A] hover:text-[#0B124D]'
              }`}
              title={language === 'mn' ? 'Хиймэл дагуулын бодит зураг' : 'Real satellite imagery'}
            >
              <span>🛰️</span>
              <span className="text-[11px] sm:text-xs">{language === 'mn' ? 'Бодит' : 'Satellite'}</span>
            </button>
            <button
              onClick={() => handleTileChange('osm')}
              className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full font-medium transition-all ${
                tileStyle === 'osm'
                  ? 'bg-[#0B124D] text-white shadow-xs'
                  : 'text-[#72778A] hover:text-[#0B124D]'
              }`}
              title={language === 'mn' ? 'Энгийн зураг' : 'Street map'}
            >
              <span className="text-[11px] sm:text-xs">{language === 'mn' ? 'Зураг' : 'Map'}</span>
            </button>
          </div>

          {/* THERMAL HEATMAP TOGGLE BUTTON */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-2.5 py-1 sm:py-1.5 rounded-full text-xs font-semibold shadow-md border border-black/[0.08] flex items-center gap-1 transition-all shrink-0 ${
              showHeatmap
                ? 'bg-[#E93B2F] text-white ring-2 ring-[#E93B2F]/40 shadow-red-500/20'
                : 'bg-white/95 text-[#0B124D] hover:bg-white'
            }`}
            title={language === 'mn' ? 'Эрсдэлийн дулааны бүсийг харуулах/нуух' : 'Show or hide the thermal risk surface'}
          >
            <span>🔥</span>
            <span className="text-[11px] sm:text-xs hidden md:inline">
              {language === 'mn' ? 'Дулааны бүс' : 'Heatmap'}
            </span>
          </button>

          {/* Layers Dropdown Menu */}
          <div className="relative shrink-0" ref={layersDropdownRef}>
            <button
              onClick={() => setShowLayersDropdown(!showLayersDropdown)}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-semibold shadow-md border border-black/[0.08] flex items-center gap-1 transition-all ${
                showLayersDropdown ? 'bg-[#0B124D] text-white' : 'bg-white/95 text-[#0B124D]'
              }`}
              title={language === 'mn' ? 'Давхарга & шүүлтүүр' : 'Layers & filters'}
            >
              <span>⚙️</span>
              <span className="text-[11px] sm:text-xs hidden lg:inline">
                {language === 'mn' ? 'Давхаргууд' : 'Layers'}
              </span>
              <span className="text-[10px]">▾</span>
            </button>

            {/* Dropdown pinned to right */}
            {showLayersDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white/98 backdrop-blur-2xl rounded-2xl shadow-2xl border border-black/[0.1] p-2.5 w-60 z-[950] text-xs space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-[#72778A] font-bold px-2 py-0.5">
                  {language === 'mn' ? 'Хороодын харагдац:' : 'Khoroo visibility:'}
                </div>
                <button
                  onClick={() => {
                    setKhorooMode('district_only');
                    setShowLayersDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors ${
                    khorooMode === 'district_only' ? 'bg-[#0B124D] text-white font-bold' : 'hover:bg-slate-100 text-[#0B124D]'
                  }`}
                >
                  {language === 'mn' ? 'Сонгосон дүүргийн хороод' : 'Selected district only'}
                </button>
                <button
                  onClick={() => {
                    setKhorooMode('all');
                    setShowLayersDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors ${
                    khorooMode === 'all' ? 'bg-[#0B124D] text-white font-bold' : 'hover:bg-slate-100 text-[#0B124D]'
                  }`}
                >
                  {language === 'mn'
                    ? `Бүх ${UB_KHOROOS.length} хороо (нийслэл)`
                    : `All ${UB_KHOROOS.length} khoroos (capital)`}
                </button>
                <button
                  onClick={() => {
                    setKhorooMode('none');
                    setShowLayersDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors ${
                    khorooMode === 'none' ? 'bg-[#0B124D] text-white font-bold' : 'hover:bg-slate-100 text-[#0B124D]'
                  }`}
                >
                  {language === 'mn' ? 'Хороодын тэмдэглэгээ нуух' : 'Hide khoroo markers'}
                </button>

                <div className="border-t border-slate-100 my-1"></div>

                <div className="text-[10px] font-mono uppercase text-[#72778A] font-bold px-2 py-0.5">
                  {language === 'mn' ? 'Онцгой байдлын давхарга:' : 'Emergency layers:'}
                </div>
                <button
                  onClick={() => setShowStations(!showStations)}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 text-[#0B124D] flex items-center justify-between"
                >
                  <span>🚒 {language === 'mn' ? 'Гал унтраах ангиуд' : 'Fire stations'}</span>
                  <span className="font-bold text-xs">
                    {showStations
                      ? (language === 'mn' ? 'Идэвхтэй' : 'On')
                      : language === 'mn'
                        ? 'Унтраасан'
                        : 'Off'}
                  </span>
                </button>
                <button
                  onClick={() => setShowStationBuffers(!showStationBuffers)}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 text-[#0B124D] flex items-center justify-between"
                >
                  <span>
                    ⭕{' '}
                    {language === 'mn'
                      ? 'Ангийн хүрэх тойрог (3 км / 5 км)'
                      : 'Station coverage (3 km / 5 km)'}
                  </span>
                  <span className="font-bold text-xs">
                    {showStationBuffers
                      ? (language === 'mn' ? 'Тийм' : 'Yes')
                      : language === 'mn'
                        ? 'Үгүй'
                        : 'No'}
                  </span>
                </button>
                <button
                  onClick={() => setShowIncidents(!showIncidents)}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 text-[#0B124D] flex items-center justify-between"
                >
                  <span>
                    📍 {language === 'mn' ? 'Дуудлагын дүрслэл' : 'Sample call log'} ·{' '}
                    {DEMO_HISTORICAL_INCIDENTS.length} / {TOTAL_HISTORICAL_INCIDENTS.toLocaleString()}
                  </span>
                  <span className="font-bold text-xs">
                    {showIncidents ? (language === 'mn' ? 'Тийм' : 'Yes') : language === 'mn' ? 'Үгүй' : 'No'}
                  </span>
                </button>
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 text-[#0B124D] flex items-center justify-between"
                >
                  <span>🔥 {language === 'mn' ? 'Дулааны эрсдэлт бүс' : 'Thermal risk surface'}</span>
                  <span className="font-bold text-xs">
                    {showHeatmap ? (language === 'mn' ? 'Тийм' : 'Yes') : language === 'mn' ? 'Үгүй' : 'No'}
                  </span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* 
          Row 2: DISTRICT CAROUSEL STRIP
          With smooth scroll buttons, edge fade masks, and zero-clipping guarantee
        */}
        <div className="relative w-full pointer-events-auto flex items-center">
          
          {/* Left Scroll Chevron Button */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-0 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-[#0B124D] shadow-lg border border-black/[0.08] flex items-center justify-center transition-all -ml-1 text-sm font-bold active:scale-95"
              aria-label="Scroll left"
            >
              ‹
            </button>
          )}

          {/* Left Fade Gradient Mask */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0B124D]/90 via-[#0B124D]/40 to-transparent z-20 rounded-l-full" />
          )}

          {/* The Scrollable Strip */}
          <div
            ref={carouselRef}
            onScroll={updateScrollStatus}
            className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-none w-full scroll-smooth select-none"
          >
            {/* Overview / All UB Button */}
            <button
              onClick={handleResetToAllUB}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm backdrop-blur-md transition-all shrink-0 flex items-center gap-1 ${
                !activeDistrict
                  ? 'bg-[#0B124D] text-white ring-2 ring-white scale-[1.02] font-bold shadow-md'
                  : 'bg-white/90 text-[#0B124D] hover:bg-white'
              }`}
            >
              <span>🏙️</span>
              <span>{language === 'mn' ? 'Бүх УБ' : 'All UB'}</span>
            </button>

            {/* Quick Sort Mode Toggle */}
            <button
              onClick={() => setSortBy(sortBy === 'risk_desc' ? 'default' : 'risk_desc')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold whitespace-nowrap shadow-sm backdrop-blur-md transition-all shrink-0 flex items-center gap-1 ${
                sortBy === 'risk_desc'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white/80 text-[#0B124D] hover:bg-white'
              }`}
              title={
                language === 'mn'
                  ? sortBy === 'risk_desc'
                    ? 'Эрсдэлийн эрэмбээр жагсаасан'
                    : 'Дүүргийн дарааллаар жагсаах'
                  : sortBy === 'risk_desc'
                    ? 'Sorted by risk score'
                    : 'Sorted by district order'
              }
            >
              <span>⚡</span>
              <span>{sortBy === 'risk_desc' ? (language === 'mn' ? 'Эрсдэлээр' : 'Top Risk') : (language === 'mn' ? 'Бүсээр' : 'Default')}</span>
            </button>

            {/* District Pills */}
            {displayedDistricts.map((d) => {
              const isSel = activeDistrict?.id === d.id && !selectedKhoroo;
              const isVeryHigh = d.riskScore >= 75;
              const isHigh = d.riskScore >= 55 && d.riskScore < 75;

              return (
                <button
                  key={d.id}
                  onClick={() => {
                    setActiveDistrict(d);
                    setSelectedKhoroo(null);
                    setIsPanelOpen(true);
                    if (onSelectDistrict) onSelectDistrict(d.id);
                    if (mapInstanceRef.current) {
                      focusMap(mapInstanceRef.current, d.center, 12);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm backdrop-blur-md transition-all shrink-0 flex items-center gap-1.5 group ${
                    isSel
                      ? 'bg-[#0B124D] text-white ring-2 ring-white scale-[1.02] font-bold shadow-lg'
                      : 'bg-white/90 text-[#0B124D] hover:bg-white hover:text-[#FF633C]'
                  }`}
                >
                  {/* Pulsing Risk Dot */}
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isVeryHigh ? 'bg-[#E93B2F] animate-pulse' : isHigh ? 'bg-[#FF633C]' : 'bg-[#12B89A]'
                    }`}
                  />
                  <span>{language === 'mn' ? d.nameMn : d.nameEn}</span>
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      isSel
                        ? 'bg-white/20 text-white'
                        : isVeryHigh
                        ? 'bg-red-100 text-[#E93B2F]'
                        : isHigh
                        ? 'bg-orange-100 text-[#FF633C]'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {d.riskScore}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Fade Gradient Mask */}
          {canScrollRight && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#0B124D]/90 via-[#0B124D]/40 to-transparent z-20 rounded-r-full" />
          )}

          {/* Right Scroll Chevron Button */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-[#0B124D] shadow-lg border border-black/[0.08] flex items-center justify-center transition-all -mr-1 text-sm font-bold active:scale-95"
              aria-label="Scroll right"
            >
              ›
            </button>
          )}

        </div>

        {/* 
          Row 3: SELECTED DISTRICT KHOROOS SUB-STRIP (Advanced Drill-Down)
          Instantly jump to specific high-risk sub-khoroos within active district
        */}
        {activeDistrict && activeDistrictKhoroos.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 px-1 scrollbar-none pointer-events-auto w-full select-none text-[11px]">
            <span className="text-[10px] font-mono text-white/80 bg-[#0B124D]/80 backdrop-blur-md px-2 py-0.5 rounded-md shrink-0">
              {language === 'mn'
                ? `${activeDistrict.nameMn} (${activeDistrict.khoroosCount} хороо):`
                : `${activeDistrict.nameEn} (${activeDistrict.khoroosCount} khoroos):`}
            </span>
            {activeDistrictKhoroos.slice(0, 8).map((kh) => {
              const isSelKh = selectedKhoroo?.id === kh.id;
              return (
                <button
                  key={kh.id}
                  onClick={() => {
                    setSelectedKhoroo(kh);
                    setIsPanelOpen(true);
                    if (mapInstanceRef.current) {
                      focusMap(mapInstanceRef.current, kh.center, 14);
                    }
                  }}
                  className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-all shrink-0 font-medium ${
                    isSelKh
                      ? 'bg-[#FF633C] text-white font-bold ring-1 ring-white'
                      : 'bg-white/80 hover:bg-white text-[#0B124D]'
                  }`}
                >
                  <span>{khorooLabel(kh.khorooNumber, language === 'mn')}</span>
                  <span className="ml-1 font-mono font-bold text-[10px] opacity-80">{kh.riskScore}%</span>
                </button>
              );
            })}
            {activeDistrictKhoroos.length > 8 && (
              <button
                onClick={() => setIsPanelOpen(true)}
                className="px-2 py-0.5 rounded-full bg-white/60 hover:bg-white text-[#0B124D] text-[10px] font-mono shrink-0"
              >
                {language === 'mn'
                  ? `+${activeDistrictKhoroos.length - 8} бусад хороод →`
                  : `+${activeDistrictKhoroos.length - 8} more khoroos →`}
              </button>
            )}
          </div>
        )}

      </div>

      {/* Floating GPS / Locate Me Button (Right Side, Highly Reachable) */}
      <button
        onClick={handleAnalyzeCurrentArea}
        disabled={geoLocating}
        className="absolute right-3 top-28 sm:top-32 z-[850] w-10 h-10 bg-white/95 hover:bg-white text-[#0B124D] rounded-full shadow-lg border border-black/[0.08] transition-all active:scale-95 flex items-center justify-center pointer-events-auto"
        title={language === 'mn' ? 'Миний байршил олох' : 'Find my location'}
        aria-label={language === 'mn' ? 'Миний байршил олох' : 'Find my location'}
      >
        <svg className={`w-4 h-4 text-[#FF633C] ${geoLocating ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
        </svg>
      </button>

      {/* Mini Bottom-Left Map Legend HUD */}
      <div className="absolute bottom-6 left-3 z-[850] hidden sm:flex flex-col gap-1.5 bg-white/95 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl border border-black/[0.08] shadow-lg text-[10px] font-mono pointer-events-none max-w-[calc(100vw-32px)]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#0B124D] uppercase tracking-wide">
            {language === 'mn' ? 'Эрсдэлийн дулааны бүс' : 'Thermal risk surface'}
          </span>
          <span
            className="w-24 h-2 rounded-full border border-black/10"
            style={{ background: HEAT_LEGEND_GRADIENT }}
            aria-hidden="true"
          />
          <span className="text-[#72778A]">0 → 100%</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-[#E93B2F]">
            <span className="w-2 h-2 rounded-full bg-[#E93B2F] animate-pulse" /> &gt;75%{' '}
            {language === 'mn' ? 'Маш өндөр' : 'Very high'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 font-bold text-[#FF633C]">
            <span className="w-2 h-2 rounded-full bg-[#FF633C]" /> 55-74%{' '}
            {language === 'mn' ? 'Өндөр' : 'High'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 font-bold text-[#12B89A]">
            <span className="w-2 h-2 rounded-full bg-[#12B89A]" /> &lt;55%{' '}
            {language === 'mn' ? 'Хэвийн' : 'Moderate'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 text-[#0B124D]">
            🚒 {language === 'mn' ? 'Ангиуд' : 'Stations'} ({UB_FIRE_STATIONS.length})
          </span>
        </div>
      </div>

      {/* LIVE Metro Risk & Weather Ticker (Top Right on Large Screens) */}
      <div className="absolute top-3 right-3 z-[850] hidden xl:flex items-center gap-2 bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-full border border-black/[0.08] shadow-lg text-[11px] font-mono pointer-events-auto max-w-[calc(100vw-24px)]">
        <span className={`w-2 h-2 rounded-full animate-pulse ${live.isLive ? 'bg-[#12B89A]' : 'bg-amber-500'}`} />
        <span className="text-[#0B124D] font-bold whitespace-nowrap">
          {language === 'mn' ? 'УБ дундаж' : 'UB average'}: {ubAverageRisk}%
        </span>
        <span className="text-slate-300">•</span>
        <span className="text-[#72778A] whitespace-nowrap">
          {language === 'mn' ? 'Салхи' : 'Wind'}: {live.windSpeedKmh}{' '}
          {language === 'mn' ? 'км/ц' : 'km/h'}
        </span>
        <span className="text-slate-300">•</span>
        <span className="text-[#72778A] whitespace-nowrap">
          {language === 'mn' ? 'Чийгшил' : 'RH'}: {live.humidityPercent}%
        </span>
        <span className="text-slate-300">•</span>
        <span
          className={`font-bold whitespace-nowrap ${
            live.fireWeatherIndex >= 55 ? 'text-[#E93B2F]' : 'text-[#12B89A]'
          }`}
          title={live.isLive ? live.lastUpdated : language === 'mn' ? 'Загварчлалын суурь үзүүлэлт' : 'Modelled baseline'}
        >
          {language === 'mn' ? 'FWI' : 'FWI'}: {live.fireWeatherIndex}/100 ·{' '}
          {live.isLive ? (language === 'mn' ? 'LIVE' : 'LIVE') : (language === 'mn' ? 'СУРТАЛЦ' : 'BASELINE')}
        </span>
      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      <ThermalHeatLayer map={mapInstance} points={heatPoints} visible={showHeatmap} />

      {/* Floating Panel Re-Open Button when panel is closed */}
      {!isPanelOpen && activeDistrict && (
        <button
          onClick={() => setIsPanelOpen(true)}
          className="absolute bottom-20 sm:bottom-4 right-3 sm:right-4 z-[990] bg-[#0B124D] text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-2xl flex items-center gap-1.5 sm:gap-2 text-xs font-bold hover:bg-[#11166B] transition-all active:scale-95 border border-white/20 max-w-[calc(100vw-24px)] truncate"
        >
          <span>📋</span>
          <span className="truncate">
            {language === 'mn'
              ? `${activeDistrict.nameMn}: Эрсдэлийн задргаа нээх (${activeDistrict.riskScore}%)`
              : `${activeDistrict.nameEn}: Open risk breakdown (${activeDistrict.riskScore}%)`}
          </span>
        </button>
      )}

      {/* 
        ===================================================================
        AREA ANALYSIS SLIDE-OVER PANEL:
        Includes itemized causal breakdown ("яагаад ийм хувийн эрсдэлтэй бэ")
        ===================================================================
      */}
      {isPanelOpen && activeDistrict && (
        <AreaAnalysisPanel
          district={activeDistrict}
          selectedKhoroo={selectedKhoroo}
          onSelectKhoroo={(kh) => setSelectedKhoroo(kh)}
          onClose={() => setIsPanelOpen(false)}
          language={language}
          onNavigateToDetail={onNavigateToDetail}
        />
      )}

    </div>
  );
};
