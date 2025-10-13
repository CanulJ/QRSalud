import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatosMedicosService } from '../../Services/datos-medicos.service';

import { DatosMedicos } from '../../Models/DatosMedicos';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class Inicio implements OnInit {

  usuario: any = null;
  datosMedicos: DatosMedicos | null = null;

  private router = inject(Router);
  private datosMedicosService = inject(DatosMedicosService);

  ngOnInit(): void {
  const usuarioData = sessionStorage.getItem('usuario');
  if (usuarioData) {
    this.usuario = JSON.parse(usuarioData);

    const userId = this.usuario.id; // <--- usar 'id', que es lo que realmente tienes
    if (!userId) {
      console.error('No se encontró un ID válido para el usuario', this.usuario);
      return;
    }

    this.datosMedicosService.obtenerPorUsuario(userId).subscribe({
      next: (datos) => {
        this.datosMedicos = datos.length > 0 ? datos[0] : null;
      },
      error: (err) => console.error('Error al obtener datos médicos', err)
    });
  }
}



  editarPerfil(): void {
    this.router.navigate(['/registro']);
  }

  agregarDatosMedicos(): void {
    this.router.navigate(['/registro']);
  }
}
