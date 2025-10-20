import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { DatosMedicosService } from '../../Services/datos-medicos.service';
import { DatosMedicos } from '../../Models/DatosMedicos';
import { DatosMedicos1 } from '../datos-medicos/datos-medicos1';
import { HistoriaClinica1 } from '../historia-clinica/historia-clinica1';
import { historiaClinicaService } from '../../Services/historia-clinica.service';
import { Navegacion } from '../navegacion/navegacion';



@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, MatBottomSheetModule, Navegacion],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class Inicio implements OnInit {

  usuario: any = null;
  datosMedicos: DatosMedicos | null = null;

  private router = inject(Router);
  private datosMedicosService = inject(DatosMedicosService);
  private bottomSheet = inject(MatBottomSheet);
  private historiaClinicaService = inject(historiaClinicaService);

  ngOnInit(): void {
    const usuarioData = sessionStorage.getItem('usuario');
    if (usuarioData) {
      this.usuario = JSON.parse(usuarioData);

      const userId = this.usuario.id;
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
}
