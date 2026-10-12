import { Component, signal } from '@angular/core';
import { Header } from './header/header';
import { Map } from './map/map';

@Component({
  imports: [Header, Map],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})

export class App {
  title = 'Gasly';
}