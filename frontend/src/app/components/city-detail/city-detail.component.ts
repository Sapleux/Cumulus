import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherInterpretationCode, WEATHER_THEMES, WeatherTheme } from '../../models/weather.model';

@Component({
  selector: 'app-city-detail',
  standalone: true,
  imports: [CommonModule],
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

        <!-- Moon Icon -->
        <symbol id="icon-moon" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
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

        <!-- Sunrise Icon -->
        <symbol id="icon-sunrise" viewBox="0 0 24 24">
          <path d="M17 18a5 5 0 1 0-10 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M12 9v-7M8 13l-2-2M16 13l2-2M2 22h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </symbol>

        <!-- Sunset Icon -->
        <symbol id="icon-sunset" viewBox="0 0 24 24">
          <path d="M17 18a5 5 0 1 0-10 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M12 2v7M8 13l-2-2M16 13l2-2M2 22h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </symbol>

        <!-- Dusk Icon -->
        <symbol id="icon-dusk" viewBox="0 0 24 24">
          <path d="M17 18a5 5 0 1 0-10 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
          <path d="M2 22h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="12" cy="13" r="3" fill="currentColor" opacity="0.4"/>
        </symbol>

        <!-- Temperature Icon -->
        <symbol id="icon-temperature" viewBox="0 0 24 24">
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke="currentColor" stroke-width="2" fill="none"/>
        </symbol>

        <!-- Wind Icon -->
        <symbol id="icon-wind" viewBox="0 0 24 24">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </symbol>
      </defs>
    </svg>

    <div class="city-detail-page" [style.background]="currentTheme.bgGradient">
      <!-- Weather Graphics Overlay -->
      <div class="weather-graphics">
        <!-- Clear Sky -->
        <div class="sun-rays" *ngIf="weatherCode === 0">
          <div class="ray" *ngFor="let i of [1,2,3,4,5,6,7,8]"></div>
        </div>

        <!-- Fog -->
        <div class="fog-layers" *ngIf="weatherCode === 2">
          <div class="fog-layer" *ngFor="let i of [1,2,3,4,5]"></div>
        </div>

        <!-- Rain -->
        <div class="rain-drops" *ngIf="weatherCode === 4">
          <div class="drop" *ngFor="let i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]"></div>
        </div>

        <!-- Snow -->
        <div class="snowflakes" *ngIf="weatherCode === 5">
          <div class="snowflake" *ngFor="let i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]">❄</div>
        </div>

        <!-- Thunderstorm -->
        <div class="lightning" *ngIf="weatherCode === 6">
          <div class="flash"></div>
        </div>

        <!-- Clouds for MainlyClear and Drizzle -->
        <div class="floating-clouds" *ngIf="weatherCode === 1 || weatherCode === 3">
          <div class="cloud cloud-1">☁️</div>
          <div class="cloud cloud-2">☁️</div>
          <div class="cloud cloud-3">☁️</div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container">
        <div class="detail-grid">
          <!-- Left Column -->
          <div class="left-column">
            <!-- Current Weather Card -->
            <div class="current-weather-card"
                 [style.background]="currentTheme.cardGradient"
                 [style.border-color]="currentTheme.borderColor">
              <div class="card-overlay"></div>
              <div class="city-title">
                <h1>{{ city.name }}</h1>
                <p class="coordinates">Coordonnées</p>
              </div>

              <div class="current-temp-section">
                <svg class="main-weather-icon" viewBox="0 0 24 24">
                  <use [attr.href]="'#' + getIconId(currentTheme.icon)"></use>
                </svg>
                <div class="temp-info">
                  <div class="temperature">{{ city.temperature }} C°</div>
                  <div class="weather-condition">{{ getWeatherConditionText() }}</div>
                </div>
              </div>

              <!-- Hourly Forecast -->
              <div class="hourly-forecast-panel">
                <div class="hourly-scroll-container">
                  <div class="hour-item" *ngFor="let hour of hourlyForecast"
                       (mouseenter)="onHourHover($event, hour)"
                       (mouseleave)="hoveredHour = null">
                    <div class="hour-time">{{ hour.time }}</div>
                    <svg class="hour-icon" viewBox="0 0 24 24">
                      <use [attr.href]="'#' + getIconId(hour.icon)"></use>
                    </svg>
                    <div class="hour-temp">{{ hour.temp }}°</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tooltip positioned globally -->
          <div class="hour-tooltip"
               *ngIf="hoveredHour"
               [style.top.px]="tooltipPosition.top"
               [style.left.px]="tooltipPosition.left"
               [style.background]="getTooltipBackground()"
               [style.border-color]="getTooltipBorderColor()">
            <div class="tooltip-row">
              <svg class="tooltip-icon" viewBox="0 0 24 24">
                <use href="#icon-temperature"></use>
              </svg>
              <span class="tooltip-text">{{ hoveredHour.temp }} C°</span>
            </div>
            <div class="tooltip-row">
              <svg class="tooltip-icon" viewBox="0 0 24 24">
                <use href="#icon-sun"></use>
              </svg>
              <span class="tooltip-text">{{ hoveredHour.sunMinutes }} min</span>
            </div>
            <div class="tooltip-row">
              <svg class="tooltip-icon" viewBox="0 0 24 24">
                <use href="#icon-wind"></use>
              </svg>
              <span class="tooltip-text">{{ hoveredHour.wind }} km/h</span>
            </div>
            <div class="tooltip-arrow" [style.border-top-color]="getTooltipBackground()"></div>
          </div>

          <!-- Weekly Forecast Card -->
          <div class="weekly-forecast-card">
            <div class="week-day"
                 *ngFor="let day of weeklyForecast"
                 (click)="selectDay(day)"
                 [class.selected]="selectedDay === day.name">
              <span class="day-name">{{ day.name }}</span>
              <svg class="day-icon" viewBox="0 0 24 24">
                <use [attr.href]="'#' + getIconId(day.icon)"></use>
              </svg>
              <span class="day-temp-min">{{ day.tempMin }} C°</span>
              <span class="day-temp-max">{{ day.tempMax }} C°</span>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="right-column" *ngIf="selectedDay">
          <!-- Daily Details Card -->
          <div class="daily-details-card">
            <!-- Day Header -->
            <div class="day-indicator">
              <div class="day-indicator-line"></div>
              <div class="day-indicator-content">
                <h3>{{ selectedDay }}</h3>
                <span class="day-indicator-subtitle">Prévisions détaillées</span>
              </div>
            </div>

            <!-- Sun Timeline -->
            <div class="detail-module sun-module">
              <div class="module-header">
                <span class="module-title">SOLEIL</span>
              </div>

              <div class="sun-times">
                <div class="sun-time-item">
                  <div class="sun-icon-circle sunrise">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="4" fill="currentColor"/>
                      <path d="M12 2v4M12 18v4M22 12h-4M6 12H2M19.07 4.93l-2.83 2.83M7.76 16.24l-2.83 2.83M19.07 19.07l-2.83-2.83M7.76 7.76L4.93 4.93"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div class="sun-time-info">
                    <div class="sun-time-label">Lever</div>
                    <div class="sun-time-value">{{ sunrise }}</div>
                  </div>
                </div>

                <div class="sun-separator">
                  <div class="sun-path">
                    <svg viewBox="0 0 60 30" preserveAspectRatio="none">
                      <path
                        d="M 0 25 Q 30 5, 60 25"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-dasharray="3,3"
                        opacity="0.3"
                      />
                    </svg>
                  </div>
                  <div class="sun-duration">{{ getDaylightDuration() }}</div>
                </div>

                <div class="sun-time-item">
                  <div class="sun-icon-circle sunset">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="4" fill="currentColor"/>
                      <path d="M12 2v4M12 18v4M22 12h-4M6 12H2"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div class="sun-time-info">
                    <div class="sun-time-label">Coucher</div>
                    <div class="sun-time-value">{{ sunset }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- UV Chart -->
            <div class="detail-module">
              <div class="module-header">
                <span class="module-title">INDICE UV</span>
                <span class="module-highlight" [class.module-highlight--active]="hoveredUV !== null">{{ getMaxUV() }}</span>
              </div>
              <div class="simple-chart">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none"
                     (mousemove)="onUVChartHover($event)"
                     (mouseleave)="resetUVHover()">
                  <defs>
                    <linearGradient id="uvFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:0.3" />
                      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 35 L 10 32 L 20 25 L 30 18 L 40 12 L 50 8 L 60 12 L 70 18 L 80 25 L 90 30 L 100 35"
                    fill="url(#uvFill)"
                  />
                  <path
                    d="M 0 35 L 10 32 L 20 25 L 30 18 L 40 12 L 50 8 L 60 12 L 70 18 L 80 25 L 90 30 L 100 35"
                    fill="none"
                    stroke="#f59e0b"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="module-footer">
                <span>Bas</span>
                <span>8 à 13h</span>
              </div>
            </div>

            <!-- Wind Chart -->
            <div class="detail-module">
              <div class="module-header">
                <span class="module-title">VENT</span>
                <span class="module-highlight" [class.module-highlight--active]="hoveredWind !== null">{{ getMaxWind() }} km/h</span>
              </div>
              <div class="simple-chart">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none"
                     (mousemove)="onWindChartHover($event)"
                     (mouseleave)="resetWindHover()">
                  <defs>
                    <linearGradient id="windFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3" />
                      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 30 L 10 28 L 20 22 L 30 18 L 40 16 L 50 15 L 60 16 L 70 20 L 80 24 L 90 27 L 100 30"
                    fill="url(#windFill)"
                  />
                  <path
                    d="M 0 30 L 10 28 L 20 22 L 30 18 L 40 16 L 50 15 L 60 16 L 70 20 L 80 24 L 90 27 L 100 30"
                    fill="none"
                    stroke="#3b82f6"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="module-footer">
                <span>12 km/h</span>
                <span>Vent d'ouest</span>
              </div>
            </div>

            <!-- Precipitation Chart -->
            <div class="detail-module">
              <div class="module-header">
                <span class="module-title">PRÉCIPITATIONS</span>
                <span class="module-highlight" [class.module-highlight--active]="hoveredPrecipitation !== null">{{ getTotalPrecipitation() }} mm</span>
              </div>
              <div class="precipitation-bars">
                <div class="bar-item" *ngFor="let bar of precipitationBars; let i = index">
                  <div class="bar" [style.height.%]="bar.height"
                       (mouseenter)="onPrecipitationBarHover(i)"
                       (mouseleave)="resetPrecipitationHover()">
                    <div class="bar-fill"></div>
                  </div>
                </div>
              </div>
              <div class="module-footer">
                <span>6h</span>
                <span>12h</span>
                <span>18h</span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
  `,
  styles: [`
    .city-detail-page {
      min-height: 100vh;
      transition: background 0.5s ease;
      position: relative;
      overflow: hidden;
    }

    /* Weather Graphics Overlay */
    .weather-graphics {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    /* Sun Rays Animation */
    .sun-rays {
      position: absolute;
      top: 10%;
      right: 15%;
      width: 200px;
      height: 200px;
      animation: rotate 30s linear infinite;
    }

    .ray {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 80px;
      background: linear-gradient(180deg, rgba(251, 191, 36, 0.4), transparent);
      transform-origin: 2px 0;
    }

    .ray:nth-child(1) { transform: rotate(0deg); }
    .ray:nth-child(2) { transform: rotate(45deg); }
    .ray:nth-child(3) { transform: rotate(90deg); }
    .ray:nth-child(4) { transform: rotate(135deg); }
    .ray:nth-child(5) { transform: rotate(180deg); }
    .ray:nth-child(6) { transform: rotate(225deg); }
    .ray:nth-child(7) { transform: rotate(270deg); }
    .ray:nth-child(8) { transform: rotate(315deg); }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Fog Layers */
    .fog-layers {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .fog-layer {
      position: absolute;
      width: 200%;
      height: 100px;
      background: linear-gradient(90deg,
        transparent,
        rgba(156, 163, 175, 0.3),
        rgba(156, 163, 175, 0.5),
        rgba(156, 163, 175, 0.3),
        transparent);
      animation: fogMove 20s linear infinite;
    }

    .fog-layer:nth-child(1) { top: 10%; animation-duration: 25s; }
    .fog-layer:nth-child(2) { top: 30%; animation-duration: 20s; animation-delay: -5s; }
    .fog-layer:nth-child(3) { top: 50%; animation-duration: 30s; animation-delay: -10s; }
    .fog-layer:nth-child(4) { top: 70%; animation-duration: 22s; animation-delay: -15s; }
    .fog-layer:nth-child(5) { top: 85%; animation-duration: 28s; animation-delay: -8s; }

    @keyframes fogMove {
      from { transform: translateX(-50%); }
      to { transform: translateX(0%); }
    }

    /* Rain Drops */
    .rain-drops {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .drop {
      position: absolute;
      width: 2px;
      height: 30px;
      background: linear-gradient(180deg, transparent, rgba(71, 85, 105, 0.6));
      animation: fall linear infinite;
    }

    .drop:nth-child(1) { left: 5%; animation-duration: 1s; animation-delay: 0s; }
    .drop:nth-child(2) { left: 12%; animation-duration: 1.2s; animation-delay: 0.2s; }
    .drop:nth-child(3) { left: 18%; animation-duration: 0.9s; animation-delay: 0.4s; }
    .drop:nth-child(4) { left: 25%; animation-duration: 1.1s; animation-delay: 0.1s; }
    .drop:nth-child(5) { left: 32%; animation-duration: 1s; animation-delay: 0.5s; }
    .drop:nth-child(6) { left: 38%; animation-duration: 1.3s; animation-delay: 0.3s; }
    .drop:nth-child(7) { left: 45%; animation-duration: 0.95s; animation-delay: 0.6s; }
    .drop:nth-child(8) { left: 52%; animation-duration: 1.15s; animation-delay: 0.2s; }
    .drop:nth-child(9) { left: 58%; animation-duration: 1.05s; animation-delay: 0.4s; }
    .drop:nth-child(10) { left: 65%; animation-duration: 1.25s; animation-delay: 0.1s; }
    .drop:nth-child(11) { left: 72%; animation-duration: 1s; animation-delay: 0.5s; }
    .drop:nth-child(12) { left: 78%; animation-duration: 1.1s; animation-delay: 0.3s; }
    .drop:nth-child(13) { left: 85%; animation-duration: 0.9s; animation-delay: 0.6s; }
    .drop:nth-child(14) { left: 92%; animation-duration: 1.2s; animation-delay: 0.2s; }
    .drop:nth-child(15) { left: 8%; animation-duration: 1.15s; animation-delay: 0.7s; }
    .drop:nth-child(16) { left: 15%; animation-duration: 1.05s; animation-delay: 0.8s; }
    .drop:nth-child(17) { left: 42%; animation-duration: 1s; animation-delay: 0.9s; }
    .drop:nth-child(18) { left: 68%; animation-duration: 1.3s; animation-delay: 0.4s; }
    .drop:nth-child(19) { left: 75%; animation-duration: 0.95s; animation-delay: 0.7s; }
    .drop:nth-child(20) { left: 88%; animation-duration: 1.1s; animation-delay: 0.5s; }

    @keyframes fall {
      from {
        top: -50px;
        opacity: 1;
      }
      to {
        top: 100%;
        opacity: 0.3;
      }
    }

    /* Snowflakes */
    .snowflakes {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .snowflake {
      position: absolute;
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.5rem;
      animation: snowfall linear infinite;
    }

    .snowflake:nth-child(1) { left: 10%; animation-duration: 8s; animation-delay: 0s; }
    .snowflake:nth-child(2) { left: 20%; animation-duration: 10s; animation-delay: 1s; }
    .snowflake:nth-child(3) { left: 30%; animation-duration: 9s; animation-delay: 2s; }
    .snowflake:nth-child(4) { left: 40%; animation-duration: 11s; animation-delay: 0.5s; }
    .snowflake:nth-child(5) { left: 50%; animation-duration: 8.5s; animation-delay: 1.5s; }
    .snowflake:nth-child(6) { left: 60%; animation-duration: 9.5s; animation-delay: 0.8s; }
    .snowflake:nth-child(7) { left: 70%; animation-duration: 10.5s; animation-delay: 2s; }
    .snowflake:nth-child(8) { left: 80%; animation-duration: 8.8s; animation-delay: 1.2s; }
    .snowflake:nth-child(9) { left: 90%; animation-duration: 9.2s; animation-delay: 0.3s; }
    .snowflake:nth-child(10) { left: 15%; animation-duration: 10.2s; animation-delay: 1.8s; }
    .snowflake:nth-child(11) { left: 25%; animation-duration: 8.3s; animation-delay: 0.6s; }
    .snowflake:nth-child(12) { left: 55%; animation-duration: 9.8s; animation-delay: 1.3s; }
    .snowflake:nth-child(13) { left: 75%; animation-duration: 10.8s; animation-delay: 0.9s; }
    .snowflake:nth-child(14) { left: 85%; animation-duration: 9.3s; animation-delay: 2.2s; }
    .snowflake:nth-child(15) { left: 95%; animation-duration: 8.7s; animation-delay: 1.6s; }

    @keyframes snowfall {
      from {
        top: -10%;
        transform: translateX(0) rotate(0deg);
      }
      to {
        top: 110%;
        transform: translateX(100px) rotate(360deg);
      }
    }

    /* Lightning Flash */
    .lightning {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .flash {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0);
      animation: lightning 5s infinite;
    }

    @keyframes lightning {
      0%, 100% { background: rgba(255, 255, 255, 0); }
      49% { background: rgba(255, 255, 255, 0); }
      50% { background: rgba(255, 255, 255, 0.8); }
      51% { background: rgba(255, 255, 255, 0); }
      52% { background: rgba(255, 255, 255, 0.6); }
      53% { background: rgba(255, 255, 255, 0); }
    }

    /* Floating Clouds */
    .floating-clouds {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .cloud {
      position: absolute;
      font-size: 4rem;
      opacity: 0.6;
      animation: cloudFloat linear infinite;
    }

    .cloud-1 {
      top: 15%;
      animation-duration: 40s;
      animation-delay: 0s;
    }

    .cloud-2 {
      top: 45%;
      animation-duration: 50s;
      animation-delay: -10s;
    }

    .cloud-3 {
      top: 75%;
      animation-duration: 45s;
      animation-delay: -20s;
    }

    @keyframes cloudFloat {
      from {
        left: -10%;
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
      to {
        left: 110%;
        transform: translateY(0);
      }
    }

    /* Header */
    .page-header {
      padding: 1.5rem 0;
      background: rgba(186, 230, 253, 0.8);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(14, 165, 233, 0.2);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .btn-back {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 12px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.5rem;
      color: var(--text-primary);
      transition: all 0.3s ease;
    }

    .btn-back:hover {
      background: var(--primary);
      color: white;
      transform: scale(1.05);
    }

    .search-bar {
      flex: 1;
      max-width: 600px;
    }

    .search-bar input {
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 12px;
      font-size: 1rem;
      color: var(--text-primary);
      text-align: center;
    }

    .search-bar input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .btn-profile {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 12px;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      color: var(--text-primary);
      transition: all 0.3s ease;
    }

    .btn-profile:hover {
      border-color: var(--primary);
      transform: scale(1.05);
    }

    /* Main Layout */
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      position: relative;
      z-index: 1;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
      align-items: start;
      position: relative;
    }

    .left-column {
      position: relative;
      z-index: 1;
      min-width: 0;
    }

    .right-column {
      position: relative;
      z-index: 1;
    }

    /* Left Column - Current Weather */
    .current-weather-card {
      border-radius: 28px;
      padding: 2.5rem;
      margin-bottom: 2rem;
      position: relative;
      overflow: hidden;
      transition: all 0.5s ease;
      border: 2px solid;
    }

    .current-weather-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 28px;
      overflow: hidden;
      z-index: -1;
    }

    .current-weather-card .card-overlay {
      position: absolute;
      top: -50%;
      right: -20%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .city-title {
      position: relative;
      z-index: 1;
      margin-bottom: 2rem;
    }

    .city-title h1 {
      font-size: 3rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .coordinates {
      font-size: 1rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .current-temp-section {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 3rem;
      position: relative;
      z-index: 1;
    }

    .main-weather-icon {
      width: 10rem;
      height: 10rem;
      color: rgba(255, 255, 255, 0.9);
      filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
    }

    .temp-info {
      flex: 1;
    }

    .temperature {
      font-size: 4rem;
      font-weight: 300;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .weather-condition {
      font-size: 1.25rem;
      color: var(--text-secondary);
      font-weight: 500;
      margin-top: 0.5rem;
    }

    /* Hourly Forecast Panel */
    .hourly-forecast-panel {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 100%;
    }

    .hourly-scroll-container {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      overflow-y: visible;
      padding: 0.5rem 0.25rem 0.75rem;
      margin: -0.5rem -0.25rem;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      max-width: 100%;
    }

    .hourly-scroll-container::-webkit-scrollbar {
      height: 6px;
    }

    .hourly-scroll-container::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 3px;
      margin: 0 0.5rem;
    }

    .hourly-scroll-container::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }

    .hourly-scroll-container::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.3);
    }

    .hour-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      min-width: 60px;
      flex-shrink: 0;
      position: relative;
      cursor: pointer;
      padding: 0.75rem 0.5rem;
      border-radius: 16px;
      transition: all 0.2s ease;
      background: transparent;
    }

    .hour-item:hover {
      background: rgba(255, 255, 255, 0.8);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 1001;
    }

    .hour-time {
      font-size: 0.8125rem;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.6);
      order: 1;
    }

    .hour-icon {
      width: 2rem;
      height: 2rem;
      order: 2;
      color: rgba(0, 0, 0, 0.7);
    }

    .hour-temp {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      order: 3;
    }

    .hour-tooltip {
      position: fixed;
      transform: translateX(-50%);
      border-radius: 12px;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      white-space: nowrap;
      z-index: 9999;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(10px);
      border: 2px solid;
      transition: opacity 0.2s ease, transform 0.2s ease;
      pointer-events: none;
      animation: tooltipFadeIn 0.2s ease;
    }

    @keyframes tooltipFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .tooltip-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0;
    }

    .tooltip-icon {
      width: 1rem;
      height: 1rem;
      color: rgba(0, 0, 0, 0.6);
    }

    .tooltip-text {
      font-weight: 600;
      color: var(--text-primary);
    }

    .tooltip-arrow {
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid;
    }

    /* Weekly Forecast */
    .weekly-forecast-card {
      background: rgba(186, 230, 253, 0.5);
      border: 2px solid rgba(14, 165, 233, 0.3);
      border-radius: 20px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .week-day {
      display: grid;
      grid-template-columns: 120px 80px 1fr 1fr;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 12px;
      font-size: 1.125rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .week-day:hover {
      transform: translateX(8px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .week-day.selected {
      border-color: var(--primary);
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
      transform: translateX(8px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .day-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .day-icon {
      width: 2rem;
      height: 2rem;
      text-align: center;
      color: rgba(0, 0, 0, 0.7);
    }

    .day-temp-min, .day-temp-max {
      text-align: center;
      font-weight: 500;
      color: var(--text-secondary);
    }

    /* Right Column - Daily Details */
    .daily-details-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: sticky;
      top: 100px;
      animation: slideIn 0.4s ease;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 24px;
      border: 2px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Detail Modules */
    .detail-module {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 1.25rem;
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    /* Day Indicator */
    .day-indicator {
      position: relative;
      margin-bottom: 1rem;
      padding: 0 0.5rem;
    }

    .day-indicator-line {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(180deg, var(--primary) 0%, var(--primary-light) 100%);
      border-radius: 2px;
    }

    .day-indicator-content {
      padding-left: 1rem;
    }

    .day-indicator h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .day-indicator-subtitle {
      font-size: 0.8125rem;
      color: rgba(0, 0, 0, 0.5);
      font-weight: 500;
    }

    /* Module Components */
    .module-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .module-title {
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: rgba(0, 0, 0, 0.5);
      text-transform: uppercase;
    }

    .module-highlight {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      display: inline-block;
      transform-origin: right center;
      transition: transform 0.15s ease;
    }

    .module-highlight--active {
      transform: scale(1.33);
    }

    .module-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .module-row:last-child {
      margin-bottom: 0;
    }

    .module-label {
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: rgba(0, 0, 0, 0.5);
      text-transform: uppercase;
    }

    .module-value {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .module-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 0.75rem;
      font-size: 0.8125rem;
      color: rgba(0, 0, 0, 0.5);
    }

    /* Sun Module */
    .sun-module {
      padding: 1.25rem;
    }

    .sun-times {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 1rem;
    }

    .sun-time-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
    }

    .sun-icon-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .sun-icon-circle.sunrise {
      background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
    }

    .sun-icon-circle.sunset {
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    }

    .sun-time-info {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .sun-time-label {
      font-size: 0.75rem;
      color: rgba(0, 0, 0, 0.5);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .sun-time-value {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .sun-separator {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      flex-shrink: 0;
      width: 60px;
    }

    .sun-path {
      width: 100%;
      height: 30px;
      color: rgba(0, 0, 0, 0.3);
    }

    .sun-path svg {
      width: 100%;
      height: 100%;
    }

    .sun-duration {
      font-size: 0.6875rem;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.5);
      text-align: center;
      white-space: nowrap;
    }

    /* Simple Charts */
    .simple-chart {
      margin: 1rem 0;
      height: 60px;
      cursor: crosshair;
    }

    .simple-chart svg {
      width: 100%;
      height: 100%;
    }

    /* Precipitation Bars */
    .precipitation-bars {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      height: 60px;
      margin: 1rem 0;
      padding: 0 2px;
    }

    .bar-item {
      flex: 1;
      display: flex;
      align-items: flex-end;
      height: 100%;
    }

    .bar {
      width: 100%;
      display: flex;
      align-items: flex-end;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .bar-fill {
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, #3b82f6 0%, #60a5fa 100%);
      border-radius: 3px 3px 0 0;
      transition: all 0.3s ease;
    }

    .bar:hover .bar-fill {
      background: linear-gradient(180deg, #2563eb 0%, #3b82f6 100%);
      transform: scaleY(1.05);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }

      .daily-details-card {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .header-content {
        gap: 1rem;
      }

      .btn-profile span {
        display: none;
      }

      .city-title h1 {
        font-size: 2rem;
      }

      .current-temp-section {
        flex-direction: column;
        text-align: center;
      }

      .main-weather-icon {
        font-size: 6rem;
      }

      .temperature {
        font-size: 3rem;
      }

      .week-day {
        grid-template-columns: 100px 60px 1fr 1fr;
        font-size: 1rem;
      }
    }
  `]
})
export class CityDetailComponent implements OnInit {
  city: any;
  hoveredHour: any = null;
  selectedDay: string | null = null;
  sunrise = '07h00';
  sunset = '18h00';
  currentTheme: WeatherTheme = WEATHER_THEMES[WeatherInterpretationCode.ClearSky];
  weatherCode: WeatherInterpretationCode = WeatherInterpretationCode.ClearSky;
  tooltipPosition = { top: 0, left: 0 };

  // Mock data by city
  citiesData: { [key: string]: any } = {
    'Nice': {
      name: 'Nice',
      temperature: 28,
      weatherCode: WeatherInterpretationCode.ClearSky,
      sunMinutes: 60,
      wind: 8,
      hourlyForecast: [
        { time: '00h', icon: '🌙', temp: 20, sunMinutes: 0, wind: 5 },
        { time: '01h', icon: '🌙', temp: 19, sunMinutes: 0, wind: 5 },
        { time: '02h', icon: '🌙', temp: 19, sunMinutes: 0, wind: 4 },
        { time: '03h', icon: '🌙', temp: 18, sunMinutes: 0, wind: 4 },
        { time: '04h', icon: '🌙', temp: 18, sunMinutes: 0, wind: 4 },
        { time: '05h', icon: '🌙', temp: 18, sunMinutes: 0, wind: 5 },
        { time: '06h', icon: '🌅', temp: 20, sunMinutes: 30, wind: 5 },
        { time: '07h', icon: '☀️', temp: 22, sunMinutes: 58, wind: 6 },
        { time: '08h', icon: '☀️', temp: 24, sunMinutes: 60, wind: 7 },
        { time: '09h', icon: '☀️', temp: 26, sunMinutes: 60, wind: 8 },
        { time: '10h', icon: '☀️', temp: 27, sunMinutes: 60, wind: 8 },
        { time: '11h', icon: '☀️', temp: 28, sunMinutes: 60, wind: 9 },
        { time: '12h', icon: '☀️', temp: 29, sunMinutes: 60, wind: 10 },
        { time: '13h', icon: '☀️', temp: 30, sunMinutes: 60, wind: 10 },
        { time: '14h', icon: '☀️', temp: 30, sunMinutes: 60, wind: 11 },
        { time: '15h', icon: '☀️', temp: 29, sunMinutes: 60, wind: 11 },
        { time: '16h', icon: '☀️', temp: 28, sunMinutes: 60, wind: 10 },
        { time: '17h', icon: '☀️', temp: 27, sunMinutes: 55, wind: 9 },
        { time: '18h', icon: '🌇', temp: 25, sunMinutes: 45, wind: 8 },
        { time: '19h', icon: '🌆', temp: 24, sunMinutes: 20, wind: 7 },
        { time: '20h', icon: '🌃', temp: 22, sunMinutes: 0, wind: 6 },
        { time: '21h', icon: '🌙', temp: 21, sunMinutes: 0, wind: 6 },
        { time: '22h', icon: '🌙', temp: 20, sunMinutes: 0, wind: 5 },
        { time: '23h', icon: '🌙', temp: 20, sunMinutes: 0, wind: 5 }
      ]
    },
    'Paris': {
      name: 'Paris',
      temperature: 22,
      weatherCode: WeatherInterpretationCode.MainlyClear,
      sunMinutes: 45,
      wind: 12,
      hourlyForecast: this.generateHourlyForecast(18, 23, '⛅', 40, 12)
    },
    'Londres': {
      name: 'Londres',
      temperature: 15,
      weatherCode: WeatherInterpretationCode.Fog,
      sunMinutes: 15,
      wind: 5,
      hourlyForecast: this.generateHourlyForecast(13, 16, '🌫️', 15, 5)
    },
    'Brest': {
      name: 'Brest',
      temperature: 16,
      weatherCode: WeatherInterpretationCode.Drizzle,
      sunMinutes: 25,
      wind: 18,
      hourlyForecast: this.generateHourlyForecast(14, 17, '🌦️', 25, 18)
    },
    'Lille': {
      name: 'Lille',
      temperature: 12,
      weatherCode: WeatherInterpretationCode.Rain,
      sunMinutes: 10,
      wind: 22,
      hourlyForecast: this.generateHourlyForecast(10, 13, '🌧️', 10, 22)
    },
    'Chamonix': {
      name: 'Chamonix',
      temperature: -2,
      weatherCode: WeatherInterpretationCode.Snow,
      sunMinutes: 5,
      wind: 15,
      hourlyForecast: this.generateHourlyForecast(-4, 0, '❄️', 5, 15)
    },
    'Toulouse': {
      name: 'Toulouse',
      temperature: 18,
      weatherCode: WeatherInterpretationCode.Thunderstorm,
      sunMinutes: 20,
      wind: 35,
      hourlyForecast: this.generateHourlyForecast(16, 19, '⛈️', 20, 35)
    }
  };

  hourlyForecast: any[] = [];
  allHoursForecast: any[] = [];

  weeklyForecast = [
    { name: 'Lundi', icon: '☀️', tempMin: 11, tempMax: 21 },
    { name: 'Mardi', icon: '⛅', tempMin: 7, tempMax: 21 },
    { name: 'Mercredi', icon: '⛅', tempMin: 7, tempMax: 21 },
    { name: 'Jeudi', icon: '🌥️', tempMin: 7, tempMax: 21 },
    { name: 'Vendredi', icon: '☁️', tempMin: 7, tempMax: 21 }
  ];

  // Chart data
  uvChartPath = 'M 0 90 L 25 85 L 50 70 L 75 50 L 100 35 L 125 25 L 150 20 L 175 25 L 200 40 L 225 60 L 250 75 L 275 85 L 300 90';
  windChartPath = 'M 0 70 L 25 65 L 50 55 L 75 45 L 100 40 L 125 38 L 150 35 L 175 40 L 200 50 L 225 60 L 250 65 L 275 68 L 300 70';
  precipitationBars = [
    { height: 30 }, { height: 45 }, { height: 60 }, { height: 40 },
    { height: 55 }, { height: 35 }, { height: 50 }, { height: 65 },
    { height: 42 }, { height: 38 }, { height: 48 }, { height: 52 }
  ];

  // Points for charts with actual UV values (0-11 scale)
  uvData = [2, 3, 4, 5, 7, 9, 10, 9, 7, 5, 4, 3, 2];
  uvPoints = [
    { x: 0, y: 90, value: 2 }, { x: 25, y: 85, value: 3 }, { x: 50, y: 70, value: 4 }, { x: 75, y: 50, value: 5 },
    { x: 100, y: 35, value: 7 }, { x: 125, y: 25, value: 9 }, { x: 150, y: 20, value: 10 }, { x: 175, y: 25, value: 9 },
    { x: 200, y: 40, value: 7 }, { x: 225, y: 60, value: 5 }, { x: 250, y: 75, value: 4 }, { x: 275, y: 85, value: 3 }, { x: 300, y: 90, value: 2 }
  ];

  // Wind data in km/h
  windData = [12, 14, 18, 22, 25, 27, 28, 26, 22, 18, 15, 14, 12];
  windPoints = [
    { x: 0, y: 70, value: 12 }, { x: 25, y: 65, value: 14 }, { x: 50, y: 55, value: 18 }, { x: 75, y: 45, value: 22 },
    { x: 100, y: 40, value: 25 }, { x: 125, y: 38, value: 27 }, { x: 150, y: 35, value: 28 }, { x: 175, y: 40, value: 26 },
    { x: 200, y: 50, value: 22 }, { x: 225, y: 60, value: 18 }, { x: 250, y: 65, value: 15 }, { x: 275, y: 68, value: 14 }, { x: 300, y: 70, value: 12 }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const cityName = this.route.snapshot.paramMap.get('name');
    const cityData = this.citiesData[cityName || 'Nice'] || this.citiesData['Nice'];

    this.city = cityData;
    this.weatherCode = cityData.weatherCode;
    this.currentTheme = WEATHER_THEMES[this.weatherCode];
    this.hourlyForecast = cityData.hourlyForecast;
  }

  selectDay(day: any): void {
    this.selectedDay = day.name;
  }

  onHourHover(event: MouseEvent, hour: any): void {
    this.hoveredHour = hour;
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    // Position the tooltip above the hour item
    // We add more space (tooltip height + arrow + margin)
    this.tooltipPosition = {
      top: rect.top - 120, // Approximately tooltip height + arrow + margin
      left: rect.left + rect.width / 2 // Center horizontally
    };
  }

  getDayCardGradient(): string {
    // Retourne une version plus claire du gradient de la carte météo pour le bloc jour
    const baseColor = this.getThemeBaseColor();
    return `linear-gradient(135deg, ${baseColor}80 0%, ${baseColor}60 100%)`;
  }

  getThemeBaseColor(): string {
    switch (this.weatherCode) {
      case WeatherInterpretationCode.ClearSky:
        return '#fde68a';
      case WeatherInterpretationCode.MainlyClear:
        return '#bae6fd';
      case WeatherInterpretationCode.Fog:
        return '#d1d5db';
      case WeatherInterpretationCode.Drizzle:
        return '#a5f3fc';
      case WeatherInterpretationCode.Rain:
        return '#94a3b8';
      case WeatherInterpretationCode.Snow:
        return '#dbeafe';
      case WeatherInterpretationCode.Thunderstorm:
        return '#9ca3af';
      default:
        return '#fde68a';
    }
  }

  getWeatherConditionText(): string {
    switch (this.weatherCode) {
      case WeatherInterpretationCode.ClearSky:
        return 'Ciel dégagé';
      case WeatherInterpretationCode.MainlyClear:
        return 'Partiellement nuageux';
      case WeatherInterpretationCode.Fog:
        return 'Brouillard épais';
      case WeatherInterpretationCode.Drizzle:
        return 'Bruine légère';
      case WeatherInterpretationCode.Rain:
        return 'Pluie modérée';
      case WeatherInterpretationCode.Snow:
        return 'Chutes de neige';
      case WeatherInterpretationCode.Thunderstorm:
        return 'Orage violent';
      default:
        return 'Ciel dégagé';
    }
  }

  getTooltipBackground(): string {
    switch (this.weatherCode) {
      case WeatherInterpretationCode.ClearSky:
        return 'rgba(254, 243, 199, 0.98)';
      case WeatherInterpretationCode.MainlyClear:
        return 'rgba(224, 242, 254, 0.98)';
      case WeatherInterpretationCode.Fog:
        return 'rgba(243, 244, 246, 0.98)';
      case WeatherInterpretationCode.Drizzle:
        return 'rgba(207, 250, 254, 0.98)';
      case WeatherInterpretationCode.Rain:
        return 'rgba(226, 232, 240, 0.98)';
      case WeatherInterpretationCode.Snow:
        return 'rgba(239, 246, 255, 0.98)';
      case WeatherInterpretationCode.Thunderstorm:
        return 'rgba(229, 231, 235, 0.98)';
      default:
        return 'rgba(254, 243, 199, 0.98)';
    }
  }

  getTooltipBorderColor(): string {
    switch (this.weatherCode) {
      case WeatherInterpretationCode.ClearSky:
        return 'rgba(251, 191, 36, 0.6)';
      case WeatherInterpretationCode.MainlyClear:
        return 'rgba(59, 130, 246, 0.6)';
      case WeatherInterpretationCode.Fog:
        return 'rgba(156, 163, 175, 0.6)';
      case WeatherInterpretationCode.Drizzle:
        return 'rgba(6, 182, 212, 0.6)';
      case WeatherInterpretationCode.Rain:
        return 'rgba(71, 85, 105, 0.6)';
      case WeatherInterpretationCode.Snow:
        return 'rgba(147, 197, 253, 0.6)';
      case WeatherInterpretationCode.Thunderstorm:
        return 'rgba(75, 85, 99, 0.6)';
      default:
        return 'rgba(251, 191, 36, 0.6)';
    }
  }

  // Hover state for charts
  hoveredUV: number | null = null;
  hoveredWind: number | null = null;
  hoveredPrecipitation: number | null = null;

  getDayTemperature(): number {
    return this.city.temperature || 22;
  }

  getDaylightDuration(): string {
    return '12h 30min';
  }

  getMaxUV(): number {
    return this.hoveredUV !== null ? this.hoveredUV : 8;
  }

  getMaxWind(): number {
    return this.hoveredWind !== null ? this.hoveredWind : 35;
  }

  getTotalPrecipitation(): number {
    return this.hoveredPrecipitation !== null ? this.hoveredPrecipitation : 5.2;
  }

  getPrecipitationColor(height: number): string {
    if (height < 30) return '#3b82f6';
    if (height < 50) return '#0ea5e9';
    if (height < 70) return '#06b6d4';
    return '#0891b2';
  }

  onUVChartHover(event: MouseEvent): void {
    const svg = event.currentTarget as SVGElement;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const svgWidth = rect.width;

    // Calculate which point is closest
    const normalizedX = (x / svgWidth) * 100;
    let closestPoint = this.uvPoints[0];
    let minDistance = Math.abs(normalizedX - closestPoint.x);

    for (const point of this.uvPoints) {
      const distance = Math.abs(normalizedX - point.x);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    }

    this.hoveredUV = closestPoint.value;
  }

  onWindChartHover(event: MouseEvent): void {
    const svg = event.currentTarget as SVGElement;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const svgWidth = rect.width;

    // Calculate which point is closest
    const normalizedX = (x / svgWidth) * 100;
    let closestPoint = this.windPoints[0];
    let minDistance = Math.abs(normalizedX - closestPoint.x);

    for (const point of this.windPoints) {
      const distance = Math.abs(normalizedX - point.x);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    }

    this.hoveredWind = closestPoint.value;
  }

  onPrecipitationBarHover(index: number): void {
    // Calculate precipitation value based on bar height (height is percentage, scale to mm)
    const bar = this.precipitationBars[index];
    const precipValue = (bar.height / 100) * 8; // Scale to max 8mm
    this.hoveredPrecipitation = Math.round(precipValue * 10) / 10;
  }

  resetUVHover(): void {
    this.hoveredUV = null;
  }

  resetWindHover(): void {
    this.hoveredWind = null;
  }

  resetPrecipitationHover(): void {
    this.hoveredPrecipitation = null;
  }

  getIconId(iconText: string): string {
    const iconMap: { [key: string]: string } = {
      '☀️': 'icon-sun',
      '🌙': 'icon-moon',
      '⛅': 'icon-partly-cloudy',
      '☁️': 'icon-cloud',
      '🌧️': 'icon-rain',
      '🌦️': 'icon-drizzle',
      '❄️': 'icon-snow',
      '⛈️': 'icon-thunderstorm',
      '🌫️': 'icon-fog',
      '🌅': 'icon-sunrise',
      '🌇': 'icon-sunset',
      '🌆': 'icon-dusk',
      '🌃': 'icon-dusk',
      '🌥️': 'icon-cloud'
    };
    return iconMap[iconText] || 'icon-sun';
  }

  generateHourlyForecast(minTemp: number, maxTemp: number, icon: string, avgSun: number, avgWind: number): any[] {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const hourStr = i.toString().padStart(2, '0') + 'h';
      let temp, sunMinutes, currentIcon;

      if (i >= 0 && i < 6) {
        // Night
        temp = minTemp;
        sunMinutes = 0;
        currentIcon = '🌙';
      } else if (i === 6) {
        // Sunrise
        temp = minTemp + 2;
        sunMinutes = 30;
        currentIcon = '🌅';
      } else if (i >= 7 && i < 18) {
        // Day - temperature rises then falls
        const dayProgress = (i - 7) / 11;
        temp = Math.round(minTemp + (maxTemp - minTemp) * (1 - Math.abs(dayProgress - 0.5) * 2));
        sunMinutes = avgSun;
        currentIcon = icon;
      } else if (i === 18) {
        // Sunset
        temp = minTemp + 3;
        sunMinutes = 45;
        currentIcon = '🌇';
      } else if (i === 19) {
        // Evening
        temp = minTemp + 2;
        sunMinutes = 20;
        currentIcon = '🌆';
      } else if (i === 20) {
        // Dusk
        temp = minTemp + 1;
        sunMinutes = 0;
        currentIcon = '🌃';
      } else {
        // Night
        temp = minTemp;
        sunMinutes = 0;
        currentIcon = '🌙';
      }

      hours.push({
        time: hourStr,
        icon: currentIcon,
        temp: temp,
        sunMinutes: sunMinutes,
        wind: avgWind + Math.floor(Math.random() * 3 - 1)
      });
    }
    return hours;
  }
}
