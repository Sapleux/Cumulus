import { WeatherInterpretationCode } from '../../models/weather.model';

export interface CityCoordinates {
  lat: number;
  lon: number;
}

export type CitySource = 'mock' | 'liked';

export interface FavoriteCity {
  name: string;
  country: string;
  temperature: number;
  icon: string;
  condition: string;
  humidity: number;
  wind: number;
  cloudCover: number;
  pressure: number;
  lastUpdate: string;
  weatherCode: WeatherInterpretationCode;
  coords: CityCoordinates;
  source: CitySource;
}
