import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { MapComponent } from '../map/map.component';
import { WeatherInterpretationCode } from '../../models/weather.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MapComponent],
  template: `
    <!-- SVG Icon Definitions -->
    <svg style="display: none;">
      <defs>
        <!-- Sun Icon -->
        <symbol id="icon-sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" fill="currentColor"/>
          <path d="M12 2v4M12 18v4M22 12h-4M6 12H2M19.07 4.93l-2.83 2.83M7.76 16.24l-2.83 2.83M19.07 19.07l-2.83-2.83M7.76 7.76L4.93 4.93"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </symbol>

        <!-- Partly Cloudy Icon -->
        <symbol id="icon-partly-cloudy" viewBox="0 0 24 24">
          <path d="M13 16H6a4 4 0 1 1 0.5-7.95 5.5 5.5 0 0 1 10.9 1.35A3.5 3.5 0 0 1 18 16h-5z" fill="currentColor" opacity="0.9"/>
          <circle cx="17" cy="7" r="2.5" fill="currentColor" opacity="0.6"/>
          <path d="M17 3v1M21 7h-1M20.5 4.5l-.7.7M13.5 4.5l.7.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
        </symbol>

        <!-- Cloud Icon -->
        <symbol id="icon-cloud" viewBox="0 0 24 24">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor"/>
        </symbol>

        <!-- Rain Icon -->
        <symbol id="icon-rain" viewBox="0 0 24 24">
          <path d="M16 13H8a4 4 0 1 1 0.5-7.95 5.5 5.5 0 0 1 10.9 1.35A3.5 3.5 0 0 1 18 13h-2z" fill="currentColor"/>
          <path d="M8 16v3M12 15v4M16 16v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </symbol>

        <!-- Drizzle Icon -->
        <symbol id="icon-drizzle" viewBox="0 0 24 24">
          <path d="M16 13H8a4 4 0 1 1 0.5-7.95 5.5 5.5 0 0 1 10.9 1.35A3.5 3.5 0 0 1 18 13h-2z" fill="currentColor"/>
          <circle cx="8" cy="17" r="1" fill="currentColor"/>
          <circle cx="12" cy="19" r="1" fill="currentColor"/>
          <circle cx="16" cy="17" r="1" fill="currentColor"/>
        </symbol>

        <!-- Snow Icon -->
        <symbol id="icon-snow" viewBox="0 0 24 24">
          <path d="M16 13H8a4 4 0 1 1 0.5-7.95 5.5 5.5 0 0 1 10.9 1.35A3.5 3.5 0 0 1 18 13h-2z" fill="currentColor"/>
          <path d="M8 16v4M8 18h-2M8 18h2M12 15v4M12 17h-2M12 17h2M16 16v4M16 18h-2M16 18h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </symbol>

        <!-- Thunderstorm Icon -->
        <symbol id="icon-thunderstorm" viewBox="0 0 24 24">
          <path d="M16 13H8a4 4 0 1 1 0.5-7.95 5.5 5.5 0 0 1 10.9 1.35A3.5 3.5 0 0 1 18 13h-2z" fill="currentColor"/>
          <path d="M13 13l-3 5h3l-1 4 4-6h-3l2-3z" fill="currentColor" opacity="0.8"/>
        </symbol>

        <!-- Fog Icon -->
        <symbol id="icon-fog" viewBox="0 0 24 24">
          <path d="M4 14h16M4 18h12M4 10h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
        </symbol>

        <!-- Droplet/Humidity Icon -->
        <symbol id="icon-droplet" viewBox="0 0 24 24">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor"/>
        </symbol>

        <!-- Wind Icon -->
        <symbol id="icon-wind" viewBox="0 0 24 24">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </symbol>

        <!-- Eye/Visibility Icon -->
        <symbol id="icon-eye" viewBox="0 0 24 24">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"/>
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
        </symbol>

        <!-- Gauge/Pressure Icon -->
        <symbol id="icon-gauge" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 0 1 10 10c0 3.87-2.2 7.22-5.41 8.87" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M2 12A10 10 0 0 1 7.41 3.13" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </symbol>
      </defs>
    </svg>

    <!-- Favorite Cities Carousel -->
    <section class="carousel-section">
      <div class="container">
        <!-- Not logged in state -->
        <div class="welcome-state" *ngIf="!authService.isLoggedIn()">
          <div class="welcome-content">
            <div class="hero-badge mb-4">
              <svg class="badge-icon" viewBox="0 0 24 24">
                <use href="#icon-cloud"></use>
              </svg>
              <span>Application Météo</span>
            </div>
            <h1 class="welcome-title">Bienvenue sur Cumulus</h1>
            <p class="welcome-subtitle">
              Suivez la météo de vos villes préférées avec des prévisions précises en temps réel
            </p>
            <div class="d-flex gap-3 justify-content-center mt-4">
              <a routerLink="/register" class="btn btn-primary btn-lg px-4">
                Créer un compte
              </a>
              <a routerLink="/login" class="btn btn-outline-primary btn-lg px-4">
                Se connecter
              </a>
            </div>
          </div>
        </div>

        <!-- Logged in state with carousel -->
        <div *ngIf="authService.isLoggedIn()">
          <div class="carousel-header">
            <div>
              <h2 class="fw-bold mb-1">Mes villes favorites</h2>
              <p class="text-secondary mb-0">Suivez la météo de vos villes préférées en un coup d'œil</p>
            </div>
            <button class="btn btn-primary">
              <span class="me-2">+</span> Ajouter une ville
            </button>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="favoriteCities.length === 0">
            <div class="empty-icon">🌍</div>
            <h5>Aucune ville favorite</h5>
            <p class="text-secondary">Ajoutez des villes pour suivre leur météo en temps réel</p>
            <button class="btn btn-primary mt-3">Ajouter ma première ville</button>
          </div>

          <!-- Carousel -->
          <div class="carousel-container" *ngIf="favoriteCities.length > 0">
            <button class="carousel-btn prev" (click)="previousSlide()" [disabled]="currentSlide === 0">
              <span>‹</span>
            </button>

            <div class="carousel-wrapper">
              <div class="carousel-track" [style.transform]="'translateX(-' + currentSlide * 100 + '%)'">
                <div class="carousel-slide" *ngFor="let city of favoriteCities">
                  <div class="city-card-large" (click)="goToCityDetail(city.name)" style="cursor: pointer;">
                    <div class="city-header">
                      <div>
                        <h3 class="city-name">{{ city.name }}</h3>
                        <p class="city-country">{{ city.country }}</p>
                      </div>
                      <button class="btn-favorite active" (click)="toggleFavorite($event, city)">
                        <span>⭐</span>
                      </button>
                    </div>

                    <div class="weather-main-display">
                      <div class="temperature-display">{{ city.temperature }}°</div>
                      <svg class="weather-icon-display" viewBox="0 0 24 24">
                        <use [attr.href]="'#' + getIconId(city.icon)"></use>
                      </svg>
                    </div>

                    <div class="weather-condition-large">{{ city.condition }}</div>

                    <div class="weather-stats-grid">
                      <div class="stat-card">
                        <svg class="stat-icon" viewBox="0 0 24 24">
                          <use href="#icon-droplet"></use>
                        </svg>
                        <span class="stat-label">Humidité</span>
                        <span class="stat-value">{{ city.humidity }}%</span>
                      </div>
                      <div class="stat-card">
                        <svg class="stat-icon" viewBox="0 0 24 24">
                          <use href="#icon-wind"></use>
                        </svg>
                        <span class="stat-label">Vent</span>
                        <span class="stat-value">{{ city.wind }} km/h</span>
                      </div>
                      <div class="stat-card">
                        <svg class="stat-icon" viewBox="0 0 24 24">
                          <use href="#icon-eye"></use>
                        </svg>
                        <span class="stat-label">Visibilité</span>
                        <span class="stat-value">{{ city.visibility }} km</span>
                      </div>
                      <div class="stat-card">
                        <svg class="stat-icon" viewBox="0 0 24 24">
                          <use href="#icon-gauge"></use>
                        </svg>
                        <span class="stat-label">Pression</span>
                        <span class="stat-value">{{ city.pressure }} hPa</span>
                      </div>
                    </div>

                    <div class="city-footer-large">
                      <span class="update-time">Mis à jour il y a {{ city.lastUpdate }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button class="carousel-btn next" (click)="nextSlide()" [disabled]="currentSlide === favoriteCities.length - 1">
              <span>›</span>
            </button>

            <!-- Carousel Indicators -->
            <div class="carousel-indicators">
              <button
                *ngFor="let city of favoriteCities; let i = index"
                class="indicator"
                [class.active]="i === currentSlide"
                (click)="goToSlide(i)"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Map -->
    <section class="map-section">
      <!-- Titre -->
      <div class="map-title">
        <h2>🌤️ Rechercher la météo selon votre ville</h2>
        <p>Recherchez une ville ou cliquez directement sur la carte</p>
      </div>
      <div class="container">
        <div class="map-wrapper">
          <app-map></app-map>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Carousel Section */
    .carousel-section {
      min-height: calc(100vh - 60px);
      display: flex;
      align-items: center;
      padding: 3rem 0;
      position: relative;
    }

    .carousel-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      height: 100%;
      background: radial-gradient(ellipse at center, rgba(14,165,233,0.05) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .container {
      position: relative;
      z-index: 1;
    }

    /* Welcome State */
    .welcome-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .welcome-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.2rem;
      background: linear-gradient(135deg, rgba(224,242,254,0.8), rgba(240,249,255,0.8));
      border: 1px solid rgba(14,165,233,0.2);
      border-radius: 50px;
      font-size: 0.875rem;
      color: var(--primary);
      font-weight: 500;
    }

    .badge-icon {
      width: 1.125rem;
      height: 1.125rem;
      color: var(--primary);
    }

    .welcome-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }

    .welcome-subtitle {
      font-size: 1.125rem;
      color: var(--text-secondary);
      line-height: 1.7;
      margin-bottom: 2rem;
    }

    /* Carousel Header */
    .carousel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
    }

    .carousel-header h2 {
      font-size: 2rem;
      color: var(--text-primary);
    }

    /* Carousel Container */
    .carousel-container {
      position: relative;
      max-width: 900px;
      margin: 0 auto;
    }

    .carousel-wrapper {
      overflow: hidden;
      border-radius: 28px;
    }

    .carousel-track {
      display: flex;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .carousel-slide {
      min-width: 100%;
      flex-shrink: 0;
    }

    /* City Card Large */
    .city-card-large {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      border-radius: 24px;
      padding: 3rem;
      color: white;
      box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3), 0 8px 16px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
    }

    .city-card-large::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .city-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2.5rem;
      position: relative;
      z-index: 1;
    }

    .city-name {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .city-country {
      font-size: 1.125rem;
      opacity: 0.9;
    }

    .btn-favorite {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      padding: 0.75rem;
      cursor: pointer;
      font-size: 1.5rem;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .btn-favorite:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .btn-favorite.active {
      background: rgba(255, 255, 255, 0.25);
    }

    /* Weather Main Display */
    .weather-main-display {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      margin: 3rem 0;
      position: relative;
      z-index: 1;
    }

    .temperature-display {
      font-size: 7rem;
      font-weight: 200;
      line-height: 1;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .weather-icon-display {
      width: 6rem;
      height: 6rem;
      color: rgba(255, 255, 255, 0.95);
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
    }

    .weather-condition-large {
      text-align: center;
      font-size: 1.5rem;
      font-weight: 500;
      margin-bottom: 3rem;
      opacity: 0.95;
      position: relative;
      z-index: 1;
    }

    /* Weather Stats Grid */
    .weather-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
      position: relative;
      z-index: 1;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .stat-card .stat-icon {
      width: 1.75rem;
      height: 1.75rem;
      margin-bottom: 0.25rem;
      color: rgba(255, 255, 255, 0.9);
    }

    .stat-card .stat-label {
      font-size: 0.875rem;
      opacity: 0.9;
      font-weight: 500;
    }

    .stat-card .stat-value {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .city-footer-large {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      z-index: 1;
    }

    .update-time {
      font-size: 0.875rem;
      opacity: 0.8;
    }

    /* Carousel Navigation Buttons */
    .carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 50%;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 2rem;
      color: var(--primary);
      box-shadow: var(--shadow-lg);
      transition: all 0.3s ease;
      z-index: 10;
    }

    .carousel-btn:hover:not(:disabled) {
      background: var(--primary);
      color: white;
      transform: translateY(-50%) scale(1.1);
    }

    .carousel-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .carousel-btn.prev {
      left: -28px;
    }

    .carousel-btn.next {
      right: -28px;
    }

    .carousel-btn span {
      display: block;
      line-height: 0;
    }

    /* Carousel Indicators */
    .carousel-indicators {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 2rem;
    }

    .indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid var(--primary);
      background: transparent;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    }

    .indicator.active {
      background: var(--primary);
      transform: scale(1.2);
    }

    .indicator:hover:not(.active) {
      background: rgba(59, 130, 246, 0.3);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border: 2px dashed var(--border-light);
      border-radius: 24px;
      max-width: 600px;
      margin: 0 auto;
    }

    .empty-icon {
      font-size: 5rem;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    .empty-state h5 {
      color: var(--text-primary);
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
    }

    .empty-state p {
      margin-bottom: 0;
      font-size: 1.125rem;
    }

    .text-secondary {
      color: var(--text-secondary) !important;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .carousel-btn {
        width: 40px;
        height: 40px;
        font-size: 1.5rem;
      }

      .carousel-btn.prev {
        left: -20px;
      }

      .carousel-btn.next {
        right: -20px;
      }

      .city-card-large {
        padding: 2rem;
      }

      .city-name {
        font-size: 2rem;
      }

      .temperature-display {
        font-size: 5rem;
      }

      .weather-icon-display {
        width: 4rem;
        height: 4rem;
      }

      .weather-stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .carousel-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  currentSlide = 0;

  favoriteCities = [
    {
      name: 'Ensoleille',
      country: 'Theme: Ciel degagé',
      temperature: 28,
      icon: '☀️',
      condition: 'Ciel dégagé',
      humidity: 45,
      wind: 8,
      visibility: 20,
      pressure: 1020,
      lastUpdate: '2 min',
      weatherCode: WeatherInterpretationCode.ClearSky
    },
    {
      name: 'Nuageux',
      country: 'Theme: Partiellement nuageux',
      temperature: 22,
      icon: '⛅',
      condition: 'Partiellement nuageux',
      humidity: 60,
      wind: 12,
      visibility: 15,
      pressure: 1015,
      lastUpdate: '5 min',
      weatherCode: WeatherInterpretationCode.MainlyClear
    },
    {
      name: 'Brouillard',
      country: 'Theme: Brouillard',
      temperature: 15,
      icon: '🌫️',
      condition: 'Brouillard épais',
      humidity: 90,
      wind: 5,
      visibility: 2,
      pressure: 1012,
      lastUpdate: '8 min',
      weatherCode: WeatherInterpretationCode.Fog
    },
    {
      name: 'Bruine',
      country: 'Theme: Bruine',
      temperature: 16,
      icon: '🌦️',
      condition: 'Bruine légère',
      humidity: 80,
      wind: 18,
      visibility: 8,
      pressure: 1008,
      lastUpdate: '4 min',
      weatherCode: WeatherInterpretationCode.Drizzle
    },
    {
      name: 'Pluvieux',
      country: 'Theme: Pluie',
      temperature: 12,
      icon: '🌧️',
      condition: 'Pluie modérée',
      humidity: 85,
      wind: 22,
      visibility: 6,
      pressure: 1005,
      lastUpdate: '3 min',
      weatherCode: WeatherInterpretationCode.Rain
    },
    {
      name: 'Neige',
      country: 'Theme: Neige',
      temperature: -2,
      icon: '❄️',
      condition: 'Chutes de neige',
      humidity: 75,
      wind: 15,
      visibility: 4,
      pressure: 1010,
      lastUpdate: '6 min',
      weatherCode: WeatherInterpretationCode.Snow
    },
    {
      name: 'Orageux',
      country: 'Theme: Orage',
      temperature: 18,
      icon: '⛈️',
      condition: 'Orage violent',
      humidity: 88,
      wind: 35,
      visibility: 5,
      pressure: 998,
      lastUpdate: '1 min',
      weatherCode: WeatherInterpretationCode.Thunderstorm
    }
  ];

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void { }

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

  goToCityDetail(cityName: string): void {
    this.router.navigate(['/city', cityName]);
  }

  toggleFavorite(event: Event, city: any): void {
    event.stopPropagation();
    // Logic to toggle favorite will be added later
    console.log('Toggle favorite for', city.name);
  }

  getIconId(iconText: string): string {
    const iconMap: { [key: string]: string } = {
      '☀️': 'icon-sun',
      '⛅': 'icon-partly-cloudy',
      '☁️': 'icon-cloud',
      '🌧️': 'icon-rain',
      '🌦️': 'icon-drizzle',
      '❄️': 'icon-snow',
      '⛈️': 'icon-thunderstorm',
      '🌫️': 'icon-fog',
      '🌥️': 'icon-cloud'
    };
    return iconMap[iconText] || 'icon-sun';
  }
}
