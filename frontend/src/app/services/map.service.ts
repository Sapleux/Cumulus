import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GeoapifyResponse } from '../components/map/map.types';

@Injectable({ providedIn: 'root' })
export class MapService {
  private readonly http = inject(HttpClient);
  private readonly geoapifyApiKey = environment.geoapifyApiKey;

  private get headers(): HttpHeaders {
    return new HttpHeaders({ Accept: 'application/json' });
  }

  /** Returns city suggestions matching the search term. */
  searchCity(city: string): Observable<GeoapifyResponse> {
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(city)}&limit=5&apiKey=${this.geoapifyApiKey}`;
    return this.http.get<GeoapifyResponse>(url, { headers: this.headers });
  }

  /** Returns address information for the given coordinates. */
  reverseGeocode(lat: number, lon: number): Observable<GeoapifyResponse> {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${this.geoapifyApiKey}`;
    return this.http.get<GeoapifyResponse>(url, { headers: this.headers });
  }
}