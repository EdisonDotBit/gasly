import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service()
export class StationService {
    private http = inject(HttpClient);
}