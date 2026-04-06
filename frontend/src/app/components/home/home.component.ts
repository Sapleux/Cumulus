import { Component } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MapComponent } from "../map/map.component";
import { CarouselComponent } from "../carousel/carousel.component";
import {NewsComponent} from "../news/news.component";
import {ChatComponent} from "../chat/chat.component";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [
    CarouselComponent,
    MapComponent,
    NewsComponent,
    ChatComponent,
    NgIf,
    RouterLink
  ],
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(public authService: AuthService) { }
}
