import { Component, signal } from '@angular/core';
import { Header } from './header/header';
import { StationList } from './station-list/station-list';

@Component({
  imports: [Header, StationList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})

export class App {
  title = 'Gasly';
}