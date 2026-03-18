import { WeatherInterpretationCode } from '../../models/weather.model';

export interface FakeCityData {
  weatherCode: WeatherInterpretationCode;
  temperature: number;
  hourlyTemps: number[];
  weeklyForecast: { wic: WeatherInterpretationCode; tempMin: number; tempMax: number }[];
  sunrise: string;
  sunset: string;
  uvs: number[];
  winds: number[];
  precipitations: number[];
}

export const FAKE_CITIES: { [name: string]: FakeCityData } = {
  'Ensoleille': {
    weatherCode: WeatherInterpretationCode.ClearSky,
    temperature: 28,
    hourlyTemps: [18, 17, 17, 18, 19, 21, 23, 25, 27, 28, 29, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 19, 18],
    weeklyForecast: [
      { wic: WeatherInterpretationCode.ClearSky,    tempMin: 18, tempMax: 29 },
      { wic: WeatherInterpretationCode.ClearSky,    tempMin: 19, tempMax: 30 },
      { wic: WeatherInterpretationCode.MainlyClear, tempMin: 17, tempMax: 27 },
      { wic: WeatherInterpretationCode.ClearSky,    tempMin: 20, tempMax: 31 },
      { wic: WeatherInterpretationCode.ClearSky,    tempMin: 18, tempMax: 28 },
      { wic: WeatherInterpretationCode.MainlyClear, tempMin: 16, tempMax: 26 },
      { wic: WeatherInterpretationCode.ClearSky,    tempMin: 19, tempMax: 29 },
    ],
    sunrise: '06h30', sunset: '20h15',
    uvs:            [0, 0, 0, 0, 0, 0, 1, 2, 4, 6, 8, 9, 10, 9, 8, 6, 4, 2, 1, 0, 0, 0, 0, 0],
    winds:          [5, 5, 4, 4, 4, 5, 6, 7, 8, 8, 9, 9,  8, 8, 7, 7, 6, 6, 5, 5, 5, 4, 4, 5],
    precipitations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  'Nuageux': {
    weatherCode: WeatherInterpretationCode.MainlyClear,
    temperature: 22,
    hourlyTemps: [15, 14, 14, 15, 16, 18, 19, 20, 21, 22, 22, 22, 21, 21, 20, 20, 19, 18, 17, 17, 16, 16, 15, 15],
    weeklyForecast: [
      { wic: WeatherInterpretationCode.MainlyClear, tempMin: 14, tempMax: 22 },
      { wic: WeatherInterpretationCode.MainlyClear, tempMin: 15, tempMax: 23 },
      { wic: WeatherInterpretationCode.ClearSky,    tempMin: 16, tempMax: 25 },
      { wic: WeatherInterpretationCode.Drizzle,     tempMin: 13, tempMax: 20 },
      { wic: WeatherInterpretationCode.MainlyClear, tempMin: 14, tempMax: 22 },
      { wic: WeatherInterpretationCode.MainlyClear, tempMin: 15, tempMax: 21 },
      { wic: WeatherInterpretationCode.ClearSky,    tempMin: 17, tempMax: 24 },
    ],
    sunrise: '07h00', sunset: '19h45',
    uvs:            [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0],
    winds:          [10, 10, 9, 9, 10, 11, 12, 13, 13, 12, 12, 11, 11, 10, 10, 9, 9, 9, 10, 10, 11, 11, 10, 10],
    precipitations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  'Brouillard': {
    weatherCode: WeatherInterpretationCode.Fog,
    temperature: 15,
    hourlyTemps: [12, 11, 11, 11, 12, 13, 14, 14, 15, 15, 15, 15, 14, 14, 14, 13, 13, 13, 12, 12, 12, 11, 11, 12],
    weeklyForecast: [
      { wic: WeatherInterpretationCode.Fog,         tempMin: 11, tempMax: 15 },
      { wic: WeatherInterpretationCode.Fog,         tempMin: 10, tempMax: 14 },
      { wic: WeatherInterpretationCode.MainlyClear, tempMin: 12, tempMax: 17 },
      { wic: WeatherInterpretationCode.Fog,         tempMin: 11, tempMax: 15 },
      { wic: WeatherInterpretationCode.Drizzle,     tempMin: 10, tempMax: 13 },
      { wic: WeatherInterpretationCode.Fog,         tempMin: 11, tempMax: 14 },
      { wic: WeatherInterpretationCode.MainlyClear, tempMin: 13, tempMax: 18 },
    ],
    sunrise: '07h20', sunset: '19h10',
    uvs:            [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    winds:          [4, 4, 3, 3, 3, 4, 4, 5, 5, 5, 5, 4, 4, 4, 3, 3, 3, 4, 4, 4, 4, 3, 3, 4],
    precipitations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  'Bruine': {
    weatherCode: WeatherInterpretationCode.Drizzle,
    temperature: 16,
    hourlyTemps: [13, 13, 12, 12, 13, 14, 15, 15, 16, 16, 16, 16, 15, 15, 15, 14, 14, 13, 13, 13, 12, 12, 13, 13],
    weeklyForecast: [
      { wic: WeatherInterpretationCode.Drizzle,     tempMin: 12, tempMax: 16 },
      { wic: WeatherInterpretationCode.Rain,        tempMin: 11, tempMax: 15 },
      { wic: WeatherInterpretationCode.Drizzle,     tempMin: 12, tempMax: 16 },
      { wic: WeatherInterpretationCode.MainlyClear, tempMin: 13, tempMax: 18 },
      { wic: WeatherInterpretationCode.Drizzle,     tempMin: 12, tempMax: 15 },
      { wic: WeatherInterpretationCode.Rain,        tempMin: 10, tempMax: 14 },
      { wic: WeatherInterpretationCode.Drizzle,     tempMin: 11, tempMax: 16 },
    ],
    sunrise: '07h10', sunset: '19h30',
    uvs:            [0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    winds:          [16, 16, 15, 15, 16, 17, 18, 18, 18, 17, 17, 16, 16, 15, 15, 16, 16, 17, 18, 18, 17, 16, 16, 16],
    precipitations: [0.1, 0.1, 0.2, 0.2, 0.3, 0.3, 0.4, 0.5, 0.5, 0.4, 0.3, 0.3, 0.2, 0.2, 0.3, 0.3, 0.4, 0.4, 0.3, 0.2, 0.2, 0.1, 0.1, 0.1],
  },
  'Pluvieux': {
    weatherCode: WeatherInterpretationCode.Rain,
    temperature: 12,
    hourlyTemps: [10, 9, 9, 9, 10, 11, 11, 12, 12, 12, 12, 12, 11, 11, 11, 10, 10, 10, 9, 9, 9, 9, 10, 10],
    weeklyForecast: [
      { wic: WeatherInterpretationCode.Rain,        tempMin:  9, tempMax: 12 },
      { wic: WeatherInterpretationCode.Rain,        tempMin:  8, tempMax: 11 },
      { wic: WeatherInterpretationCode.Thunderstorm,tempMin:  9, tempMax: 13 },
      { wic: WeatherInterpretationCode.Rain,        tempMin: 10, tempMax: 14 },
      { wic: WeatherInterpretationCode.Drizzle,     tempMin: 11, tempMax: 15 },
      { wic: WeatherInterpretationCode.Rain,        tempMin:  9, tempMax: 12 },
      { wic: WeatherInterpretationCode.MainlyClear, tempMin: 12, tempMax: 17 },
    ],
    sunrise: '07h40', sunset: '19h00',
    uvs:            [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    winds:          [20, 20, 21, 21, 22, 22, 22, 21, 21, 20, 20, 19, 19, 20, 21, 22, 22, 21, 20, 20, 19, 19, 20, 20],
    precipitations: [0.5, 0.6, 0.7, 0.8, 0.8, 0.9, 1.0, 1.2, 1.3, 1.2, 1.0, 0.9, 0.8, 0.7, 0.8, 0.9, 1.0, 1.1, 1.0, 0.8, 0.7, 0.6, 0.5, 0.5],
  },
  'Neige': {
    weatherCode: WeatherInterpretationCode.Snow,
    temperature: -2,
    hourlyTemps: [-5, -6, -6, -6, -5, -4, -3, -2, -2, -2, -1, -1, -2, -2, -3, -4, -5, -5, -6, -6, -6, -6, -5, -5],
    weeklyForecast: [
      { wic: WeatherInterpretationCode.Snow,        tempMin: -6, tempMax: -1 },
      { wic: WeatherInterpretationCode.Snow,        tempMin: -7, tempMax: -2 },
      { wic: WeatherInterpretationCode.Snow,        tempMin: -5, tempMax:  0 },
      { wic: WeatherInterpretationCode.MainlyClear, tempMin: -3, tempMax:  2 },
      { wic: WeatherInterpretationCode.Snow,        tempMin: -6, tempMax: -1 },
      { wic: WeatherInterpretationCode.Snow,        tempMin: -8, tempMax: -3 },
      { wic: WeatherInterpretationCode.ClearSky,    tempMin: -4, tempMax:  3 },
    ],
    sunrise: '07h50', sunset: '18h30',
    uvs:            [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    winds:          [13, 13, 12, 12, 13, 14, 15, 15, 15, 14, 14, 13, 13, 12, 12, 13, 14, 15, 15, 14, 13, 13, 12, 13],
    precipitations: [0.8, 0.9, 1.0, 1.0, 1.1, 1.2, 1.3, 1.2, 1.0, 0.9, 0.8, 0.7, 0.6, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.1, 1.0, 0.9, 0.8],
  },
  'Orageux': {
    weatherCode: WeatherInterpretationCode.Thunderstorm,
    temperature: 18,
    hourlyTemps: [16, 15, 15, 16, 17, 18, 19, 20, 21, 21, 20, 20, 19, 18, 18, 17, 16, 16, 15, 15, 15, 16, 16, 16],
    weeklyForecast: [
      { wic: WeatherInterpretationCode.Thunderstorm,tempMin: 15, tempMax: 21 },
      { wic: WeatherInterpretationCode.Rain,        tempMin: 14, tempMax: 20 },
      { wic: WeatherInterpretationCode.Thunderstorm,tempMin: 16, tempMax: 22 },
      { wic: WeatherInterpretationCode.Rain,        tempMin: 15, tempMax: 19 },
      { wic: WeatherInterpretationCode.Drizzle,     tempMin: 16, tempMax: 21 },
      { wic: WeatherInterpretationCode.MainlyClear, tempMin: 17, tempMax: 24 },
      { wic: WeatherInterpretationCode.Thunderstorm,tempMin: 14, tempMax: 20 },
    ],
    sunrise: '06h50', sunset: '19h55',
    uvs:            [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    winds:          [32, 33, 33, 34, 35, 36, 36, 35, 34, 33, 32, 31, 31, 32, 33, 34, 35, 35, 34, 33, 32, 31, 31, 32],
    precipitations: [1.0, 1.2, 1.5, 1.8, 2.0, 2.2, 2.5, 2.8, 3.0, 2.8, 2.5, 2.2, 2.0, 1.8, 1.5, 1.2, 1.5, 1.8, 2.0, 1.8, 1.5, 1.2, 1.0, 1.0],
  },
};

export const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
