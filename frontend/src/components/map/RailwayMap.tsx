import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { RouteGeometry, StationReference, TrainPosition } from '../../types';
import { mapConfig } from './mapConfig';
import { calculateRouteProgress, getRouteBounds } from './turfUtils';
import { Locate, Moon, Sun, Compass, Maximize2, Minimize2, Plus, Minus, Layers, Gauge, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';

interface RailwayMapProps {
  routeGeometry: RouteGeometry;
  position: TrainPosition;
  currentStation?: StationReference;
  nextStation?: StationReference;
  onStationClick?: (station: StationReference) => void;
}

export const RailwayMap: React.FC<RailwayMapProps> = ({
  routeGeometry,
  position,
  currentStation,
  nextStation,
  onStationClick,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const trainMarkerRef = useRef<maplibregl.Marker | null>(null);
  const stationMarkersRef = useRef<maplibregl.Marker[]>([]);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFollowMode, setIsFollowMode] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Helper to get active style
  const getActiveStyle = useCallback(
    (dark: boolean, fallback: boolean) => {
      if (fallback) {
        return dark ? mapConfig.fallbackDark : mapConfig.fallbackLight;
      }
      return dark ? mapConfig.styleDark : mapConfig.styleLight;
    },
    []
  );

  const fitRouteBounds = useCallback(() => {
    const map = mapRef.current;
    if (!map || !routeGeometry?.route?.coordinates || routeGeometry.route.coordinates.length < 2) return;
    const bounds = getRouteBounds(routeGeometry.route.coordinates);
    if (bounds) {
      map.fitBounds(bounds, {
        padding: { top: 60, bottom: 60, left: 60, right: 60 },
        maxZoom: 11,
        duration: 800,
      });
    }
  }, [routeGeometry]);

  const renderStationMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map || !routeGeometry?.stations) return;

    // Clear previous markers
    stationMarkersRef.current.forEach((m) => m.remove());
    stationMarkersRef.current = [];

    routeGeometry.stations.forEach((station) => {
      const isCurrent = currentStation?.code === station.code;
      const isNext = nextStation?.code === station.code;
      const isTerminal = station.distanceKm === 0 || station.distanceKm === routeGeometry.distanceKm;

      const el = document.createElement('div');
      el.className = 'cursor-pointer group flex flex-col items-center select-none';

      let markerColor = 'bg-slate-400';
      let markerSize = 'w-3 h-3';
      let ringClass = 'border-2 border-white shadow-xs';

      if (isCurrent) {
        markerColor = 'bg-emerald-500';
        markerSize = 'w-4.5 h-4.5';
        ringClass = 'border-2 border-white shadow-lg ring-4 ring-emerald-400/40 animate-pulse';
      } else if (isNext) {
        markerColor = 'bg-amber-500';
        markerSize = 'w-4 h-4';
        ringClass = 'border-2 border-white shadow-md ring-2 ring-amber-300';
      } else if (isTerminal) {
        markerColor = 'bg-indigo-600';
        markerSize = 'w-3.5 h-3.5';
        ringClass = 'border-2 border-white shadow-md ring-2 ring-indigo-300';
      }

      el.innerHTML = `
        <div class="rounded-full ${ringClass} ${markerColor} ${markerSize} transition-transform group-hover:scale-135"></div>
        <div class="mt-1 px-1.5 py-0.5 bg-white/95 backdrop-blur-xs text-[9px] font-black text-slate-800 rounded-md shadow-xs border border-slate-200/80 group-hover:bg-indigo-600 group-hover:text-white transition-colors whitespace-nowrap">
          ${station.code}
        </div>
      `;

      // Popup with detailed halt info
      const popupHtml = `
        <div class="p-2.5 min-w-[170px] text-left font-sans">
          <div class="font-extrabold text-xs text-slate-900">${station.name} (${station.code})</div>
          ${station.platform ? `<div class="text-[11px] font-bold text-indigo-600 mt-0.5">Platform ${station.platform}</div>` : ''}
          <div class="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span class="text-slate-400">Scheduled:</span>
            <span class="font-bold text-slate-800">${station.scheduledArrival || station.scheduledDeparture || '--:--'}</span>
          </div>
          ${station.distanceKm !== undefined ? `
            <div class="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
              <span>Distance:</span>
              <span class="font-bold text-slate-700">${station.distanceKm} km</span>
            </div>
          ` : ''}
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 15, closeButton: false }).setHTML(popupHtml);

      el.addEventListener('click', () => {
        if (onStationClick) onStationClick(station);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([station.longitude, station.latitude])
        .setPopup(popup)
        .addTo(map);

      stationMarkersRef.current.push(marker);
    });
  }, [routeGeometry, currentStation, nextStation, onStationClick]);

  const renderTrainMarker = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    if (trainMarkerRef.current) {
      trainMarkerRef.current.setLngLat([position.longitude, position.latitude]);
      return;
    }

    const el = document.createElement('div');
    el.className = 'relative flex items-center justify-center cursor-pointer z-30 group';
    el.innerHTML = `
      <div class="absolute w-12 h-12 bg-indigo-500/30 rounded-full animate-ping pointer-events-none"></div>
      <div class="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 border-2 border-white ring-2 ring-indigo-400/30">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2c-4 0-8 2-8 6v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-4-4-6-8-6z"/>
          <path d="M4 11h16"/>
          <circle cx="8" cy="16" r="1"/>
          <circle cx="16" cy="16" r="1"/>
        </svg>
      </div>
    `;

    const popupHtml = `
      <div class="p-2.5 text-left font-sans">
        <div class="font-black text-xs text-indigo-700 uppercase tracking-wide">Live Train Location</div>
        <div class="text-xs text-slate-800 font-bold mt-1 flex items-center gap-1.5">
          <span>Speed:</span>
          <span class="text-indigo-600 font-extrabold">${position.speedKmh ?? 85} km/h</span>
        </div>
        <div class="text-[10px] text-slate-400 mt-1 font-mono">${position.latitude.toFixed(4)}°N, ${position.longitude.toFixed(4)}°E</div>
      </div>
    `;

    const popup = new maplibregl.Popup({ offset: 20, closeButton: false }).setHTML(popupHtml);

    trainMarkerRef.current = new maplibregl.Marker({ element: el })
      .setLngLat([position.longitude, position.latitude])
      .setPopup(popup)
      .addTo(map);
  }, [position]);

  const renderRouteAndStations = useCallback(() => {
    const map = mapRef.current;
    if (!map || !routeGeometry?.route?.coordinates || routeGeometry.route.coordinates.length < 2) return;

    if (!map.isStyleLoaded()) {
      map.once('style.load', () => renderRouteAndStations());
      return;
    }

    const coords = routeGeometry.route.coordinates;
    const trainPoint: [number, number] = [position.longitude, position.latitude];
    const { completedRoute, remainingRoute } = calculateRouteProgress(coords, trainPoint);

    // Clean existing route layers and sources
    if (map.getLayer('remaining-route-layer')) map.removeLayer('remaining-route-layer');
    if (map.getSource('remaining-route')) map.removeSource('remaining-route');

    if (map.getLayer('completed-route-glow')) map.removeLayer('completed-route-glow');
    if (map.getLayer('completed-route-layer')) map.removeLayer('completed-route-layer');
    if (map.getSource('completed-route')) map.removeSource('completed-route');

    // Add remaining track layer (dashed / muted)
    map.addSource('remaining-route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: remainingRoute.length > 0 ? remainingRoute : coords,
        },
      },
    });

    map.addLayer({
      id: 'remaining-route-layer',
      type: 'line',
      source: 'remaining-route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': isDarkMode ? '#475569' : '#94a3b8',
        'line-width': 4,
        'line-dasharray': [2, 2],
      },
    });

    // Add completed track layer (solid vibrant indigo + glow)
    map.addSource('completed-route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: completedRoute.length > 0 ? completedRoute : [coords[0], trainPoint],
        },
      },
    });

    map.addLayer({
      id: 'completed-route-glow',
      type: 'line',
      source: 'completed-route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#6366f1',
        'line-width': 10,
        'line-opacity': 0.4,
      },
    });

    map.addLayer({
      id: 'completed-route-layer',
      type: 'line',
      source: 'completed-route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#4f46e5',
        'line-width': 5,
      },
    });

    // Render station and train markers
    renderStationMarkers();
    renderTrainMarker();
  }, [routeGeometry, position, isDarkMode, renderStationMarkers, renderTrainMarker]);

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainer.current) return;

    const initialStyle = getActiveStyle(isDarkMode, usingFallback);

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: initialStyle as any,
      center: [position.longitude || 78.9629, position.latitude || 20.5937],
      zoom: 6,
      pitch: 25,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('error', (e) => {
      if (!usingFallback && (e.error?.message?.includes('style') || e.error?.message?.includes('Failed to fetch'))) {
        setUsingFallback(true);
      }
    });

    map.on('dragstart', () => {
      setUserInteracted(true);
      setIsFollowMode(false);
    });

    map.on('load', () => {
      mapRef.current = map;
      renderRouteAndStations();
      fitRouteBounds();
    });

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    if (mapContainer.current) {
      resizeObserver.observe(mapContainer.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // When routeGeometry updates or arrives from API, redraw route & fit bounds
  useEffect(() => {
    if (!mapRef.current) return;
    renderRouteAndStations();
    if (!userInteracted) {
      fitRouteBounds();
    }
  }, [routeGeometry, renderRouteAndStations, fitRouteBounds, userInteracted]);

  // Update map style when theme or fallback changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const nextStyle = getActiveStyle(isDarkMode, usingFallback);
    map.setStyle(nextStyle as any);
    map.once('style.load', () => {
      renderRouteAndStations();
    });
  }, [isDarkMode, usingFallback, getActiveStyle, renderRouteAndStations]);

  // Update train marker and center when position changes
  useEffect(() => {
    if (trainMarkerRef.current) {
      trainMarkerRef.current.setLngLat([position.longitude, position.latitude]);
    }

    if (mapRef.current && isFollowMode && !userInteracted) {
      mapRef.current.easeTo({
        center: [position.longitude, position.latitude],
        duration: 1000,
      });
    }
  }, [position, isFollowMode, userInteracted]);

  const handleRecenter = () => {
    setUserInteracted(false);
    setIsFollowMode(true);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [position.longitude, position.latitude],
        zoom: 9,
        speed: 1.2,
      });
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut({ duration: 300 });
  };

  const toggleFullscreen = () => {
    if (!mapContainer.current) return;
    if (!document.fullscreenElement) {
      mapContainer.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden shadow-lg shadow-indigo-950/5 border border-slate-200/80 group">
      <div ref={mapContainer} className="w-full h-full min-h-[420px]" />

      {/* Floating HUD Telemetry Pill (Top Left) */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-md flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
            <Gauge className="w-3.5 h-3.5 text-indigo-600" />
            <span>{position.speedKmh ?? 85} km/h</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{routeGeometry?.stations?.length || 0} Halts</span>
          </div>
        </div>
      </div>

      {/* Floating Controls Toolbar (Top Right) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Recenter Button when user pans away */}
        {(!isFollowMode || userInteracted) && (
          <Button
            variant="primary"
            size="sm"
            icon={<Locate className="w-4 h-4" />}
            onClick={handleRecenter}
            className="shadow-lg backdrop-blur-md animate-fadeIn cursor-pointer"
          >
            Recenter Train
          </Button>
        )}

        <div className="flex flex-col bg-white/90 backdrop-blur-md rounded-2xl shadow-md border border-slate-200/90 overflow-hidden divide-y divide-slate-100">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Toggle Dark Map Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={fitRouteBounds}
            className="p-2.5 text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Fit Entire Route"
          >
            <Compass className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomIn}
            className="p-2.5 text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomOut}
            className="p-2.5 text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
