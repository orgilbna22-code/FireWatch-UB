import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { DistrictData, KhorooData, Language, ViewMode } from '../../types';
import { UB_CENTER_COORDS, UB_DISTRICTS, UB_FIRE_STATIONS, DEMO_HISTORICAL_INCIDENTS, UB_KHOROOS } from '../../data/ubGeoData';
import { AreaAnalysisPanel } from './AreaAnalysisPanel';
import { getTranslation } from '../../i18n/translations';

interface RiskMapProps {
  language: Language;
  viewMode: ViewMode;
  selectedDistrictId?: string | null;
  onSelectDistrict?: (districtId: string) => void;
  onNavigateToDetail?: (districtId: string) => void;
}

type MapTileStyle = 'satellite' | 'osm' | 'topo';

export const RiskMap: React.FC<RiskMapProps> = ({
  language,
  selectedDistrictId,
  onSelectDistrict,
  onNavigateToDetail,
}) => {
  const t = getTranslation(language);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsTileLayerRef = useRef<L.TileLayer | null>(null);

  // Active district & khoroo states
  const [activeDistrict, setActiveDistrict] = useState<DistrictData | null>(() => {
    return UB_DISTRICTS.find((d) => d.id === selectedDistrictId) || UB_DISTRICTS[0];
  });
  const [selectedKhoroo, setSelectedKhoroo] = useState<KhorooData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);

  // Map Tile Style: Default to high-contrast Realistic Satellite as requested
  const [tileStyle, setTileStyle] = useState<MapTileStyle>('satellite');

  // Khoroo display mode: 'district_only' (active district khoroos - clean & fast) or 'all' or 'none'
  const [khorooMode, setKhorooMode] = useState<'district_only' | 'all' | 'none'>('district_only');
  const [showStations, setShowStations] = useState(true);
  const [showIncidents, setShowIncidents] = useState(false); // Off by default to prevent lag
  const [showLayersDropdown, setShowLayersDropdown] = useState(false);
  const [satelliteOpacity, setSatelliteOpacity] = useState<number>(0.2); // Low opacity allows crisp satellite view

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
      preferCanvas: true, // GPU Canvas renderer prevents lag!
    });

    // Default 4K Esri World Imagery (Satellite)
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
    khoroosLayerGroup.current = L.layerGroup().addTo(map);
    stationsLayerGroup.current = L.layerGroup().addTo(map);
    incidentsLayerGroup.current = L.layerGroup().addTo(map);
    userLocationLayerGroup.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
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
    } else if (style === 'topo') {
      const base = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap &copy; OpenTopoMap',
        maxZoom: 17,
        subdomains: 'abc',
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
          mapInstanceRef.current.flyTo(match.center, 12, { duration: 0.8 });
        }
      }
    }
  }, [selectedDistrictId]);

  // 4. Render District Polygons (Optimized)
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
        weight: isSelected ? 3 : 1.5,
        opacity: isSelected ? 1 : 0.8,
        fillColor: fillColor,
        fillOpacity: isSelected ? satelliteOpacity + 0.15 : satelliteOpacity,
      });

      polygon.on('click', () => {
        setActiveDistrict(d);
        setSelectedKhoroo(null);
        setIsPanelOpen(true);
        if (onSelectDistrict) onSelectDistrict(d.id);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(d.center, 12, { duration: 0.8 });
        }
      });

      polygon.bindTooltip(
        `<div style="font-family: inherit; padding: 4px;">
          <div style="font-weight: 700; color: #0B124D; font-size: 13px;">${
            language === 'mn' ? d.nameMn : d.nameEn
          } дүүрэг</div>
          <div style="font-size: 11px; color: #72778A;">
            ${t.riskIndicatorTitle}: <b style="color:${fillColor}">${d.riskScore}/100</b>
          </div>
          <div style="font-size: 10px; color: #0B124D; margin-top: 2px;">
            ${d.khoroosCount} хороотой • Дарж нарийвчлах
          </div>
        </div>`,
        { sticky: true }
      );

      group.addLayer(polygon);
    });
  }, [activeDistrict, satelliteOpacity, language]);

  // 5. Render Khoroo Markers (Filtered to avoid clutter & lag)
  const visibleKhoroos = useMemo(() => {
    if (khorooMode === 'none') return [];
    if (khorooMode === 'all') return UB_KHOROOS;
    // 'district_only' mode: Only show khoroos for the currently selected district
    if (!activeDistrict) return [];
    return UB_KHOROOS.filter((k) => k.districtId === activeDistrict.id);
  }, [khorooMode, activeDistrict]);

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

      // Lightweight HTML Badge
      const khorooIcon = L.divIcon({
        className: 'custom-khoroo-marker',
        html: `
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: ${isSelected ? '#0B124D' : 'rgba(255, 255, 255, 0.95)'};
            color: ${isSelected ? '#FFFFFF' : '#0B124D'};
            padding: 2px 7px;
            border-radius: 9999px;
            border: 2px solid ${badgeBg};
            box-shadow: 0 2px 8px rgba(0,0,0,0.18);
            cursor: pointer;
            white-space: nowrap;
            font-size: 11px;
            font-weight: 700;
            transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
            transition: transform 0.15s ease;
          ">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: ${badgeBg};"></span>
            <span>${kh.khorooNumber}-р хороо</span>
            <span style="font-family: monospace; font-size: 10px; padding: 0.5px 3.5px; border-radius: 4px; background: ${badgeBg}; color: white;">${kh.riskScore}%</span>
          </div>
        `,
        iconSize: [100, 24],
        iconAnchor: [50, 12],
      });

      const marker = L.marker(kh.center, { icon: khorooIcon });

      marker.on('click', () => {
        setSelectedKhoroo(kh);
        setIsPanelOpen(true);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(kh.center, 14, { duration: 0.8 });
        }
      });

      marker.bindTooltip(
        `<div style="font-family: inherit; padding: 4px;">
          <div style="font-weight: 700; color: #0B124D; font-size: 12px;">${
            language === 'mn' ? kh.nameMn : kh.nameEn
          }</div>
          <div style="font-size: 11px; color: ${badgeBg}; font-weight: 700;">
            Эрсдэл: ${kh.riskScore}% (${kh.riskLevel === 'very_high' ? 'Маш өндөр' : kh.riskLevel === 'high' ? 'Өндөр' : 'Дунд'})
          </div>
          <div style="font-size: 10px; color: #72778A; margin-top: 2px;">
            Гэр хороолол: ${kh.gerHouseholdPercent}% • Гал сөнөөгч: ~${kh.avgResponseTimeMin} мин
          </div>
        </div>`,
        { sticky: true }
      );

      group.addLayer(marker);
    });
  }, [visibleKhoroos, selectedKhoroo, language]);

  // 6. Render Fire Stations
  useEffect(() => {
    const group = stationsLayerGroup.current;
    if (!group) return;
    group.clearLayers();

    if (!showStations) return;

    UB_FIRE_STATIONS.forEach((sta) => {
      const stationIcon = L.divIcon({
        className: 'custom-station-icon',
        html: `
          <div style="background-color: #0B124D; color: white; width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(11,18,77,0.35); border: 2px solid white; cursor: pointer;">
            <svg style="width: 13px; height: 13px; stroke: #FF633C;" viewBox="0 0 24 24" fill="none" stroke-width="2.5">
              <path d="M12 2C8 6 6 9 6 13a6 6 0 0 0 12 0c0-4-2-7-6-11z" />
            </svg>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker(sta.coordinates, { icon: stationIcon });

      marker.bindPopup(
        `<div style="font-family: inherit; padding: 6px; min-width: 180px;">
          <div style="font-size: 10px; font-weight: 700; color: #FF633C;">${sta.code}</div>
          <div style="font-size: 12px; font-weight: 700; color: #0B124D;">${sta.nameMn}</div>
          <div style="font-size: 10px; color: #72778A; margin: 4px 0;">${sta.addressMn}</div>
          <div style="font-size: 10px; border-top: 1px solid #eee; pt-1;">
            Автомашин: <b>${sta.vehiclesCount}</b> • Бүрэлдэхүүн: <b>${sta.personnelActive}</b>
          </div>
        </div>`
      );

      group.addLayer(marker);
    });
  }, [showStations]);

  // 7. Render Incidents
  useEffect(() => {
    const group = incidentsLayerGroup.current;
    if (!group) return;
    group.clearLayers();

    if (!showIncidents) return;

    DEMO_HISTORICAL_INCIDENTS.forEach((inc) => {
      const circle = L.circleMarker(inc.coordinates, {
        radius: 4,
        fillColor: inc.severity === 'critical' ? '#E93B2F' : '#FF633C',
        color: '#FFFFFF',
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.8,
      });

      circle.bindTooltip(
        `<div style="font-family: inherit; font-size: 10px; padding: 2px;">
          <b>${inc.date}</b>: ${inc.causeGuessMn}
        </div>`
      );

      group.addLayer(circle);
    });
  }, [showIncidents]);

  // Search handler
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
        if (results.length < 8) {
          results.push({ type: 'khoroo', item: kh });
        }
      }
    });

    setSearchResults(results.slice(0, 6));
  };

  const selectSearchResult = (result: { type: 'district' | 'khoroo'; item: DistrictData | KhorooData }) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsPanelOpen(true);

    if (result.type === 'district') {
      const d = result.item as DistrictData;
      setActiveDistrict(d);
      setSelectedKhoroo(null);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(d.center, 12, { duration: 0.8 });
      }
    } else {
      const kh = result.item as KhorooData;
      setSelectedKhoroo(kh);
      const parent = UB_DISTRICTS.find((d) => d.id === kh.districtId);
      if (parent) setActiveDistrict(parent);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(kh.center, 14, { duration: 0.8 });
      }
    }
  };

  // GeoLocate
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
          mapInstanceRef.current.flyTo([userLat, userLng], 13, { duration: 1.0 });
        }
      },
      () => setGeoLocating(false),
      { timeout: 8000 }
    );
  };

  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-[#0B124D] overflow-hidden select-none">
      
      {/* 
        ===================================================================
        TOP BAR: Super-Clean, Compact, Apple-Minimalist Floating Navigation
        Prevents visual clutter and stops collision with right panel!
        ===================================================================
      */}
      <div className="absolute top-3 left-3 z-[990] flex items-center gap-2 flex-wrap max-w-[calc(100vw-24px)] md:max-w-xl">
        
        {/* Search Input */}
        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={language === 'mn' ? 'Дүүрэг, хороо, газар хайх...' : 'Search district, khoroo...'}
            className="w-full pl-8 pr-3 py-2 bg-white/95 backdrop-blur-xl rounded-full text-xs text-[#0B124D] placeholder-[#72778A] border border-black/[0.08] shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF633C]"
          />
          <svg
            className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#72778A]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-black/[0.08] overflow-hidden z-50 p-1 divide-y divide-black/[0.04]">
              {searchResults.map((res, idx) => {
                const isDist = res.type === 'district';
                const d = res.item as DistrictData;
                const kh = res.item as KhorooData;

                return (
                  <button
                    key={idx}
                    onClick={() => selectSearchResult(res)}
                    className="w-full text-left p-2 hover:bg-[#F7F8FA] rounded-xl flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{isDist ? '🏙️' : '📍'}</span>
                      <span className="font-bold text-[#0B124D]">
                        {isDist ? d.nameMn : kh.nameMn}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-[#FF633C]">
                      {isDist ? d.riskScore : kh.riskScore}%
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* PROMINENT "БОДИТ" SATELLITE SWITCHER */}
        <div className="flex items-center bg-white/95 backdrop-blur-xl p-0.5 rounded-full shadow-md border border-black/[0.08] text-xs">
          <button
            onClick={() => handleTileChange('satellite')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1 ${
              tileStyle === 'satellite'
                ? 'bg-[#FF633C] text-white shadow-xs'
                : 'text-[#72778A] hover:text-[#0B124D]'
            }`}
            title="Хиймэл дагуулын бодит зураг"
          >
            <span>🛰️</span>
            <span>{language === 'mn' ? 'Бодит' : 'Satellite'}</span>
          </button>
          <button
            onClick={() => handleTileChange('osm')}
            className={`px-2.5 py-1.5 rounded-full font-medium transition-all ${
              tileStyle === 'osm'
                ? 'bg-[#0B124D] text-white shadow-xs'
                : 'text-[#72778A] hover:text-[#0B124D]'
            }`}
            title="Энгийн зураг"
          >
            {language === 'mn' ? 'Энгийн' : 'Map'}
          </button>
        </div>

        {/* Locate Me */}
        <button
          onClick={handleAnalyzeCurrentArea}
          disabled={geoLocating}
          className="p-2 bg-white/95 hover:bg-white text-[#0B124D] rounded-full text-xs font-semibold shadow-md border border-black/[0.08] transition-all active:scale-95"
          title="Миний байршил"
        >
          <svg className={`w-4 h-4 text-[#FF633C] ${geoLocating ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
          </svg>
        </button>

        {/* Khoroo Layer Filter Pill */}
        <div className="relative">
          <button
            onClick={() => setShowLayersDropdown(!showLayersDropdown)}
            className="px-3 py-1.5 bg-white/95 hover:bg-white text-[#0B124D] rounded-full text-xs font-semibold shadow-md border border-black/[0.08] flex items-center gap-1.5 transition-all"
          >
            <span>🏘️</span>
            <span className="hidden sm:inline">
              {khorooMode === 'district_only'
                ? (language === 'mn' ? 'Энэ дүүргийн хороод' : 'Active Khoroos')
                : khorooMode === 'all'
                ? (language === 'mn' ? 'Бүх хороод' : 'All Khoroos')
                : (language === 'mn' ? 'Хороо нуух' : 'No Khoroos')}
            </span>
            <span className="text-[10px] text-[#72778A]">▾</span>
          </button>

          {showLayersDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-xl border border-black/[0.08] p-1.5 w-48 z-50 text-xs space-y-1">
              <button
                onClick={() => {
                  setKhorooMode('district_only');
                  setShowLayersDropdown(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors ${
                  khorooMode === 'district_only' ? 'bg-[#0B124D] text-white font-bold' : 'hover:bg-slate-100 text-[#0B124D]'
                }`}
              >
                ✓ Сонгосон дүүргийн хороод (Цэгцтэй)
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
                Бүх 204 хороо (Нийслэл даяар)
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
                Хороодын тэмдэглэгээ нуух
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={() => setShowStations(!showStations)}
                className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 text-[#0B124D] flex items-center justify-between"
              >
                <span>🚒 Гал унтраах ангиуд</span>
                <span className="font-bold">{showStations ? 'Тийм' : 'Үгүй'}</span>
              </button>
              <button
                onClick={() => setShowIncidents(!showIncidents)}
                className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 text-[#0B124D] flex items-center justify-between"
              >
                <span>📍 Түүхэн дуудлага</span>
                <span className="font-bold">{showIncidents ? 'Тийм' : 'Үгүй'}</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* 
        ===================================================================
        DISTRICT STRIP: Crisp, horizontally scrollable minimalist pill bar
        ===================================================================
      */}
      <div className="absolute top-14 left-3 z-[980] flex items-center gap-1.5 overflow-x-auto max-w-[calc(100vw-24px)] md:max-w-xl pb-1 scrollbar-none">
        {UB_DISTRICTS.map((d) => {
          const isSel = activeDistrict?.id === d.id && !selectedKhoroo;
          return (
            <button
              key={d.id}
              onClick={() => {
                setActiveDistrict(d);
                setSelectedKhoroo(null);
                setIsPanelOpen(true);
                if (onSelectDistrict) onSelectDistrict(d.id);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo(d.center, 12, { duration: 0.8 });
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm backdrop-blur-md transition-all ${
                isSel
                  ? 'bg-[#0B124D] text-white ring-2 ring-white scale-102 font-bold'
                  : 'bg-white/90 text-[#0B124D] hover:bg-white hover:text-[#FF633C]'
              }`}
            >
              <span>{language === 'mn' ? d.nameMn : d.nameEn}</span>
              <span className={`ml-1 font-mono text-[10px] font-bold ${
                d.riskScore >= 75 ? 'text-red-500' : d.riskScore >= 55 ? 'text-[#FF633C]' : 'text-emerald-600'
              }`}>
                {d.riskScore}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Panel Re-Open Button when panel is closed */}
      {!isPanelOpen && activeDistrict && (
        <button
          onClick={() => setIsPanelOpen(true)}
          className="absolute bottom-4 right-4 z-[990] bg-[#0B124D] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold hover:bg-[#11166B] transition-all active:scale-95 border border-white/20"
        >
          <span>📋</span>
          <span>{activeDistrict.nameMn}: Эрсдэлийн задргаа нээх ({activeDistrict.riskScore}%)</span>
        </button>
      )}

      {/* 
        ===================================================================
        AREA ANALYSIS SLIDE-OVER PANEL:
        Includes itemized causal breakdown ("яагаад ийм хувийн эрсдэлтэй бэ")
        ===================================================================
      */}
      {isPanelOpen && (
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
