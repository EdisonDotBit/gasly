import { AfterViewInit, Component, inject } from '@angular/core';
import * as L from 'leaflet';

import { StationService } from '../services/station-service';
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png'
});

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css'
})

export class Map implements AfterViewInit {

  private stationService = inject(StationService);

  ngAfterViewInit(): void {
    const map = L.map('map').setView([14.5995, 120.9842], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    this.stationService.getStations().subscribe({ 
      next: data => {
        data.forEach(station => {
          L.marker([station.latitude, station.longitude])
            .addTo(map)
            .bindPopup(station.name);
        });
      },
      error: error => {
        console.error('Failed to load stations:', error);
      }
    });
  }
}