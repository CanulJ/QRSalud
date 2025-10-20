import { Component, inject } from '@angular/core';
import { DatosMedicos } from '../../Models/DatosMedicos';
import { Router } from '@angular/router';
import { DatosMedicosService } from '../../Services/datos-medicos.service';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { historiaClinicaService } from '../../Services/historia-clinica.service';
import { DatosMedicos1 } from '../datos-medicos/datos-medicos1';
import { HistoriaClinica1 } from '../historia-clinica/historia-clinica1';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-medica',
  imports: [CommonModule, MatBottomSheetModule],
  templateUrl: './tabla-medica.html',
  styleUrl: './tabla-medica.css'
})
export class TablaMedica {

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

    this.datosMedicosService.obtenerPorUsuario(this.usuario.id).subscribe({
      next: (datos) => this.datosMedicos = datos.length > 0 ? datos[0] : null,
      error: (err) => console.error(err)
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
}

openBottomSheetHistoriaClinica(): void {
  const sheetRef = this.bottomSheet.open(HistoriaClinica1, {
    data: { datosMedicosId: this.datosMedicos?.id_datos },
    panelClass: 'custom-bottom-sheet'
  });

  sheetRef.afterDismissed().subscribe((result: any) => {
    if (result) {
      // Aquí puedes llamar a tu servicio para crear o actualizar historial clínico
      this.historiaClinicaService.crear(result).subscribe({
        next: (res) => console.log('Historial creado', res),
        error: (err) => console.error('Error al crear historial', err)
      });
    }
  });
}


}
