import { AfterViewInit, Component, DestroyRef, OnDestroy, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as L from 'leaflet';
import { Station } from '../models/station';
import { StationList } from '../station-list/station-list';

import { StationService } from '../services/station-service';
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png'
});

@Component({
  selector: 'app-map',
  imports: [StationList],
  templateUrl: './map.html',
  styleUrl: './map.css'
})

export class Map implements AfterViewInit, OnDestroy {

  private stationService = inject(StationService);
  private destroyRef = inject(DestroyRef);

  private map?: L.Map;
  private markerLayer = L.layerGroup();

  stations = signal<Station[]>([]);

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([14.5995, 120.9842], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.markerLayer.addTo(this.map);

    this.loadStations();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  loadStations(): void {
    this.stationService.getStations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          const validStations = data.filter(station =>
            Number.isFinite(station.latitude) && Number.isFinite(station.longitude)
          );

          this.stations.set(validStations);
          this.renderMarkers(validStations);
        },
        error: error => {
          console.error('Failed to load stations:', error);
        }
      });
  }

  private renderMarkers(stations: Station[]): void {
    this.markerLayer.clearLayers();

    stations.forEach(station => {
      L.marker([station.latitude, station.longitude])
        .bindPopup(this.createPopupContent(station))
        .addTo(this.markerLayer);
    });
  }

  private createPopupContent(station: Station): HTMLElement {
    const container = document.createElement('div');

    const title = document.createElement('strong');
    title.textContent = station.name;
    container.appendChild(title);

    if (station.address) {
      const address = document.createElement('div');
      address.textContent = station.address;
      container.appendChild(address);
    }

    const coordinates = document.createElement('div');
    coordinates.textContent = `Latitude: ${station.latitude}, Longitude: ${station.longitude}`;
    container.appendChild(coordinates);

    return container;
  }
}