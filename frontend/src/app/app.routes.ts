import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CityDetailComponent } from './components/city-detail/city-detail.component';
import { authGuard } from './guards/auth.guard';
import { WeatherComponent } from './components/weather/weather.components';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'weather', component: WeatherComponent },
  { path: 'city/:name', component: CityDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
