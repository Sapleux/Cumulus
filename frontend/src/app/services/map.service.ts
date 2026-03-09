import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private apiKey = environment.geoapifyApiKey;

  constructor(private http: HttpClient) {}

  private get headers() {
    return new HttpHeaders({ 'Accept': 'application/json' });
  }

  searchCity(city: string) {
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(city)}&limit=5&apiKey=${this.apiKey}`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  reverseGeocode(lat: number, lon: number) {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${this.apiKey}`;
    return this.http.get<any>(url, { headers: this.headers });
  }
}