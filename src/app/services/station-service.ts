import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

import { OverpassResponse } from '../models/overpass-response';
import { Station } from '../models/station';

@Service()
export class StationService {

  private http = inject(HttpClient);

  private apiUrls = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter'
  ];

  getStations(): Observable<Station[]> {
    return this.requestFrom(0);
  }

  private requestFrom(index: number): Observable<Station[]> {
    const query = `
      [out:json][timeout:25];
      node["amenity"="fuel"](14.4,120.8,14.8,121.2);
      out;
    `;

    return this.http.get<OverpassResponse>(this.apiUrls[index], {
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
      ),
      catchError(error => {
        const next = index + 1;
        if (next < this.apiUrls.length) {
          console.warn(`Overpass server ${index} failed, trying server ${next}`, error);
          return this.requestFrom(next);
        }
        return throwError(() => error);
      })
    );
  }
}