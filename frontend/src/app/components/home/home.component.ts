import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center min-vh-75">
          <div class="col-lg-7">
            <div class="hero-badge mb-3">
              <span>🚀 Application Full Stack</span>
            </div>
            <h1 class="hero-title">
              Spring Boot + Angular
              <span class="gradient-text">+ JWT Auth</span>
            </h1>
            <p class="hero-subtitle">
              Une application moderne avec authentification JWT sécurisée,
              base de données SQLite et déploiement Docker.
            </p>
            <div class="d-flex gap-3 mt-4">
              <a *ngIf="!authService.isLoggedIn()" routerLink="/register" class="btn btn-primary btn-lg px-4">
                Commencer
              </a>
              <a *ngIf="!authService.isLoggedIn()" routerLink="/login" class="btn btn-outline-light btn-lg px-4">
                Se connecter
              </a>
              <button *ngIf="authService.isLoggedIn()" class="btn btn-primary btn-lg px-4" (click)="loadProtected()">
                Voir contenu protégé
              </button>
            </div>
          </div>
          <div class="col-lg-5 d-none d-lg-block">
            <div class="hero-visual">
              <div class="code-block">
                <div class="code-header">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                </div>
                <pre><code><span class="kw">POST</span> /api/auth/login
&#123;
  <span class="str">"username"</span>: <span class="str">"demo"</span>,
  <span class="str">"password"</span>: <span class="str">"••••••"</span>
&#125;

<span class="cmt">// Response</span>
&#123;
  <span class="str">"token"</span>: <span class="str">"eyJhbG..."</span>,
  <span class="str">"type"</span>: <span class="str">"Bearer"</span>
&#125;</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Messages Section -->
    <section class="py-5" *ngIf="publicMessage || protectedMessage">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="card p-4" *ngIf="publicMessage">
              <div class="d-flex align-items-center gap-3">
                <span class="badge-icon success">✓</span>
                <div>
                  <h6 class="mb-1">Contenu Public</h6>
                  <p class="mb-0 text-secondary">{{ publicMessage }}</p>
                </div>
              </div>
            </div>
            <div class="card p-4 mt-3" *ngIf="protectedMessage">
              <div class="d-flex align-items-center gap-3">
                <span class="badge-icon info">🔒</span>
                <div>
                  <h6 class="mb-1">Contenu Protégé</h6>
                  <p class="mb-0 text-secondary">{{ protectedMessage }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4" *ngFor="let feature of features">
            <div class="card p-4 h-100 feature-card">
              <div class="feature-icon mb-3">{{ feature.icon }}</div>
              <h5>{{ feature.title }}</h5>
              <p class="text-secondary mb-0">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .min-vh-75 { min-height: 75vh; }

    .hero-section {
      padding: 4rem 0 2rem;
      position: relative;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -20%;
      width: 60%;
      height: 200%;
      background: radial-gradient(ellipse, rgba(79,70,229,0.12) 0%, transparent 60%);
      pointer-events: none;
    }

    .hero-badge {
      display: inline-block;
      padding: 0.4rem 1rem;
      background: rgba(79,70,229,0.15);
      border: 1px solid rgba(79,70,229,0.3);
      border-radius: 50px;
      font-size: 0.85rem;
      color: var(--primary-light);
    }

    .hero-title {
      font-size: 3.2rem;
      font-weight: 700;
      line-height: 1.15;
      margin-bottom: 1rem;
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--primary-light), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 1.15rem;
      color: var(--text-secondary);
      max-width: 500px;
      line-height: 1.7;
    }

    .hero-visual {
      perspective: 1000px;
    }

    .code-block {
      background: #1a1a2e;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      overflow: hidden;
      transform: rotateY(-5deg) rotateX(2deg);
      box-shadow: 0 25px 50px rgba(0,0,0,0.4);
    }

    .code-header {
      background: rgba(255,255,255,0.05);
      padding: 0.75rem 1rem;
      display: flex;
      gap: 6px;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .dot.red { background: #ff5f57; }
    .dot.yellow { background: #febc2e; }
    .dot.green { background: #28c840; }

    .code-block pre {
      padding: 1.25rem;
      margin: 0;
      font-size: 0.85rem;
      color: #e2e8f0;
    }

    .code-block .kw { color: #c084fc; }
    .code-block .str { color: #34d399; }
    .code-block .cmt { color: #64748b; }

    .feature-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.3);
    }

    .feature-icon {
      font-size: 2rem;
    }

    .badge-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    .badge-icon.success { background: rgba(16,185,129,0.15); }
    .badge-icon.info { background: rgba(6,182,212,0.15); }

    .text-secondary { color: var(--text-secondary) !important; }
  `]
})
export class HomeComponent implements OnInit {
  publicMessage = '';
  protectedMessage = '';

  features = [
    {
      icon: '🔐',
      title: 'Authentification JWT',
      description: 'Système complet d\'inscription et connexion avec tokens JWT sécurisés.'
    },
    {
      icon: '🗄️',
      title: 'SQLite Database',
      description: 'Base de données légère et performante, parfaite pour le développement et les petits projets.'
    },
    {
      icon: '🐳',
      title: 'Docker Ready',
      description: 'Déploiement simplifié avec Docker Compose. Un seul commande pour tout lancer.'
    }
  ];

  constructor(
    public authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.apiService.getPublicContent().subscribe({
      next: (res) => this.publicMessage = res.message,
      error: () => {}
    });
  }

  loadProtected(): void {
    this.apiService.getProtectedContent().subscribe({
      next: (res) => this.protectedMessage = res.message,
      error: () => this.protectedMessage = 'Erreur: vous devez être connecté.'
    });
  }
}
