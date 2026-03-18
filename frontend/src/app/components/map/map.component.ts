import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Map from 'ol/Map';
import View from 'ol/View';
import FullScreen from 'ol/control/FullScreen';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { Coordinate } from 'ol/coordinate';
import olms from 'ol-mapbox-style';
import { transform } from 'ol/proj';
import { MapService } from '../../services/map.service';
import { environment } from '../../../environments/environment';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  CITY_ZOOM,
  USER_ZOOM,
  MAP_ANIMATION_DURATION,
  USER_ANIMATION_DURATION,
  WEATHER_LAYER_TYPES,
  RAIN_DROP_COUNT,
  RAIN_SPEED_MIN,
  RAIN_SPEED_RANGE,
  RAIN_LENGTH_MIN,
  RAIN_LENGTH_RANGE,
  RAIN_OPACITY_MIN,
  RAIN_OPACITY_RANGE,
  RAIN_LINE_WIDTH,
  RAIN_CANVAS_DELAY_MS,
  RAIN_DIAGONAL,
  MARKER_SCALE,
  MARKER_ICON_URL,
  AUTOCOMPLETE_MIN_LENGTH,
} from './map.constants';
import {
  WeatherLayerType,
  RainDrop,
  GeoapifyFeature,
  GeoapifyResponse,
} from './map.types';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnDestroy {

  // #region ViewChild
  @ViewChild('map', { static: true }) private readonly mapContainer!: ElementRef<HTMLElement>;
  @ViewChild('rainCanvas') private readonly rainCanvasRef!: ElementRef<HTMLCanvasElement>;
  // #endregion

  // #region Public state
  map: Map | undefined;
  city = '';
  suggestions: GeoapifyFeature[] = [];
  loadingLocation = false;
  isLoadingReverse = false;
  selectedCity: string | null = null;
  selectedLat: number | null = null;
  selectedLon: number | null = null;
  activeWeatherLayer: WeatherLayerType | null = null;
  showRainCanvas = false;
  geoError: string | null = null;
  searchError: string | null = null;
  // #endregion

  // #region Private state
  private readonly mapService = inject(MapService);
  private readonly markerSource = new VectorSource();
  private weatherLayers: Partial<Record<WeatherLayerType, TileLayer<XYZ>>> = {};
  private mapReady = false;
  private rainAnimationId: number | null = null;
  private rainDrops: RainDrop[] = [];
  private resizeHandler: (() => void) | null = null;
  // #endregion

  // #region Lifecycle
  async ngAfterViewInit(): Promise<void> {
    await this.initMap();
    this.initControls();
    this.initWeatherLayers();
    this.initEventListeners();
  }

  ngOnDestroy(): void {
    this.stopRain();
  }
  // #endregion

  // #region Map initialisation

  /** Bootstraps the OL map instance via ol-mapbox-style. Sets the default view on success. */
  private async initMap(): Promise<void> {
    const mapStyle = 'https://maps.geoapify.com/v1/styles/osm-carto/style.json';
    try {
      const mapInstance = await olms(
        this.mapContainer.nativeElement,
        `${mapStyle}?apiKey=${environment.geoapifyApiKey}`
      );
      this.map = mapInstance as Map;
      this.map.setView(new View({
        center: transform(DEFAULT_CENTER, 'EPSG:4326', 'EPSG:3857'),
        zoom: DEFAULT_ZOOM,
      }));
    } catch {
      this.searchError = 'Impossible de charger la carte. Veuillez recharger la page.';
    }
  }

  /** Adds the fullscreen control and the marker vector layer to the map. */
  private initControls(): void {
    if (!this.map) return;
    this.map.addControl(new FullScreen());
    this.map.addLayer(new VectorLayer({ source: this.markerSource, zIndex: 999 }));
  }

  /** Registers click and render-complete listeners, then triggers an initial render. */
  private initEventListeners(): void {
    if (!this.map) return;
    this.map.on('click', (event) => this.handleMapClick(event as MapBrowserEvent<PointerEvent>));
    this.map.once('rendercomplete', () => { this.mapReady = true; });
    this.map.render();
  }
  // #endregion

  // #region Weather layers

  /** Creates all OWM tile layers and adds them to the map, hidden by default. */
  private initWeatherLayers(): void {
    if (!this.map) return;

    WEATHER_LAYER_TYPES.forEach(type => {
      const layer = new TileLayer({
        source: new XYZ({
          url: `https://tile.openweathermap.org/map/${type}/{z}/{x}/{y}.png?appid=${environment.owmApiKey}`,
          crossOrigin: 'anonymous',
        }),
        opacity: 0.85,
        visible: false,
        zIndex: 100,
      });
      this.weatherLayers[type] = layer;
      this.map!.addLayer(layer);
    });
  }

  /**
   * Activates the given weather layer and deactivates all others.
   * Passing null or the currently active type resets to "none".
   */
  toggleWeatherLayer(type: WeatherLayerType | null): void {
    WEATHER_LAYER_TYPES.forEach(t => this.weatherLayers[t]?.setVisible(false));
    this.stopRain();

    if (type === null || this.activeWeatherLayer === type) {
      this.activeWeatherLayer = null;
      return;
    }

    this.weatherLayers[type]?.setVisible(true);
    this.activeWeatherLayer = type;

    if (type === 'precipitation_new') {
      this.showRainCanvas = true;
      setTimeout(() => this.initRain(), RAIN_CANVAS_DELAY_MS);
    }
  }
  // #endregion

  // #region Rain animation

  /** Initialises drop positions and starts the canvas rain animation loop. */
  private initRain(): void {
    const canvas = this.rainCanvasRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = (): void => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      this.rainDrops = Array.from({ length: RAIN_DROP_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: RAIN_SPEED_MIN + Math.random() * RAIN_SPEED_RANGE,
        length: RAIN_LENGTH_MIN + Math.random() * RAIN_LENGTH_RANGE,
        opacity: RAIN_OPACITY_MIN + Math.random() * RAIN_OPACITY_RANGE,
      }));
    };

    this.resizeHandler = resize;
    window.addEventListener('resize', this.resizeHandler);
    resize();

    const animate = (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.rainDrops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - RAIN_DIAGONAL, drop.y + drop.length);
        ctx.strokeStyle = `rgba(174, 214, 241, ${drop.opacity})`;
        ctx.lineWidth = RAIN_LINE_WIDTH;
        ctx.stroke();

        drop.y += drop.speed;
        drop.x -= RAIN_DIAGONAL;

        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });

      this.rainAnimationId = requestAnimationFrame(animate);
    };

    animate();
  }

  /** Cancels the animation loop, removes the resize listener and hides the canvas. */
  private stopRain(): void {
    if (this.rainAnimationId !== null) {
      cancelAnimationFrame(this.rainAnimationId);
      this.rainAnimationId = null;
    }

    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }

    this.showRainCanvas = false;

    const canvas = this.rainCanvasRef?.nativeElement;
    if (canvas) {
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  // #endregion

  // #region Map interactions

  /** Places a marker at the clicked position and reverse geocodes the coordinates. */
  private handleMapClick(event: MapBrowserEvent<PointerEvent>): void {
    const [lon, lat] = transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');

    this.addMarker(event.coordinate);
    this.selectedLat = parseFloat(lat.toFixed(5));
    this.selectedLon = parseFloat(lon.toFixed(5));
    this.selectedCity = null;
    this.isLoadingReverse = true;

    this.mapService.reverseGeocode(lat, lon).subscribe({
      next: (data: GeoapifyResponse) => {
        this.isLoadingReverse = false;
        if (data.features?.length > 0) {
          const place = data.features[0];
          this.selectedCity = place.properties.formatted;
          this.city = place.properties.city ?? place.properties.formatted;
        }
        else {
          this.city = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
        }
      },
      error: () => {
        this.isLoadingReverse = false;
        this.city = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
      }
    });
  }

  /** Animates the map view to the given EPSG:3857 coordinates and places a marker. */
  private centerMap(coords: Coordinate): void {
    this.map?.getView().setCenter(coords);
    this.map?.getView().animate({ center: coords, zoom: CITY_ZOOM, duration: MAP_ANIMATION_DURATION });
    this.addMarker(coords);
  }

  /** Clears existing markers and places a new one at the given EPSG:3857 coordinates. */
  private addMarker(coords: Coordinate): void {
    this.markerSource.clear();
    const marker = new Feature({ geometry: new Point(coords) });
    marker.setStyle(new Style({
      image: new Icon({ src: MARKER_ICON_URL, scale: MARKER_SCALE }),
    }));
    this.markerSource.addFeature(marker);
  }
  // #endregion

  // #region Search & geolocation

  /** Searches for the current city input and centers the map on the first result. */
  searchCity(): void {
    if (!this.city) return;
    this.searchError = null;

    this.mapService.searchCity(this.city).subscribe({
      next: (data: GeoapifyResponse) => {
        if (data.features?.length > 0) this.selectCity(data.features[0]);
      },
      error: () => {
        this.searchError = 'La recherche a échoué. Veuillez réessayer.';
      }
    });
  }

  /** Fetches autocomplete suggestions for the current city input value. */
  autocomplete(): void {
    this.searchError = null;

    if (this.city.length < AUTOCOMPLETE_MIN_LENGTH) {
      this.suggestions = [];
      return;
    }

    this.mapService.searchCity(this.city).subscribe({
      next: (data: GeoapifyResponse) => {
        this.suggestions = data.features ?? [];
      },
      error: () => {
        this.suggestions = [];
      }
    });
  }

  /** Centers the map on the selected place and updates the location info panel. */
  selectCity(place: GeoapifyFeature): void {
    if (!place?.geometry?.coordinates) return;

    const [lon, lat] = place.geometry.coordinates;
    const coords = transform([lon, lat], 'EPSG:4326', 'EPSG:3857');

    this.city = place.properties.city ?? place.properties.formatted;
    this.suggestions = [];
    this.selectedCity = place.properties.formatted;
    this.selectedLat = parseFloat(lat.toFixed(5));
    this.selectedLon = parseFloat(lon.toFixed(5));
    this.searchError = null;

    if (!this.mapReady || !this.map) {
      setTimeout(() => this.centerMap(coords), MAP_ANIMATION_DURATION);
    } else {
      this.centerMap(coords);
    }
  }

  /** Requests the user's geolocation and centers the map on their position. */
  locateUser(): void {
    this.loadingLocation = true;
    this.geoError = null;
    navigator.geolocation.getCurrentPosition(
      (position) => this.onGeolocationSuccess(position),
      () => this.onGeolocationError()
    );
  }

  /** Handles a successful geolocation response. */
  private onGeolocationSuccess(position: GeolocationPosition): void {
    const { latitude: lat, longitude: lon } = position.coords;
    const coords = transform([lon, lat], 'EPSG:4326', 'EPSG:3857');

    this.map?.getView().animate({ center: coords, zoom: USER_ZOOM, duration: USER_ANIMATION_DURATION });
    this.addMarker(coords);
    this.loadingLocation = false;
    this.selectedLat = parseFloat(lat.toFixed(5));
    this.selectedLon = parseFloat(lon.toFixed(5));
    this.isLoadingReverse = true;

    this.mapService.reverseGeocode(lat, lon).subscribe({
      next: (data: GeoapifyResponse) => {
        this.isLoadingReverse = false;
        if (data.features?.length > 0) {
          this.selectedCity = data.features[0].properties.formatted;
          this.city = data.features[0].properties.city ?? this.selectedCity;
        }
      },
      error: () => { this.isLoadingReverse = false; }
    });
  }

  /** Handles a geolocation error by displaying a message in the template. */
  private onGeolocationError(): void {
    this.loadingLocation = false;
    this.geoError = "Impossible d'obtenir votre localisation. Vérifiez les permissions de votre navigateur.";
  }

  /** Resets all selection state, clears the marker and stops the rain animation. */
  clearSelection(): void {
    this.city = '';
    this.selectedCity = null;
    this.selectedLat = null;
    this.selectedLon = null;
    this.searchError = null;
    this.geoError = null;
    this.markerSource.clear();
    this.stopRain();
  }
  // #endregion
}