import { Component, inject, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Antecedentes } from '../../Models/Antecedentes';
import { antecedentesService } from '../../Services/antecedentesM.service';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { ForAntecedentesC } from '../for-antecedentes-c/for-antecedentes-c';
import { HistoriaClinica } from '../../Models/HistoriaClinica';
import { historiaClinicaService } from '../../Services/historia-clinica.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmacionContrasena } from '../confirmacion-contrasena/confirmacion-contrasena';

@Component({
  selector: 'app-antecedentes-h',
  standalone: true,
  imports: [
    CommonModule, MatBottomSheetModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule
  ],
  templateUrl: './antecedentes-h.html',
  styleUrls: ['./antecedentes-h.css']
})
export class AntecedentesH implements OnInit {

  antecedentes: Antecedentes | null = null;
  idHistoriaClinica: number | null = null;

  private antecedentesService = inject(antecedentesService);
  private bottomSheet = inject(MatBottomSheet);
  private historiaService = inject(historiaClinicaService);
  private dialog = inject(MatDialog);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const usuarioData = sessionStorage.getItem('usuario');
    if (!usuarioData) {
      console.error('No hay usuario logueado');
      return;
    }

    const usuario = JSON.parse(usuarioData);

    this.antecedentesService.obtenerPorUsuario(usuario.id).subscribe({
      next: (antecedentes: Antecedentes[]) => {
        if (antecedentes.length > 0) this.antecedentes = antecedentes[0];

        this.historiaService.obtenerPorUsuario(usuario.id).subscribe({
          next: (historias: HistoriaClinica[]) => {
            if (historias.length > 0) {
              historias.sort((a, b) =>
                new Date(b.fecharegistro).getTime() -
                new Date(a.fecharegistro).getTime()
              );

              this.idHistoriaClinica = historias[0].idhistoria;
              sessionStorage.setItem('historiaClinicaId', String(this.idHistoriaClinica));
            }
          },
          error: (err) =>
            console.error('Error al obtener historia clínica', err)
        });
      },
      error: (err) =>
        console.error('Error al obtener antecedentes del usuario', err)
    });
  }

  // 🔐 Igual que los otros módulos: pedir contraseña solo una vez
  private async verificarContrasenaSiEsNecesario(): Promise<boolean> {
    const yaConfirmo = sessionStorage.getItem('contrasena_confirmada');

    if (yaConfirmo === 'true') return true;

    const usuarioData = sessionStorage.getItem('usuario');
    if (!usuarioData) return false;

    const usuario = JSON.parse(usuarioData);

    const dialogRef = this.dialog.open(ConfirmacionContrasena, {
      data: { correo: usuario.correo }
    });

    const resultado = await dialogRef.afterClosed().toPromise();

    if (resultado === true) {
      sessionStorage.setItem('contrasena_confirmada', 'true');
      return true;
    }

    return false;
  }

  // 🟣 Abrir bottom sheet de antecedentes con validación
  async openBottomSheet(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.idHistoriaClinica) {
      console.error('No hay historia clínica disponible');
      return;
    }

    const ok = await this.verificarContrasenaSiEsNecesario();
    if (!ok) return;

    const sheetRef = this.bottomSheet.open(ForAntecedentesC, {
      data: { ...this.antecedentes, id_historia: this.idHistoriaClinica },
      panelClass: 'custom-bottom-sheet'
    });

    sheetRef.afterDismissed().subscribe((result: any) => {
      if (!result) return;

      if (this.antecedentes?.id_antecedente) {
        this.antecedentesService.actualizar(this.antecedentes.id_antecedente, result).subscribe({
          next: (updated) => this.antecedentes = updated,
          error: (err) => console.error('Error al actualizar antecedentes', err)
        });
      } else {
        const datosConHistoria = {
          ...result,
          historia: { idhistoria: this.idHistoriaClinica }
        };

        this.antecedentesService.crear(datosConHistoria).subscribe({
          next: (created) => this.antecedentes = created,
          error: (err) => console.error('Error al crear antecedentes', err)
        });
      }
    });
  }
}
