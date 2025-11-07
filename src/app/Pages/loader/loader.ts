import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../Services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrls: ['./loader.css'],
})
export class LoaderComponent {
  loading$; // declaras la variable sin inicializar

  constructor(private loaderService: LoaderService) {
    this.loading$ = this.loaderService.loading$; // la inicializas ya con el servicio disponible
  }
}
