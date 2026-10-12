import { Component, input } from '@angular/core';
import { Station } from '../models/station';

@Component({
  imports: [],
  selector: 'app-station-list',
  styleUrl: './station-list.css',
  templateUrl: './station-list.html',
})
export class StationList {
  stations = input<Station[]>([]);
}