import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './Pages/loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('QRT');
}
