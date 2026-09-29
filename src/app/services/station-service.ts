import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from '../models/station';

@Service()
export class StationService {

  private http = inject(HttpClient);

  private apiUrl = 'https://overpass-api.de/api/interpreter';

  getStations(): Observable<unknown> {
    const query = `
      [out:json];
      node["amenity"="fuel"](14.4,120.8,14.8,121.2);
      out;
    `;

    return this.http.get(this.apiUrl, {
      params: {
        data: query
      }
    });
  }
}