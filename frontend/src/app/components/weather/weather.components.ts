import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DayCharts, DaySummary, WeatherIntrepretationCode, WeatherService, WICTimelineOver } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather',
  imports: [CommonModule, FormsModule, RouterLink],
  standalone: true,
  templateUrl: './weather.html',
  styleUrl: './weather.css',
})
export class WeatherComponent implements OnInit {
  private latitude: number = 47.6397;
  private longitude: number = 6.8638;
  private startDate: number = Date.now();
  private endDate: number = Date.now();
  public today: Date = new Date();
  public wic: WeatherIntrepretationCode[] = [];
  public wicOver: WICTimelineOver[] = [];
  public nextDaySummary: DaySummary[] = [];
  public dayChart: DayCharts = {
    sunRise: new Date(),
    sunSet: new Date(),
    UVs: [],
    windSpeeds: [],
    precipitations: []
  };

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.getWIC();
    this.getSummaryOfTheDay();
    this.getWICOver();
    this.getDayCharts();
  }

  getWIC(): void {
    this.weatherService.getWICTimeline(this.latitude, this.longitude, new Date(this.startDate), new Date(this.endDate)).subscribe(
      (data: WeatherIntrepretationCode[]) => {
        this.wic = data;
      }
    );
  }

  getSummaryOfTheDay(): void {
    this.weatherService.getSummaryOfNextDays(this.latitude, this.longitude).subscribe(
      (data: DaySummary[]) => {
        this.nextDaySummary = data;
      }
    );
  }

  getWICOver(): void {
    this.weatherService.getWICTimelineOver(this.latitude, this.longitude, this.today).subscribe(
      (data: WICTimelineOver[]) => {
        this.wicOver = data;
      }
    );
  }

  getDayCharts(): void {
    this.weatherService.getDayCharts(this.latitude, this.longitude, this.today).subscribe(
      (data: DayCharts) => {
        this.dayChart = data;
      }
    );
  }
}
