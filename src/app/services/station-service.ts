import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { OverpassResponse } from '../models/overpass-response';
import { Station } from '../models/station';

@Service()
export class StationService {

  private http = inject(HttpClient);

  private apiUrl = 'https://overpass-api.de/api/interpreter';

  getStations(): Observable<Station[]> {
    const query = `
      [out:json];
      node["amenity"="fuel"](14.4,120.8,14.8,121.2);
      out;
    `;

    return this.http.get<OverpassResponse>(this.apiUrl, {
      params: {
        data: query
      }
    }).pipe(
      map(response =>   
        response.elements.map(element => ({
          id: element.id,
          name: element.tags?.name ?? 'Unnamed Station',
          latitude: element.lat,
          longitude: element.lon,
          address: ''
        }))
      )
    );
  }
}