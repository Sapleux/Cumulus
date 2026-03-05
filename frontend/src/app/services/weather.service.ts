import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export enum WeatherIntrepretationCode {
  ClearSky, 
  MainlyClear,
  Fog,
  Drizzle, 
  Rain,
  Snow, 
  Thunderstorm
}

@Injectable({
  providedIn: 'root',
})
export class Weather {
  
  private apiUrl = "https://api.open-meteo.com/v1" 

  constructor(private http: HttpClient) {}
  
  public getWIC(latitude: Number, longitude: Number, startDate: Date, endDate: Date): WeatherIntrepretationCode[] {
    const response = this.http.get(`${this.apiUrl}/forecast?latitude=${latitude}&longitude=${longitude}&hourly=weathercode&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`);
    const wic: WeatherIntrepretationCode[] = [];
    response.subscribe((data: any) => {
      const weatherCodes = data.hourly.weathercode;
      for (let code of weatherCodes) {
        wic.push(this.interpretWeatherCode(code));
      }
    });
    return wic;
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
