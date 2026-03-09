import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MapComponent],
  template: `
    <!-- Favorite Cities Carousel -->
    <section class="carousel-section">
      <div class="container">
        <!-- Not logged in state -->
        <div class="welcome-state" *ngIf="!authService.isLoggedIn()">
          <div class="welcome-content">
            <div class="hero-badge mb-4">
              <span>☁️ Application Météo</span>
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
                  <div class="city-card-large">
                    <div class="city-header">
                      <div>
                        <h3 class="city-name">{{ city.name }}</h3>
                        <p class="city-country">{{ city.country }}</p>
                      </div>
                      <button class="btn-favorite active">
                        <span>⭐</span>
                      </button>
                    </div>

                    <div class="weather-main-display">
                      <div class="temperature-display">{{ city.temperature }}°</div>
                      <div class="weather-icon-display">{{ city.icon }}</div>
                    </div>

                    <div class="weather-condition-large">{{ city.condition }}</div>

                    <div class="weather-stats-grid">
                      <div class="stat-card">
                        <span class="stat-icon">💧</span>
                        <span class="stat-label">Humidité</span>
                        <span class="stat-value">{{ city.humidity }}%</span>
                      </div>
                      <div class="stat-card">
                        <span class="stat-icon">💨</span>
                        <span class="stat-label">Vent</span>
                        <span class="stat-value">{{ city.wind }} km/h</span>
                      </div>
                      <div class="stat-card">
                        <span class="stat-icon">👁️</span>
                        <span class="stat-label">Visibilité</span>
                        <span class="stat-value">{{ city.visibility }} km</span>
                      </div>
                      <div class="stat-card">
                        <span class="stat-icon">🌡️</span>
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
      display: inline-block;
      padding: 0.5rem 1.2rem;
      background: linear-gradient(135deg, rgba(224,242,254,0.8), rgba(240,249,255,0.8));
      border: 1px solid rgba(14,165,233,0.2);
      border-radius: 50px;
      font-size: 0.875rem;
      color: var(--primary);
      font-weight: 500;
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
      font-size: 6rem;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
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
      font-size: 2rem;
      margin-bottom: 0.25rem;
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
        font-size: 4rem;
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
      name: 'Paris',
      country: 'France',
      temperature: 22,
      icon: '⛅',
      condition: 'Partiellement nuageux',
      humidity: 65,
      wind: 12,
      visibility: 10,
      pressure: 1015,
      lastUpdate: '5 min'
    },
    {
      name: 'Lyon',
      country: 'France',
      temperature: 24,
      icon: '☀️',
      condition: 'Ensoleillé',
      humidity: 52,
      wind: 8,
      visibility: 15,
      pressure: 1018,
      lastUpdate: '10 min'
    },
    {
      name: 'Marseille',
      country: 'France',
      temperature: 26,
      icon: '🌤️',
      condition: 'Légèrement nuageux',
      humidity: 58,
      wind: 15,
      visibility: 12,
      pressure: 1012,
      lastUpdate: '3 min'
    },
    {
      name: 'Toulouse',
      country: 'France',
      temperature: 23,
      icon: '🌥️',
      condition: 'Nuageux',
      humidity: 70,
      wind: 10,
      visibility: 8,
      pressure: 1013,
      lastUpdate: '7 min'
    },
    {
      name: 'Nice',
      country: 'France',
      temperature: 25,
      icon: '☀️',
      condition: 'Beau temps',
      humidity: 55,
      wind: 14,
      visibility: 15,
      pressure: 1016,
      lastUpdate: '2 min'
    }
  ];

  constructor(
    public authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {}

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
}
