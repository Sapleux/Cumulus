import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum WeatherIntrepretationCode {
  ClearSky, 
  MainlyClear,
  Fog,
  Drizzle, 
  Rain,
  Snow, 
  Thunderstorm
}

export interface DaySummary {
  wic: WeatherIntrepretationCode;
  minTemperature: number;
  maxTemperature: number;
}

export interface WICTimelineOver {
  temperature: number;
  sunDuration: number;
  windSpeed: number;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  
  private apiUrl = "https://api.open-meteo.com/v1" 

  constructor(private http: HttpClient) {}
  
  /**
   * Returns a timeline of weather interpretation codes for the given location and time range.
   * The returned array is made of 24 elements, each representing an hour of the day, starting from midnight.
   * @param latitude the latitude of the location for which to retrieve the weather data
   * @param longitude the longitude of the location for which to retrieve the weather data
   * @param startDate the start date of the time range for which to retrieve the weather data
   * @param endDate the end date of the time range for which to retrieve the weather data
   * @returns an Observable that emits an array of WeatherIntrepretationCode values representing the weather conditions for each hour of the day
   */
  public getWicTimeline(latitude: Number, longitude: Number, startDate: Date, endDate: Date): Observable<WeatherIntrepretationCode[]> {
    return this.http.get(`${this.apiUrl}/forecast?latitude=${latitude}&longitude=${longitude}&hourly=weather_code&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`).pipe(
      map((data: any) => {
        const wic: WeatherIntrepretationCode[] = [];
        const weatherCodes = data.hourly.weather_code;
        for (let code of weatherCodes) {
          wic.push(this.interpretWeatherCode(code));
        }
        return wic;
      })
    );
  }

  public getWICTimelineOver(latitude: Number, longitude: Number): Observable<WICTimelineOver[]> {
    return this.http.get(`${this.apiUrl}/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,sunshine_duration,wind_speed_10m&forecast_days=1`).pipe(
      map((data: any) => {
        const timeline: WICTimelineOver[] = [];
        const temperatures = data.hourly.temperature_2m;
        const sunDurations = data.hourly.sunshine_duration;
        const windSpeeds = data.hourly.wind_speed_10m;
        for (let i = 0; i < temperatures.length; i++) {
          timeline.push({
            temperature: temperatures[i],
            sunDuration: sunDurations[i],
            windSpeed: windSpeeds[i]
          });
        }
        return timeline;
      })
    );
  }

  /**
   * Returns a summary of the weather conditions for the next 7 days for the given location.
   * @param latitude the latitude of the location for which to retrieve the weather data
   * @param longitude the longitude of the location for which to retrieve the weather data
   * @returns an Observable that emits an array of DaySummary objects representing the weather conditions for each day of the next week.
   */
  public getSummaryOfNextDays(latitude: Number, longitude: Number, ): Observable<DaySummary[]> {
    return this.http.get(`${this.apiUrl}/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_min,temperature_2m_max,weather_code&forecast_days=7`).pipe(
      map((data: any) => {
        const dailyData = data.daily;
        const summaries: DaySummary[] = [];
        for (let i = 0; i < dailyData.weather_code.length; i++) {
          summaries.push({
            wic: this.interpretWeatherCode(dailyData.weather_code[i]),
            minTemperature: dailyData.temperature_2m_min[i],
            maxTemperature: dailyData.temperature_2m_max[i]
          });
        }
        return summaries;
      })
    );
  }

  private interpretWeatherCode(code: number): WeatherIntrepretationCode {
    switch (code) {
      case 0:
        return WeatherIntrepretationCode.ClearSky;
      case 1:
      case 2:
      case 3:
        return WeatherIntrepretationCode.MainlyClear;
      case 45:
      case 48:
        return WeatherIntrepretationCode.Fog;
      case 51:
      case 53:
      case 55:
        return WeatherIntrepretationCode.Drizzle;
      case 61:
      case 63:
      case 65:
        return WeatherIntrepretationCode.Rain;
      case 71:
      case 73:
      case 75:
        return WeatherIntrepretationCode.Snow;
      case 80:
      case 82:
        return WeatherIntrepretationCode.Rain;
      case 81:
        return WeatherIntrepretationCode.Drizzle;
      case 85:
      case 86:
        return WeatherIntrepretationCode.Snow;
      case 95:
        return WeatherIntrepretationCode.Thunderstorm;
    }
    return WeatherIntrepretationCode.ClearSky; 
  }
}
