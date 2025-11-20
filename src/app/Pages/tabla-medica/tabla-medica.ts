import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DatosMedicos } from '../../Models/DatosMedicos';
import { Router } from '@angular/router';
import { DatosMedicosService } from '../../Services/datos-medicos.service';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { historiaClinicaService } from '../../Services/historia-clinica.service';
import { DatosMedicos1 } from '../datos-medicos/datos-medicos1';
import { HistoriaClinica1 } from '../historia-clinica/historia-clinica1';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-tabla-medica',
  standalone: true,
  imports: [
    CommonModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './tabla-medica.html',
  styleUrls: ['./tabla-medica.css']
})
export class TablaMedica implements OnInit {

  usuario: any = null;
  datosMedicos: DatosMedicos | null = null;

  private router = inject(Router);
  private datosMedicosService = inject(DatosMedicosService);
  private bottomSheet = inject(MatBottomSheet);
  private historiaClinicaService = inject(historiaClinicaService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {

    // 🔹 Solo se ejecuta en navegador (evita errores en SSR)
    if (isPlatformBrowser(this.platformId)) {

      // 🔹 Recuperamos el usuario guardado del login / token
      const usuarioData = sessionStorage.getItem('usuario');

      if (!usuarioData) {
        console.warn('No hay usuario en sessionStorage, regresando al inicio.');
        this.router.navigate(['/']);
        return;
      }

      this.usuario = JSON.parse(usuarioData);

      // 🔹 Cargar datos médicos desde la API
      this.datosMedicosService.obtenerPorUsuario(this.usuario.id).subscribe({
        next: (datos) => {
          this.datosMedicos = datos.length > 0 ? datos[0] : null;
        },
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
      if (!result) return;

      const id = this.datosMedicos?.id_datos;

      if (id) {
        // 🔹 ACTUALIZAR datos ya existentes
        this.datosMedicosService.actualizar(id, result).subscribe({
          next: (updated) => this.datosMedicos = updated,
          error: (err) =>
            console.error('Error al actualizar datos médicos', err)
        });
      } else {
        // 🔹 CREAR nuevos datos médicos
        const datosConUsuario = { ...result, id_usuario: this.usuario.id };
        this.datosMedicosService.crear(datosConUsuario).subscribe({
          next: (created) => this.datosMedicos = created,
          error: (err) =>
            console.error('Error al crear datos médicos', err)
        });
      }
    });
  }

  openBottomSheetHistoriaClinica(): void {
    const sheetRef = this.bottomSheet.open(HistoriaClinica1, {
      data: { datosMedicosId: this.datosMedicos?.id_datos },
      panelClass: 'custom-bottom-sheet'
    });

    sheetRef.afterDismissed().subscribe((result: any) => {
      if (!result) return;

      this.historiaClinicaService.crear(result).subscribe({
        next: (res) => console.log('Historial creado', res),
        error: (err) =>
          console.error('Error al crear historial', err)
      });
    });
  }
}
