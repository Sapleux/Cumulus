import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WeatherInterpretationCode } from '../../models/weather.model';
import { LikedLocationsService } from 'src/app/services/liked-locations.service';
import { MapService } from 'src/app/services/map.service';
import { WeatherService } from 'src/app/services/weather.service';
import { MOCK_FAVORITE_CITIES } from '../home/home.mock-cities';
import { CityCoordinates, FavoriteCity } from '../home/home.models';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  favoriteCities: FavoriteCity[] = [];

  private readonly coordinatePrecision = 6;
  private readonly mockFavoriteCities = [...MOCK_FAVORITE_CITIES].sort(() => Math.random() - 0.5);
  private readonly mockCityRoutes: Record<string, string> = {
    Ensoleille: '/city/Ensoleille',
    Nuageux: '/city/Nuageux',
    Brouillard: '/city/Brouillard',
    Bruine: '/city/Bruine',
    Pluvieux: '/city/Pluvieux',
    Neige: '/city/Neige',
    Orageux: '/city/Orageux'
  };
  private likedLocationKeys = new Set<string>();
  private readonly mockLocationKeys = new Set(
    MOCK_FAVORITE_CITIES.map(city => this.buildLocationKey(city.coords.lat, city.coords.lon))
  );
  private readonly likedLocationsSubscription = new Subscription();

  constructor(
    private readonly weatherService: WeatherService,
    private readonly likedLocationsService: LikedLocationsService,
    private readonly mapService: MapService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.favoriteCities = [...this.mockFavoriteCities];
    this.likedLocationsSubscription.add(
      this.likedLocationsService.likedLocations.subscribe(locations => {
        void this.syncFavoriteCities(locations);
      })
    );
    this.currentSlide = 0;
  }

  ngOnDestroy(): void {
    this.likedLocationsSubscription.unsubscribe();
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
    if (city.source === 'mock') {
      this.navigateToMockCity(city.name);
      return;
    }

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

  private syncFavoriteCities(locations: { latitude: number; longitude: number }[]): void {
    this.likedLocationKeys = new Set(
      locations.map(loc => this.buildLocationKey(loc.latitude, loc.longitude))
    );

    this.favoriteCities = this.favoriteCities.filter(city => {
      if (city.source !== 'liked') {
        return true;
      }

      return this.likedLocationKeys.has(this.buildLocationKey(city.coords.lat, city.coords.lon));
    });

    const existingKeys = new Set(
      this.favoriteCities.map(city => this.buildLocationKey(city.coords.lat, city.coords.lon))
    );

    const newLocations = locations.filter(loc => {
      const locationKey = this.buildLocationKey(loc.latitude, loc.longitude);
      return !existingKeys.has(locationKey);
    });

    if (newLocations.length === 0) {
      this.ensureCurrentSlideInRange();
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
      this.ensureCurrentSlideInRange();
    });
  }

  private navigateToMockCity(cityName: string): void {
    const hardcodedRoute = this.mockCityRoutes[cityName];
    if (hardcodedRoute) {
      this.router.navigateByUrl(hardcodedRoute);
      return;
    }

    this.router.navigate(['/city', cityName]);
  }

  private hasValidCoords(city: FavoriteCity | null | undefined): boolean {
    if (!city) {
      return false;
    }

    return Number.isFinite(city.coords?.lat) && Number.isFinite(city.coords?.lon);
  }

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

  private ensureCurrentSlideInRange(): void {
    if (this.currentSlide >= this.favoriteCities.length) {
      this.currentSlide = Math.max(0, this.favoriteCities.length - 1);
    }
  }
}