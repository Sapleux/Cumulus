import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Map from 'ol/Map';
import View from 'ol/View';
import FullScreen from 'ol/control/FullScreen';
import olms from 'ol-mapbox-style';
import { transform } from 'ol/proj';
import { MapService } from '../../services/map.service';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  @ViewChild('map', { static: true })
  mapContainer!: ElementRef<HTMLElement>;

  map!: Map;
  city = '';
  suggestions: any[] = [];
  loadingLocation = false;
  markerSource = new VectorSource();

  private mapReady = false;

  constructor(private mapService: MapService) {}

  async ngAfterViewInit(): Promise<void> {
    const myAPIKey = environment.geoapifyApiKey;
    const mapStyle = 'https://maps.geoapify.com/v1/styles/osm-carto/style.json';

    const mapInstance = await olms(
      this.mapContainer.nativeElement,
      `${mapStyle}?apiKey=${myAPIKey}`
    );

    this.map = mapInstance as Map;

    const view = new View({
      center: transform([2.3522, 48.8566], 'EPSG:4326', 'EPSG:3857'),
      zoom: 6,
    });

    this.map.setView(view);
    this.map.addControl(new FullScreen());

    const markerLayer = new VectorLayer({
      source: this.markerSource,
      zIndex: 999,
    });
    this.map.addLayer(markerLayer);

    this.map.once('rendercomplete', () => {
      this.mapReady = true;
    });

    this.map.render();
  }

  searchCity() {
    if (!this.city) return;
    this.mapService.searchCity(this.city).subscribe((data) => {
      if (data.features && data.features.length > 0) {
        this.selectCity(data.features[0]);
      }
    });
  }

  autocomplete() {
    if (this.city.length < 2) {
      this.suggestions = [];
      return;
    }
    this.mapService.searchCity(this.city).subscribe((data) => {
      this.suggestions = data.features || [];
    });
  }

  selectCity(place: any) {
    if (!place?.geometry?.coordinates) return;

    const lon = place.geometry.coordinates[0];
    const lat = place.geometry.coordinates[1];
    const coords = transform([lon, lat], 'EPSG:4326', 'EPSG:3857');

    this.city = place.properties.formatted;
    this.suggestions = [];

    if (!this.mapReady || !this.map) {
      setTimeout(() => this.centerMap(coords), 300);
      return;
    }

    this.centerMap(coords);
  }

  private centerMap(coords: number[]) {
    this.map.getView().setCenter(coords);
    this.map.getView().animate({
      center: coords,
      zoom: 12,
      duration: 800,
    });
    this.addMarker(coords);
  }

  addMarker(coords: number[]) {
    this.markerSource.clear();
    const marker = new Feature({
      geometry: new Point(coords),
    });
    marker.setStyle(
      new Style({
        image: new Icon({
          src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          scale: 0.05,
        }),
      })
    );
    this.markerSource.addFeature(marker);
  }

  locateUser() {
    this.loadingLocation = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = transform(
          [pos.coords.longitude, pos.coords.latitude],
          'EPSG:4326',
          'EPSG:3857'
        );
        this.map.getView().animate({
          center: coords,
          zoom: 13,
          duration: 1000,
        });
        this.addMarker(coords);
        this.loadingLocation = false;
      },
      () => {
        this.loadingLocation = false;
        alert("Impossible d'obtenir votre localisation");
      }
    );
  }
}