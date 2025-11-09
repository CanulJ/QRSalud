import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceso-denegado',
  imports: [],
  templateUrl: './acceso-denegado.html',
  styleUrl: './acceso-denegado.css',
})
export class AccesoDenegado {

  constructor( private router: Router,) {}

  irLogin(): void {
    this.router.navigate(['/login']);
  }


}
