import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherInterpretationCode, WEATHER_THEMES, WeatherTheme } from '../../models/weather.model';
import { WeatherService, WeatherIntrepretationCode, DayCharts } from '../../services/weather.service';
import { forkJoin } from 'rxjs';
import { CITY_COORDS, DAY_NAMES, FAKE_CITIES, FakeCityData } from './city-detail.data';

@Component({
  selector: 'app-city-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-detail.component.html',
  styleUrl: './city-detail.component.css',
})
export class CityDetailComponent implements OnInit {
  city: any = { name: '' };
  hoveredHour: any = null;
  selectedDay: string | null = null;
  selectedDayIndex = 0;
  sunrise = '--:--';
  sunset = '--:--';
  fakeDaylightDuration: string | null = null;
  currentTheme: WeatherTheme = WEATHER_THEMES[WeatherInterpretationCode.ClearSky];
  weatherCode: WeatherInterpretationCode = WeatherInterpretationCode.ClearSky;
  tooltipPosition = { top: 0, left: 0 };
  loading = true;

  hourlyForecast: any[] = [];
  weeklyForecast: { name: string; icon: string; tempMin: number; tempMax: number; date: Date }[] = [];

  uvChartPath = '';
  uvFillPath = '';
  windChartPath = '';
  windFillPath = '';
  precipitationBars: { height: number; value: number }[] = [];
  uvPoints: { x: number; y: number; value: number }[] = [];
  windPoints: { x: number; y: number; value: number }[] = [];

  hoveredUV: number | null = null;
  hoveredWind: number | null = null;
  hoveredPrecipitation: number | null = null;

  private dayCharts: DayCharts | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weatherService: WeatherService
  ) { }

  ngOnInit(): void {
    const cityName = this.route.snapshot.paramMap.get('name') || 'Belfort';
    this.city = { name: cityName };

    const fakeData = FAKE_CITIES[cityName];
    if (fakeData) {
      this.loadFakeCity(cityName, fakeData);
      return;
    }

    const coords = CITY_COORDS[cityName] ?? CITY_COORDS['Nice'];
    const today = new Date();

    forkJoin({
      wicTimeline: this.weatherService.getWICTimeline(coords.lat, coords.lon, today, today),
      timelineOver: this.weatherService.getWICTimelineOver(coords.lat, coords.lon, today),
      weekly: this.weatherService.getSummaryOfNextDays(coords.lat, coords.lon),
      charts: this.weatherService.getDayCharts(coords.lat, coords.lon, today),
    }).subscribe({
      next: ({ wicTimeline, timelineOver, weekly, charts }) => {
        const currentHour = today.getHours();
        const serviceWic = wicTimeline[currentHour] ?? WeatherIntrepretationCode.ClearSky;
        this.weatherCode = serviceWic as unknown as WeatherInterpretationCode;
        this.currentTheme = WEATHER_THEMES[this.weatherCode];

        this.hourlyForecast = timelineOver.map((h, i) => ({
          time: `${i.toString().padStart(2, '0')}h`,
          icon: this.wicToIcon(wicTimeline[i]),
          temp: Math.round(h.temperature),
          sunMinutes: Math.round(h.sunDuration / 60),
          wind: Math.round(h.windSpeed),
        }));
        this.city = {
          name: cityName,
          temperature: this.hourlyForecast[currentHour]?.temp ?? '--',
        };

        this.weeklyForecast = weekly.map((day, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          return {
            name: DAY_NAMES[date.getDay()],
            icon: this.wicToIcon(day.wic),
            tempMin: Math.round(day.minTemperature),
            tempMax: Math.round(day.maxTemperature),
            date,
          };
        });

        this.dayCharts = charts;
        this.sunrise = this.formatTime(charts.sunRise);
        this.sunset = this.formatTime(charts.sunSet);
        this.buildCharts(charts);

        if (this.weeklyForecast.length > 0) {
          this.selectedDay = this.weeklyForecast[0].name;
          this.selectedDayIndex = 0;
        }

        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private loadFakeCity(cityName: string, fakeData: FakeCityData): void {
    const today = new Date();

    this.weatherCode = fakeData.weatherCode;
    this.currentTheme = WEATHER_THEMES[this.weatherCode];

    const weatherIcon = this.wicToIcon(fakeData.weatherCode as unknown as WeatherIntrepretationCode);

    this.hourlyForecast = fakeData.hourlyTemps.map((temp, i) => ({
      time: `${i.toString().padStart(2, '0')}h`,
      icon: weatherIcon,
      temp,
      sunMinutes: fakeData.uvs[i] > 0 ? Math.round(fakeData.uvs[i] * 6) : 0,
      wind: fakeData.winds[i],
    }));

    this.city = { name: cityName, temperature: fakeData.temperature };

    this.weeklyForecast = fakeData.weeklyForecast.map((day, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        name: DAY_NAMES[date.getDay()],
        icon: this.wicToIcon(day.wic as unknown as WeatherIntrepretationCode),
        tempMin: day.tempMin,
        tempMax: day.tempMax,
        date,
      };
    });

    this.sunrise = fakeData.sunrise;
    this.sunset = fakeData.sunset;
    this.fakeDaylightDuration = this.computeFakeDaylightDuration(fakeData.sunrise, fakeData.sunset);

    this.buildCharts({
      UVs: fakeData.uvs,
      windSpeeds: fakeData.winds,
      precipitations: fakeData.precipitations,
      sunRise: new Date(),
      sunSet: new Date(),
    } as any);

    if (this.weeklyForecast.length > 0) {
      this.selectedDay = this.weeklyForecast[0].name;
      this.selectedDayIndex = 0;
    }

    this.loading = false;
  }

  selectDay(day: any): void {
    this.selectedDay = day.name;
    this.selectedDayIndex = this.weeklyForecast.indexOf(day);

    if (FAKE_CITIES[this.city.name]) return;

    const coords = CITY_COORDS[this.city.name] ?? CITY_COORDS['Nice'];
    this.weatherService.getDayCharts(coords.lat, coords.lon, day.date as Date).subscribe(charts => {
      this.dayCharts = charts;
      this.sunrise = this.formatTime(charts.sunRise);
      this.sunset = this.formatTime(charts.sunSet);
      this.buildCharts(charts);
    });
  }

  buildCharts(charts: DayCharts): void {
    const sampleUV = Array.from({ length: 12 }, (_, i) => charts.UVs[i * 2] ?? 0);
    const sampleWind = Array.from({ length: 12 }, (_, i) => charts.windSpeeds[i * 2] ?? 0);

    const maxUV = Math.max(...sampleUV, 1);
    this.uvPoints = sampleUV.map((v, i) => ({
      x: (i / 11) * 100,
      y: 38 - (v / maxUV) * 34,
      value: Math.round(v * 10) / 10,
    }));
    this.uvChartPath = this.buildPath(this.uvPoints);
    this.uvFillPath = this.buildFillPath(this.uvPoints);

    const maxWind = Math.max(...sampleWind, 1);
    const minWind = Math.min(...sampleWind);
    const windRange = maxWind - minWind || 1;
    this.windPoints = sampleWind.map((v, i) => ({
      x: (i / 11) * 100,
      y: 38 - ((v - minWind) / windRange) * 34,
      value: Math.round(v),
    }));
    this.windChartPath = this.buildPath(this.windPoints);
    this.windFillPath = this.buildFillPath(this.windPoints);

    const maxPrecip = Math.max(...charts.precipitations, 0.1);
    this.precipitationBars = charts.precipitations.map(v => ({
      height: Math.round((v / maxPrecip) * 100),
      value: Math.round(v * 10) / 10,
    }));
  }

  private buildPath(points: { x: number; y: number }[]): string {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  }

  private buildFillPath(points: { x: number; y: number }[]): string {
    const line = this.buildPath(points);
    const last = points[points.length - 1];
    const first = points[0];
    return `${line} L ${last.x.toFixed(1)} 40 L ${first.x.toFixed(1)} 40 Z`;
  }

  private formatTime(date: Date): string {
    return `${date.getHours().toString().padStart(2, '0')}h${date.getMinutes().toString().padStart(2, '0')}`;
  }

  private computeFakeDaylightDuration(sunrise: string, sunset: string): string {
    const parseTime = (t: string) => {
      const [h, m] = t.replace('h', ':').split(':').map(Number);
      return h * 60 + (m || 0);
    };
    const totalMin = parseTime(sunset) - parseTime(sunrise);
    return `${Math.floor(totalMin / 60)}h ${totalMin % 60}min`;
  }

  private wicToIcon(wic: WeatherIntrepretationCode): string {
    switch (wic) {
      case WeatherIntrepretationCode.ClearSky: return '☀️';
      case WeatherIntrepretationCode.MainlyClear: return '⛅';
      case WeatherIntrepretationCode.Fog: return '🌫️';
      case WeatherIntrepretationCode.Drizzle: return '🌦️';
      case WeatherIntrepretationCode.Rain: return '🌧️';
      case WeatherIntrepretationCode.Snow: return '❄️';
      case WeatherIntrepretationCode.Thunderstorm: return '⛈️';
      default: return '☀️';
    }
  }

  onHourHover(event: MouseEvent, hour: any): void {
    this.hoveredHour = hour;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.tooltipPosition = {
      top: rect.top - 120,
      left: rect.left + rect.width / 2,
    };
  }

  getDayCardGradient(): string {
    const c = this.getThemeBaseColor();
    return `linear-gradient(135deg, ${c}80 0%, ${c}60 100%)`;
  }

  getThemeBaseColor(): string {
    switch (this.weatherCode) {
      case WeatherInterpretationCode.ClearSky: return '#fde68a';
      case WeatherInterpretationCode.MainlyClear: return '#bae6fd';
      case WeatherInterpretationCode.Fog: return '#d1d5db';
      case WeatherInterpretationCode.Drizzle: return '#a5f3fc';
      case WeatherInterpretationCode.Rain: return '#94a3b8';
      case WeatherInterpretationCode.Snow: return '#dbeafe';
      case WeatherInterpretationCode.Thunderstorm: return '#9ca3af';
      default: return '#fde68a';
    }
  }

  getWeatherConditionText(): string {
    switch (this.weatherCode) {
      case WeatherInterpretationCode.ClearSky: return 'Ciel dégagé';
      case WeatherInterpretationCode.MainlyClear: return 'Partiellement nuageux';
      case WeatherInterpretationCode.Fog: return 'Brouillard épais';
      case WeatherInterpretationCode.Drizzle: return 'Bruine légère';
      case WeatherInterpretationCode.Rain: return 'Pluie modérée';
      case WeatherInterpretationCode.Snow: return 'Chutes de neige';
      case WeatherInterpretationCode.Thunderstorm: return 'Orage violent';
      default: return 'Ciel dégagé';
    }
  }

  getTooltipBackground(): string {
    switch (this.weatherCode) {
      case WeatherInterpretationCode.ClearSky: return 'rgba(254, 243, 199, 0.98)';
      case WeatherInterpretationCode.MainlyClear: return 'rgba(224, 242, 254, 0.98)';
      case WeatherInterpretationCode.Fog: return 'rgba(243, 244, 246, 0.98)';
      case WeatherInterpretationCode.Drizzle: return 'rgba(207, 250, 254, 0.98)';
      case WeatherInterpretationCode.Rain: return 'rgba(226, 232, 240, 0.98)';
      case WeatherInterpretationCode.Snow: return 'rgba(239, 246, 255, 0.98)';
      case WeatherInterpretationCode.Thunderstorm: return 'rgba(229, 231, 235, 0.98)';
      default: return 'rgba(254, 243, 199, 0.98)';
    }
  }

  getTooltipBorderColor(): string {
    switch (this.weatherCode) {
      case WeatherInterpretationCode.ClearSky: return 'rgba(251, 191, 36, 0.6)';
      case WeatherInterpretationCode.MainlyClear: return 'rgba(59, 130, 246, 0.6)';
      case WeatherInterpretationCode.Fog: return 'rgba(156, 163, 175, 0.6)';
      case WeatherInterpretationCode.Drizzle: return 'rgba(6, 182, 212, 0.6)';
      case WeatherInterpretationCode.Rain: return 'rgba(71, 85, 105, 0.6)';
      case WeatherInterpretationCode.Snow: return 'rgba(147, 197, 253, 0.6)';
      case WeatherInterpretationCode.Thunderstorm: return 'rgba(75, 85, 99, 0.6)';
      default: return 'rgba(251, 191, 36, 0.6)';
    }
  }

  getWeeklyCardBackground(): string {
    switch (this.weatherCode) {
      case WeatherInterpretationCode.ClearSky: return 'rgba(138, 197, 253, 0.4)';
      case WeatherInterpretationCode.MainlyClear: return 'rgba(186, 230, 253, 0.4)';
      case WeatherInterpretationCode.Fog: return 'rgba(209, 213, 219, 0.5)';
      case WeatherInterpretationCode.Drizzle: return 'rgba(165, 243, 252, 0.4)';
      case WeatherInterpretationCode.Rain: return 'rgba(148, 163, 184, 0.4)';
      case WeatherInterpretationCode.Snow: return 'rgba(219, 234, 254, 0.5)';
      case WeatherInterpretationCode.Thunderstorm: return 'rgba(75, 85, 99, 0.35)';
      default: return 'rgba(186, 230, 253, 0.4)';
    }
  }

  getDayTemperature(): number {
    return this.city.temperature || 22;
  }

  getDaylightDuration(): string {
    if (this.fakeDaylightDuration !== null) return this.fakeDaylightDuration;
    if (!this.dayCharts) return '--';
    const ms = this.dayCharts.sunSet.getTime() - this.dayCharts.sunRise.getTime();
    const totalMin = Math.round(ms / 60000);
    return `${Math.floor(totalMin / 60)}h ${totalMin % 60}min`;
  }

  getMaxUV(): number {
    if (this.hoveredUV !== null) return this.hoveredUV;
    if (!this.dayCharts) return 0;
    return Math.round(Math.max(...this.dayCharts.UVs) * 10) / 10;
  }

  getMinUV(): number {
    if (!this.dayCharts) return 0;
    const dayValues = this.dayCharts.UVs.filter(v => v > 0);
    return dayValues.length ? Math.round(Math.min(...dayValues) * 10) / 10 : 0;
  }

  getUVPeakHour(): string {
    if (!this.dayCharts) return '--';
    const maxVal = Math.max(...this.dayCharts.UVs);
    const idx = this.dayCharts.UVs.indexOf(maxVal);
    return `${idx.toString().padStart(2, '0')}h`;
  }

  getMaxWind(): number {
    if (this.hoveredWind !== null) return this.hoveredWind;
    if (!this.dayCharts) return 0;
    return Math.round(Math.max(...this.dayCharts.windSpeeds));
  }

  getMinWind(): number {
    if (!this.dayCharts) return 0;
    return Math.round(Math.min(...this.dayCharts.windSpeeds));
  }

  getMaxWindValue(): number {
    if (!this.dayCharts) return 0;
    return Math.round(Math.max(...this.dayCharts.windSpeeds));
  }

  getTotalPrecipitation(): number {
    if (this.hoveredPrecipitation !== null) return this.hoveredPrecipitation;
    if (!this.dayCharts) return 0;
    return Math.round(this.dayCharts.precipitations.reduce((s, v) => s + v, 0) * 10) / 10;
  }

  getPrecipitationColor(height: number): string {
    if (height < 30) return '#3b82f6';
    if (height < 50) return '#0ea5e9';
    if (height < 70) return '#06b6d4';
    return '#0891b2';
  }

  onUVChartHover(event: MouseEvent): void {
    this.hoveredUV = this.getClosestPointValue(event, this.uvPoints);
  }

  onWindChartHover(event: MouseEvent): void {
    this.hoveredWind = this.getClosestPointValue(event, this.windPoints);
  }

  private getClosestPointValue(event: MouseEvent, points: { x: number; value: number }[]): number {
    const svg = event.currentTarget as SVGElement;
    const rect = svg.getBoundingClientRect();
    const normalizedX = ((event.clientX - rect.left) / rect.width) * 100;
    return points.reduce((closest, p) =>
      Math.abs(p.x - normalizedX) < Math.abs(closest.x - normalizedX) ? p : closest
    ).value;
  }

  onPrecipitationBarHover(index: number): void {
    this.hoveredPrecipitation = this.precipitationBars[index].value;
  }

  resetUVHover(): void { this.hoveredUV = null; }
  resetWindHover(): void { this.hoveredWind = null; }
  resetPrecipitationHover(): void { this.hoveredPrecipitation = null; }

  getIconId(icon: string): string {
    if (icon.startsWith('icon-')) return icon;
    const iconMap: { [key: string]: string } = {
      '☀️': 'icon-sun',
      '🌙': 'icon-moon',
      '⛅': 'icon-partly-cloudy',
      '☁️': 'icon-cloud',
      '🌧️': 'icon-rain',
      '🌦️': 'icon-drizzle',
      '❄️': 'icon-snow',
      '⛈️': 'icon-thunderstorm',
      '🌫️': 'icon-fog',
      '🌅': 'icon-sunrise',
      '🌇': 'icon-sunset',
      '🌆': 'icon-dusk',
      '🌃': 'icon-dusk',
      '🌥️': 'icon-cloud',
    };
    return iconMap[icon] || 'icon-sun';
  }
}
