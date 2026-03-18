import { WeatherLayerType } from './map.types';

// Map
export const DEFAULT_CENTER: [number, number] = [2.3522, 48.8566];
export const DEFAULT_ZOOM = 6;
export const CITY_ZOOM = 12;
export const USER_ZOOM = 13;
export const MAP_ANIMATION_DURATION = 800;
export const USER_ANIMATION_DURATION = 1000;

// Weather layer
export const WEATHER_LAYER_TYPES: readonly WeatherLayerType[] = [
  'temp_new', 'wind_new', 'precipitation_new', 'clouds_new',
] as const;

// Rain animation
export const RAIN_DROP_COUNT = 150;
export const RAIN_SPEED_MIN = 4;
export const RAIN_SPEED_RANGE = 6;
export const RAIN_LENGTH_MIN = 15;
export const RAIN_LENGTH_RANGE = 20;
export const RAIN_OPACITY_MIN = 0.6;
export const RAIN_OPACITY_RANGE = 0.4;
export const RAIN_LINE_WIDTH = 2;
export const RAIN_CANVAS_DELAY_MS = 50;
export const RAIN_DIAGONAL = 0.5;

// Marker
export const MARKER_SCALE = 0.05;
export const MARKER_ICON_URL = 'https://cdn-icons-png.flaticon.com/512/684/684908.png';

// Search
export const AUTOCOMPLETE_MIN_LENGTH = 2;