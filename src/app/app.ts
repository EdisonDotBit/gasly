import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  title = "Gasly";

  changeTitle() {
    this.title = "Gasly - Gas prices in the Philippines";
  }
}
