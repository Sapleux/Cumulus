/** Coordinates as [longitude, latitude] tuple */
export interface GeoapifyGeometry {
  coordinates: [number, number];
}

/** Address properties returned by Geoapify */
export interface GeoapifyProperties {
  formatted: string;
  city?: string;
  country?: string;
  state?: string;
}

/** A single GeoJSON feature returned by Geoapify */
export interface GeoapifyFeature {
  geometry: GeoapifyGeometry;
  properties: GeoapifyProperties;
}

/** Response from Geoapify */
export interface GeoapifyResponse {
  features: GeoapifyFeature[];
}

/** Identifies an OWM weather tile layer. */
export type WeatherLayerType = 'temp_new' | 'wind_new' | 'precipitation_new' | 'clouds_new';

/** Represents a rain drop animation on the canvas overlay */
export interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}