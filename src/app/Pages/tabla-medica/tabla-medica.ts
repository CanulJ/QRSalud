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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmacionContrasena } from '../confirmacion-contrasena/confirmacion-contrasena';

@Component({
  selector: 'app-tabla-medica',
  standalone: true,
  imports: [
    CommonModule, MatBottomSheetModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule
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
  private dialog = inject(MatDialog);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const usuarioData = sessionStorage.getItem('usuario');
      if (usuarioData) {
        this.usuario = JSON.parse(usuarioData);

        this.datosMedicosService.obtenerPorUsuario(this.usuario.id).subscribe({
          next: (datos) => this.datosMedicos = datos.length > 0 ? datos[0] : null,
          error: (err) => console.error(err)
        });
      }
    }
  }

  // 🔐 Verifica contraseña solo una vez por sesión
  private async verificarContrasenaSiEsNecesario(): Promise<boolean> {
    const yaConfirmo = sessionStorage.getItem('contrasena_confirmada');

    if (yaConfirmo === 'true') return true;

    const dialogRef = this.dialog.open(ConfirmacionContrasena, {
      data: { correo: this.usuario.correo }
    });

    const resultado = await dialogRef.afterClosed().toPromise();

    if (resultado === true) {
      sessionStorage.setItem('contrasena_confirmada', 'true');
      return true;
    }

    return false;
  }

  // 🟢 Abrir bottom sheet de Datos Médicos
  async openBottomSheet(): Promise<void> {
    const ok = await this.verificarContrasenaSiEsNecesario();
    if (!ok) return;

    const sheetRef = this.bottomSheet.open(DatosMedicos1, {
      data: this.datosMedicos,
      panelClass: 'custom-bottom-sheet'
    });

    sheetRef.afterDismissed().subscribe((result: any) => {
      if (!result) return;

      const id = this.datosMedicos?.id_datos;
      if (id) {
        this.datosMedicosService.actualizar(id, result).subscribe({
          next: (updated) => this.datosMedicos = updated,
          error: (err) => console.error('Error al actualizar datos médicos', err)
        });
      } else {
        const datosConUsuario = { ...result, id_usuario: this.usuario.id };
        this.datosMedicosService.crear(datosConUsuario).subscribe({
          next: (created) => this.datosMedicos = created,
          error: (err) => console.error('Error al crear datos médicos', err)
        });
      }
    });
  }

  // 🟣 Abrir bottom sheet de Historia Clínica
  async openBottomSheetHistoriaClinica(): Promise<void> {
    const ok = await this.verificarContrasenaSiEsNecesario();
    if (!ok) return;

    const sheetRef = this.bottomSheet.open(HistoriaClinica1, {
      data: { datosMedicosId: this.datosMedicos?.id_datos },
      panelClass: 'custom-bottom-sheet'
    });

    sheetRef.afterDismissed().subscribe((result: any) => {
      if (!result) return;

      this.historiaClinicaService.crear(result).subscribe({
        next: (res) => console.log('Historial creado', res),
        error: (err) => console.error('Error al crear historial', err)
      });
    });
  }
}
