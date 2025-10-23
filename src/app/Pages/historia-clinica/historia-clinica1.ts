import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { HistoriaClinica } from '../../Models/HistoriaClinica';
import { historiaClinicaService } from '../../Services/historia-clinica.service';
import { DatosMedicos } from '../../Models/DatosMedicos';
import { DatosMedicosService } from '../../Services/datos-medicos.service';
import { ForHistoriaC } from '../for-historia-c/for-historia-c';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.html',
  styleUrls: ['./historia-clinica.css'],
  imports: [CommonModule, MatBottomSheetModule]
})
export class HistoriaClinica1 {

  private bottomSheet = inject(MatBottomSheet);
  private historiaService = inject(historiaClinicaService);
  private datosMedicosService = inject(DatosMedicosService);

  usuario: any = null;
  datosMedicos: DatosMedicos | null = null;
  historiaClinica: HistoriaClinica[] = [];

  ngOnInit(): void {
    const usuarioData = sessionStorage.getItem('usuario');
    if (usuarioData) {
      this.usuario = JSON.parse(usuarioData);

      // Obtener datos médicos
      this.datosMedicosService.obtenerPorUsuario(this.usuario.id).subscribe({
        next: (datos) => {
          this.datosMedicos = datos.length > 0 ? datos[0] : null;
          if (this.datosMedicos) {
            this.cargarHistorial(); // cargar historial solo si hay datos médicos
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  cargarHistorial(): void {
  if (!this.datosMedicos) return;
  this.historiaService.obtenerPorDatosMedicos(this.datosMedicos.id_datos).subscribe({
    next: (historial) => {
      this.historiaClinica = historial;
      // Guardar el más reciente en sessionStorage para AntecedentesH
      if (historial.length > 0) {
        const ultimaHistoria = historial[historial.length - 1];
        sessionStorage.setItem('historiaClinicaId', String(ultimaHistoria.idhistoria));
      }
    },
    error: (err) => console.error(err)
  });
}


  agregarHistoria(): void {
    if (!this.datosMedicos) return; // seguridad

    const sheetRef = this.bottomSheet.open(ForHistoriaC, {
      data: { datosmedicosid: this.datosMedicos.id_datos },
      panelClass: 'custom-bottom-sheet'
    });

    sheetRef.afterDismissed().subscribe((nuevoRegistro: HistoriaClinica) => {
      if (nuevoRegistro) {
        // Guardar en la DB
        this.historiaService.crear(nuevoRegistro).subscribe({
          next: (res) => {
            this.historiaClinica.push(res); // actualizar tabla automáticamente
          },
          error: (err) => console.error('Error al crear historial', err)
        });
      }
    });
  }
}
