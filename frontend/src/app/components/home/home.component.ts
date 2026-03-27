import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { WeatherInterpretationCode } from '../../models/weather.model';
import { LikedLocationsService } from 'src/app/services/liked-locations.service';
import { MapService } from 'src/app/services/map.service';
import { WeatherService } from 'src/app/services/weather.service';
import { MOCK_FAVORITE_CITIES } from './home.mock-cities';
import { CityCoordinates, FavoriteCity } from './home.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  currentSlide: number = 0;
  favoriteCities: FavoriteCity[] = [];

  private readonly coordinatePrecision = 6;
  private likedLocationKeys = new Set<string>();
  private readonly mockLocationKeys = new Set(
    MOCK_FAVORITE_CITIES.map(city => this.buildLocationKey(city.coords.lat, city.coords.lon))
  );

  constructor(
    public authService: AuthService,
    private weatherService: WeatherService,
    private likedLocationsService: LikedLocationsService,
    private mapService: MapService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.favoriteCities = [...MOCK_FAVORITE_CITIES].sort(() => Math.random() - 0.5);
    this.fetchFavoriteCities();
    this.currentSlide = 0;
  }

  nextSlide(): void {
    if (this.currentSlide < this.favoriteCities.length - 1) {
      this.currentSlide++;
    }
  }

  previousSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  getCurrentCity(): FavoriteCity | null {
    return this.favoriteCities[this.currentSlide] ?? null;
  }

  goToCurrentCityDetail(): void {
    const city = this.getCurrentCity();
    if (city) {
      this.goToCityDetail(city);
    }
  }

  goToCityDetail(city: FavoriteCity): void {
    if (this.hasValidCoords(city)) {
      const coords = this.normalizeCoordinates(city.coords);
      this.router.navigate(['/city', coords.lat, coords.lon]);
      return;
    }

    this.router.navigate(['/city', city.name]);
  }

  isCityLiked(city: FavoriteCity): boolean {
    if (!this.hasValidCoords(city)) {
      return false;
    }

    const coords = this.normalizeCoordinates(city.coords);
    return this.likedLocationKeys.has(this.buildLocationKey(coords.lat, coords.lon));
  }

  toggleFavorite(event: Event, city: FavoriteCity): void {
    event.stopPropagation();

    if (!this.hasValidCoords(city)) {
      return;
    }

    const coords = this.normalizeCoordinates(city.coords);
    const locationKey = this.buildLocationKey(coords.lat, coords.lon);
    const isLiked = this.likedLocationKeys.has(locationKey);

    if (isLiked) {
      this.likedLocationsService.removeLikedLocation({ latitude: coords.lat, longitude: coords.lon }).subscribe(() => {
        this.likedLocationKeys.delete(locationKey);

        // Keep built-in mock cards visible and only remove API-injected liked cards.
        if (!this.mockLocationKeys.has(locationKey)) {
          this.favoriteCities = this.favoriteCities.filter(
            c => this.buildLocationKey(c.coords.lat, c.coords.lon) !== locationKey
          );
        }

        if (this.currentSlide >= this.favoriteCities.length) {
          this.currentSlide = Math.max(0, this.favoriteCities.length - 1);
        }
      });
      return;
    }

    this.likedLocationsService.addLikedLocation({ latitude: coords.lat, longitude: coords.lon }).subscribe(() => {
      this.likedLocationKeys.add(locationKey);

      const cityExists = this.favoriteCities.some(
        c => this.buildLocationKey(c.coords.lat, c.coords.lon) === locationKey
      );

      if (!cityExists) {
        this.favoriteCities.push({
          ...city,
          coords,
          source: 'liked'
        });
      }
    });
  }

  fetchFavoriteCities(): void {
    this.likedLocationsService.getLikedLocations().subscribe(locations => {
      this.likedLocationKeys = new Set(
        locations.map(loc => this.buildLocationKey(loc.latitude, loc.longitude))
      );

      const existingKeys = new Set(
        this.favoriteCities.map(city => this.buildLocationKey(city.coords.lat, city.coords.lon))
      );

      const newLocations = locations.filter(
        loc => !existingKeys.has(this.buildLocationKey(loc.latitude, loc.longitude))
      );

      if (newLocations.length === 0) {
        return;
      }

      const cityRequests = newLocations.map(loc => {
        const normalizedCoords = this.normalizeCoordinates({ lat: loc.latitude, lon: loc.longitude });

        return forkJoin({
          cityName: this.mapService.reverseGeocode(normalizedCoords.lat, normalizedCoords.lon).pipe(
            map(response =>
              response.features.length > 0 ? response.features[0].properties.city || 'Unknown' : 'Unknown'
            ),
            catchError(() => of('Unknown'))
          ),
          weather: this.weatherService.getCurrentWeather(normalizedCoords.lat, normalizedCoords.lon).pipe(
            catchError(() => of(null))
          )
        }).pipe(
          map(({ cityName, weather }) => {
            const weatherCondition = weather?.condition;

            return {
              name: cityName,
              country: 'Favorite City',
              temperature: weather?.temperature ?? 0,
              icon: weatherCondition != null ? this.weatherService.getIconForWIC(weatherCondition) : 'icon-cloud',
              condition: weatherCondition != null ? this.weatherService.WICToString(weatherCondition) : 'Unknown',
              humidity: weather?.humidity ?? 0,
              wind: weather?.wind ?? 0,
              cloudCover: weather?.cloudCover ?? 0,
              pressure: weather?.pressure ?? 0,
              lastUpdate: 'just now',
              weatherCode: weatherCondition ?? WeatherInterpretationCode.ClearSky,
              coords: normalizedCoords,
              source: 'liked'
            } as FavoriteCity;
          })
        );
      });

      forkJoin(cityRequests).subscribe(cities => {
        this.favoriteCities = [...this.favoriteCities, ...cities];
      });
    });
  }

  private hasValidCoords(city: FavoriteCity | null | undefined): boolean {
    if (!city) {
      return false;
    }

    return Number.isFinite(city.coords?.lat) && Number.isFinite(city.coords?.lon);
  }

  // Necessary to ensure the number of decimal places
  private normalizeCoordinates(coords: CityCoordinates): CityCoordinates {
    return {
      lat: this.normalizeCoordinate(coords.lat),
      lon: this.normalizeCoordinate(coords.lon)
    };
  }

  private normalizeCoordinate(value: number): number {
    return Number(value.toFixed(this.coordinatePrecision));
  }

  private buildLocationKey(lat: number, lon: number): string {
    const normalizedLat = this.normalizeCoordinate(lat);
    const normalizedLon = this.normalizeCoordinate(lon);
    return `${normalizedLat},${normalizedLon}`;
  }
}
