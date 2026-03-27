import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LikedLocationRequest {
  latitude: number;
  longitude: number;
}

export interface LikedLocation extends LikedLocationRequest {
  id: number;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LikedLocationsService {
  private apiUrl = environment.apiUrl + '/liked-locations';
  private likedLocationsSignal = signal<LikedLocation[]>([]);
  private likedLocationsSubject = new BehaviorSubject<LikedLocation[]>([]);
  public likedLocations$ = this.likedLocationsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadLikedLocations();
  }

  /**
   * Add a new liked location
   * @param request Location with latitude and longitude
   * @returns Observable of the created LikedLocation
   */
  addLikedLocation(request: LikedLocationRequest): Observable<LikedLocation> {
    return this.http.post<LikedLocation>(`${this.apiUrl}`, request).pipe(
      tap(location => {
        const current = this.likedLocationsSignal();
        this.likedLocationsSignal.set([...current, location]);
        this.likedLocationsSubject.next([...current, location]);
      })
    );
  }

  /**
   * Get all liked locations for the current user
   * @returns Observable array of LikedLocations
   */
  getLikedLocations(): Observable<LikedLocation[]> {
    return this.http.get<LikedLocation[]>(`${this.apiUrl}`).pipe(
      tap(locations => {
        this.likedLocationsSignal.set(locations);
        this.likedLocationsSubject.next(locations);
      })
    );
  }

  removeLikedLocation(request: LikedLocationRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/remove`, request).pipe(
      tap(() => {
        const current = this.likedLocationsSignal();
        const updated = current.filter(loc => !(loc.latitude === request.latitude && loc.longitude === request.longitude));
        this.likedLocationsSignal.set(updated);
        this.likedLocationsSubject.next(updated);
      })
    );
  }

  /**
   * Load liked locations and cache them
   */
  private loadLikedLocations(): void {
    this.getLikedLocations().subscribe();
  }

  /**
   * Get all liked locations from signal (synchronous access)
   * @returns Array of liked locations
   */
  getAllLikedLocations(): LikedLocation[] {
    return this.likedLocationsSignal();
  }

  /**
   * Check if a location is already liked
   * @param latitude Latitude coordinate
   * @param longitude Longitude coordinate
   * @returns Boolean indicating if location is liked
   */
  isLocationLiked(latitude: number, longitude: number): boolean {
    return this.likedLocationsSignal().some(
      loc => loc.latitude === latitude && loc.longitude === longitude
    );
  }

  /**
   * Clear the cached liked locations
   */
  clearCache(): void {
    this.likedLocationsSignal.set([]);
    this.likedLocationsSubject.next([]);
  }
}
