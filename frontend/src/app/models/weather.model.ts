export enum WeatherInterpretationCode {
  ClearSky,
  MainlyClear,
  Fog,
  Drizzle,
  Rain,
  Snow,
  Thunderstorm
}

export interface WeatherTheme {
  bgGradient: string;
  cardGradient: string;
  borderColor: string;
  accentColor: string;
  textColor: string;
  icon: string;
  iconSize: string;
  overlayColor: string;
}

export const WEATHER_THEMES: { [key in WeatherInterpretationCode]: WeatherTheme } = {
  [WeatherInterpretationCode.ClearSky]: {
    bgGradient: 'linear-gradient(180deg, #60a5fa 0%, #93c5fd 50%, #dbeafe 100%)',
    cardGradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    accentColor: '#f59e0b',
    textColor: '#1e3a8a',
    icon: 'icon-sun',
    iconSize: '12rem',
    overlayColor: 'rgba(255, 255, 255, 0.25)'
  },
  [WeatherInterpretationCode.MainlyClear]: {
    bgGradient: 'linear-gradient(180deg, #7dd3fc 0%, #bae6fd 50%, #e0f2fe 100%)',
    cardGradient: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
    borderColor: 'rgba(14, 165, 233, 0.3)',
    accentColor: '#0ea5e9',
    textColor: '#075985',
    icon: 'icon-partly-cloudy',
    iconSize: '12rem',
    overlayColor: 'rgba(255, 255, 255, 0.2)'
  },
  [WeatherInterpretationCode.Fog]: {
    bgGradient: 'linear-gradient(180deg, #9ca3af 0%, #d1d5db 50%, #e5e7eb 100%)',
    cardGradient: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
    borderColor: 'rgba(107, 114, 128, 0.3)',
    accentColor: '#6b7280',
    textColor: '#374151',
    icon: 'icon-fog',
    iconSize: '12rem',
    overlayColor: 'rgba(255, 255, 255, 0.3)'
  },
  [WeatherInterpretationCode.Drizzle]: {
    bgGradient: 'linear-gradient(180deg, #7dd3fc 0%, #a5f3fc 50%, #cffafe 100%)',
    cardGradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
    accentColor: '#06b6d4',
    textColor: '#0e7490',
    icon: 'icon-drizzle',
    iconSize: '12rem',
    overlayColor: 'rgba(255, 255, 255, 0.2)'
  },
  [WeatherInterpretationCode.Rain]: {
    bgGradient: 'linear-gradient(180deg, #475569 0%, #64748b 50%, #94a3b8 100%)',
    cardGradient: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
    borderColor: 'rgba(51, 65, 85, 0.3)',
    accentColor: '#353f4b',
    textColor: '#1e293b',
    icon: 'icon-rain',
    iconSize: '12rem',
    overlayColor: 'rgba(255, 255, 255, 0.15)'
  },
  [WeatherInterpretationCode.Snow]: {
    bgGradient: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 50%, #ffffff 100%)',
    cardGradient: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
    borderColor: 'rgba(147, 197, 253, 0.4)',
    accentColor: '#fcfcfc',
    textColor: '#1e3a8a',
    icon: 'icon-snow',
    iconSize: '12rem',
    overlayColor: 'rgba(255, 255, 255, 0.35)'
  },
  [WeatherInterpretationCode.Thunderstorm]: {
    bgGradient: 'linear-gradient(180deg, #374151 0%, #4b5563 50%, #6b7280 100%)',
    cardGradient: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
    borderColor: 'rgba(31, 41, 55, 0.4)',
    accentColor: '#ffffff',
    textColor: '#111827',
    icon: 'icon-thunderstorm',
    iconSize: '12rem',
    overlayColor: 'rgba(255, 255, 255, 0.1)'
  }
};
