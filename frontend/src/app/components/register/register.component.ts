import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-5">
            <div class="card p-4 p-md-5">
              <div class="text-center mb-4">
                <div class="weather-icon-large mb-3">icon-cloud</div>
                <h2 class="fw-bold">Rejoignez Cumulus</h2>
                <p class="text-secondary">Créez votre compte et suivez la météo partout dans le monde</p>
              </div>

              <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
              </div>
              <div *ngIf="successMessage" class="alert alert-success" role="alert">
                {{ successMessage }}
              </div>

              <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
                <div class="mb-3">
                  <label class="form-label text-secondary small">Nom d'utilisateur</label>
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="username"
                    name="username"
                    placeholder="Choisissez un nom d'utilisateur"
                    required
                    minlength="3"
                  >
                </div>

                <div class="mb-3">
                  <label class="form-label text-secondary small">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    [(ngModel)]="email"
                    name="email"
                    placeholder="votre@email.com"
                    required
                    email
                  >
                </div>

                <div class="mb-4">
                  <label class="form-label text-secondary small">Mot de passe</label>
                  <input
                    type="password"
                    class="form-control"
                    [(ngModel)]="password"
                    name="password"
                    placeholder="Minimum 6 caractères"
                    required
                    minlength="6"
                  >
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 py-2"
                  [disabled]="loading || !registerForm.valid"
                >
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Inscription...' : 'Créer mon compte' }}
                </button>
              </form>

              <div class="text-center mt-4">
                <span class="text-secondary">Déjà un compte ?</span>
                <a routerLink="/login" class="ms-1" style="color: var(--primary-light)">Se connecter</a>
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
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie ! Redirection...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription';
      }
    });
  }
}
