import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ChatComponent } from "./components/chat/chat.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ChatComponent],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark sticky-top">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">
          <span style="color: var(--primary-light)">☁️</span> Cumulus
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center gap-2">
            <li class="nav-item">
              <a class="nav-link" routerLink="/">Accueil</a>
            </li>
            <ng-container *ngIf="!authService.isLoggedIn(); else loggedIn">
              <li class="nav-item">
                <a class="nav-link" routerLink="/login">Connexion</a>
              </li>
              <li class="nav-item">
                <a class="btn btn-primary btn-sm px-3" routerLink="/register">Inscription</a>
              </li>
            </ng-container>
            <ng-template #loggedIn>
              <li class="nav-item">
                <span class="nav-link text-info">
                  {{ authService.getUser()?.username }}
                </span>
              </li>
              <li class="nav-item">
                <button class="btn btn-outline-light btn-sm" (click)="logout()">Déconnexion</button>
              </li>
            </ng-template>
          </ul>
        </div>
      </div>
    </nav>

    <router-outlet></router-outlet>
    <app-chat></app-chat>
  `
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
