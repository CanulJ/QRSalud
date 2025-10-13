import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { DatosMedicosService } from '../../Services/datos-medicos.service';
import { DatosMedicos } from '../../Models/DatosMedicos';
import { DatosMedicos1 } from '../datos-medicos/datos-medicos1';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, MatBottomSheetModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class Inicio implements OnInit {

  usuario: any = null;
  datosMedicos: DatosMedicos | null = null;

  private router = inject(Router);
  private datosMedicosService = inject(DatosMedicosService);
  private bottomSheet = inject(MatBottomSheet);

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

  openBottomSheet(): void {
  const sheetRef = this.bottomSheet.open(DatosMedicos1, {
    data: this.datosMedicos,
    panelClass: 'custom-bottom-sheet'
  });

  sheetRef.afterDismissed().subscribe((result: any) => {
  if (result) {
    const id = this.datosMedicos?.id_datos; // tu ID del registro
    if (id) {
      // Actualizar
      this.datosMedicosService.actualizar(id, result).subscribe({
        next: (updated) => {
          console.log('Datos médicos actualizados', updated);
          this.datosMedicos = updated;
        },
        error: (err) => console.error('Error al actualizar datos médicos', err)
      });
    } else {
      // Crear nuevo registro
      const datosConUsuario = { ...result, id_usuario: this.usuario.id }; // <-- importante
      this.datosMedicosService.crear(datosConUsuario).subscribe({
        next: (created) => {
          console.log('Datos médicos creados', created);
          this.datosMedicos = created; // actualizar vista
        },
        error: (err) => console.error('Error al crear datos médicos', err)
      });
    }
  }
});


}}
