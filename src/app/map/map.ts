import { AfterViewInit, Component, inject, signal } from '@angular/core';
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

export class Map implements AfterViewInit {

  private stationService = inject(StationService);

  stations = signal<Station[]>([]);

  ngAfterViewInit(): void {
    const map = L.map('map').setView([14.5995, 120.9842], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    this.stationService.getStations().subscribe({ 
      next: data => {
        this.stations.set(data);

        data.forEach(station => {
          L.marker([station.latitude, station.longitude])
            .addTo(map)
            .bindPopup(`
              <strong>${station.name}</strong>
              <br>
              Latitude: ${station.latitude}
              <br>
              Longitude: ${station.longitude}
            `);
        });
      },
      error: error => {
        console.error('Failed to load stations:', error);
      }
    });
  }
}