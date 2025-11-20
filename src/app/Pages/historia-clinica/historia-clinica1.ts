import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { HistoriaClinica } from '../../Models/HistoriaClinica';
import { historiaClinicaService } from '../../Services/historia-clinica.service';
import { DatosMedicos } from '../../Models/DatosMedicos';
import { DatosMedicosService } from '../../Services/datos-medicos.service';
import { ForHistoriaC } from '../for-historia-c/for-historia-c';
import { ConfirmacionContrasena } from '../confirmacion-contrasena/confirmacion-contrasena';

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
  private dialog = inject(MatDialog);

  usuario: any = null;
  datosMedicos: DatosMedicos | null = null;
  historiaClinica: HistoriaClinica[] = [];

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    const usuarioData = sessionStorage.getItem('usuario');
    if (usuarioData) {
      this.usuario = JSON.parse(usuarioData);

      this.datosMedicosService.obtenerPorUsuario(this.usuario.id).subscribe({
        next: (datos) => {
          this.datosMedicos = datos.length > 0 ? datos[0] : null;
          if (this.datosMedicos) {
            this.cargarHistorial();
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  // 🔐 Igual que en TablaMedica: solo pide contraseña una vez por sesión
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

  cargarHistorial(): void {
    if (!this.datosMedicos || !this.isBrowser) return;

    this.historiaService.obtenerPorDatosMedicos(this.datosMedicos.id_datos).subscribe({
      next: (historial) => {
        this.historiaClinica = historial;

        if (historial.length > 0) {
          const ultimaHistoria = historial[historial.length - 1];
          sessionStorage.setItem('historiaClinicaId', String(ultimaHistoria.idhistoria));
        }
      },
      error: (err) => console.error(err)
    });
  }

  // 🟣 Abrir formulario de nueva historia clínica con validación de contraseña
  async agregarHistoria(): Promise<void> {
    if (!this.datosMedicos || !this.isBrowser) return;

    const ok = await this.verificarContrasenaSiEsNecesario();
    if (!ok) return;

    const sheetRef = this.bottomSheet.open(ForHistoriaC, {
      data: { datosmedicosid: this.datosMedicos.id_datos },
      panelClass: 'custom-bottom-sheet'
    });

    sheetRef.afterDismissed().subscribe((nuevoRegistro: HistoriaClinica) => {
      if (nuevoRegistro) {
        this.historiaService.crear(nuevoRegistro).subscribe({
          next: (res) => this.historiaClinica.push(res),
          error: (err) => console.error('Error al crear historial', err)
        });
      }
    });
  }
}
