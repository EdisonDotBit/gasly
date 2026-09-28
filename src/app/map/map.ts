import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { Station } from '../models/station';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css'
})

export class Map implements AfterViewInit {
  station: Station = {
    id: 1,
    name: 'Shell',
    latitude: 14.5995,
    longitude: 120.9842,
    address: 'Manila'
  };

  ngAfterViewInit(): void {
    const map = L.map('map').setView(
      [this.station.latitude, this.station.longitude],
      12
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([
      this.station.latitude,
      this.station.longitude
    ])
      .addTo(map)
      .bindPopup(this.station.name);
  }
}