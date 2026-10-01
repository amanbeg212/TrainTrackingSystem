// MapTiler API key — loaded from VITE_MAPTILER_API_KEY env variable, fallback to hardcoded key
const MAPTILER_KEY = ((import.meta as any).env?.VITE_MAPTILER_API_KEY as string) || 'byB6gCIdawcKnz2Snm14';

/**
 * MapTiler official vector styles — canonical way to use MapTiler with MapLibre GL JS
 */
export const MAPTILER_STYLE_LIGHT = `https://api.maptiler.com/maps/dataviz/style.json?key=${MAPTILER_KEY}`;
export const MAPTILER_STYLE_DARK  = `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}`;

/**
 * Fallback raster basemaps — used if MapTiler vector style encounters an error
 */
export const FALLBACK_STYLE_LIGHT = {
  version: 8 as const,
  sources: {
    'carto-voyager': {
      type: 'raster' as const,
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '© <a href="https://carto.com/">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  layers: [{ id: 'carto-voyager-layer', type: 'raster' as const, source: 'carto-voyager' }],
};

export const FALLBACK_STYLE_DARK = {
  version: 8 as const,
  sources: {
    'carto-dark': {
      type: 'raster' as const,
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '© <a href="https://carto.com/">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  layers: [{ id: 'carto-dark-layer', type: 'raster' as const, source: 'carto-dark' }],
};

export const mapConfig = {
  styleLight: MAPTILER_STYLE_LIGHT,
  styleDark: MAPTILER_STYLE_DARK,
  fallbackLight: FALLBACK_STYLE_LIGHT,
  fallbackDark: FALLBACK_STYLE_DARK,
};

export { MAPTILER_KEY };

