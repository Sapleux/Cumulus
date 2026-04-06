import {Component, Input, OnInit} from '@angular/core';
import {NewsFeed, NewsItem, NewsService} from '../../services/news.service';
import {MapService} from '../../services/map.service';
import {CommonModule} from '@angular/common';
import {GeoapifyResponse} from "../map/map.types";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-news',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './news.component.html',
    styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
    newsService: NewsService;
    mapService: MapService;
    newsList: NewsItem[] = [];
    newsFeed: NewsFeed | null = null;

    @Input() hasSearchBar = false;
    @Input() isCoordinates = true;
    @Input() query = '';

    searchQuery: string = '';

    currentPage = 1;
    readonly pageSize = 6;

    constructor(newsService: NewsService, mapService: MapService) {
        this.newsService = newsService;
        this.mapService = mapService;
    }

    ngOnInit(): void {
        if (this.query != '') {
            if (this.isCoordinates) {
                const [latStr, lonStr] = this.query.split(',').map(s => s.trim());
                const lat = parseFloat(latStr);
                const lon = parseFloat(lonStr);
                if (isNaN(lat) || isNaN(lon)) {
                    console.error('Invalid coordinates:', this.query);
                    return;
                }
                this.mapService.reverseGeocode(lat, lon).subscribe({
                    next: (data: GeoapifyResponse) => {
                        if (data.features?.length > 0) {
                            const place = data.features[0];
                            const city = place.properties.city ?? place.properties.formatted;

                            this.newsService.getNewsByQuery(city).subscribe((feed) => {
                                this.newsFeed = feed;
                                this.newsList = feed.items;
                                this.currentPage = 1;
                            });
                        }
                    }
                });
            } else {

                this.newsService.getNewsByQuery(this.query).subscribe((feed) => {
                    this.newsFeed = feed;
                    this.newsList = feed.items;
                    this.currentPage = 1;
                });
            }

        }
    }

    filterNews(): void {
        const query = this.searchQuery.trim().toLowerCase();

        this.newsList = [];
        this.newsService.getNewsByQuery(query).subscribe((feed) => {
            this.newsFeed = feed;
            this.newsList = feed.items;
            this.currentPage = 1;
        });
    }

    get totalPages(): number {
        return Math.max(1, Math.ceil(this.newsList.length / this.pageSize));
    }

    get paginatedNewsList(): NewsItem[] {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.newsList.slice(start, start + this.pageSize);
    }

    goToPreviousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    goToNextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }
}