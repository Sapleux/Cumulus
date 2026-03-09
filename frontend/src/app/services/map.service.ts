import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private apiKey = environment.geoapifyApiKey;

  constructor(private http: HttpClient) {}

  searchCity(city: string) {
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(city)}&limit=5&apiKey=${this.apiKey}`;
    const headers = new HttpHeaders({ 'Accept': 'application/json' });
    return this.http.get<any>(url, { headers });
  }
}