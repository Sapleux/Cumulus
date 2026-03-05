import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-5">
            <div class="card p-4 p-md-5">
              <div class="text-center mb-4">
                <div class="weather-icon-large mb-3">🌤️</div>
                <h2 class="fw-bold">Bienvenue sur Cumulus</h2>
                <p class="text-secondary">Connectez-vous pour accéder à vos prévisions personnalisées</p>
              </div>

              <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
              </div>

              <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
                <div class="mb-3">
                  <label class="form-label text-secondary small">Nom d'utilisateur</label>
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="username"
                    name="username"
                    placeholder="Votre nom d'utilisateur"
                    required
                    #usernameField="ngModel"
                  >
                </div>

                <div class="mb-4">
                  <label class="form-label text-secondary small">Mot de passe</label>
                  <input
                    type="password"
                    class="form-control"
                    [(ngModel)]="password"
                    name="password"
                    placeholder="Votre mot de passe"
                    required
                    #passwordField="ngModel"
                  >
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 py-2"
                  [disabled]="loading || !loginForm.valid"
                >
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Connexion...' : 'Se connecter' }}
                </button>
              </form>

              <div class="text-center mt-4">
                <span class="text-secondary">Pas encore de compte ?</span>
                <a routerLink="/register" class="ms-1" style="color: var(--primary-light)">S'inscrire</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: calc(100vh - 60px);
      display: flex;
      align-items: center;
      padding: 2rem 0;
      position: relative;
      overflow: hidden;
    }
    .auth-wrapper::before {
      content: '';
      position: absolute;
      top: -20%;
      right: -10%;
      width: 40%;
      height: 140%;
      background: radial-gradient(ellipse, rgba(14,165,233,0.08) 0%, transparent 60%);
      pointer-events: none;
    }
    .weather-icon-large {
      font-size: 3.5rem;
      opacity: 0.9;
    }
    .text-secondary { color: var(--text-secondary) !important; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Identifiants incorrects';
      }
    });
  }
}
