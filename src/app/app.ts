import { Component, signal } from '@angular/core';
import { Header } from './header/header';
import { StationList } from './station-list/station-list';
import { Map } from './map/map';

@Component({
  imports: [Header, StationList, Map],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})

export class App {
  title = 'Gasly';
}