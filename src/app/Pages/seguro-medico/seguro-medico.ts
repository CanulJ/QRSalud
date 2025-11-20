import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { SeguroMedico } from '../../Models/SeguroMedicoM';
import { SeguroMedicosService } from '../../Services/seguro-medico.service';
import { DatosMedicosService } from '../../Services/datos-medicos.service';
import { SeguroMedicoFor } from '../seguro-medico-for/seguro-medico-for';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmacionContrasena } from '../confirmacion-contrasena/confirmacion-contrasena';

@Component({
  selector: 'app-seguro-medico',
  standalone: true,
  imports: [
    CommonModule, MatBottomSheetModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule
  ],
  templateUrl: './seguro-medico.html',
  styleUrls: ['./seguro-medico.css']
})
export class SeguroMedicoComponent implements OnInit {

  usuario: any = null;
  seguros: SeguroMedico[] = [];

  private seguroService = inject(SeguroMedicosService);
  private datosMedicosService = inject(DatosMedicosService);
  private bottomSheet = inject(MatBottomSheet);
  private dialog = inject(MatDialog);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const usuarioData = sessionStorage.getItem('usuario');
      if (usuarioData) {
        this.usuario = JSON.parse(usuarioData);
        this.cargarSeguros();
      }
    }
  }

  // 🔐 Verificación de contraseña solo 1 vez por sesión
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

  // ✅ Carga seguros
  cargarSeguros(): void {
    const usuarioData = sessionStorage.getItem('usuario');
    if (!usuarioData) return;

    const usuario = JSON.parse(usuarioData);

    this.datosMedicosService.obtenerPorUsuario(usuario.id).subscribe({
      next: (datos) => {
        if (!datos?.length) return;

        const idDatos = datos[0].id_datos;

        this.seguroService.Lista().subscribe({
          next: (seguros) =>
            this.seguros = seguros.filter(s => s.datosmedicosid === idDatos),
          error: (err) => console.error(err)
        });
      }
    });
  }

  // 🟢 Agregar seguro
  async openBottomSheet(): Promise<void> {
    const ok = await this.verificarContrasenaSiEsNecesario();
    if (!ok) return;

    const sheetRef = this.bottomSheet.open(SeguroMedicoFor, { panelClass: 'custom-bottom-sheet' });

    sheetRef.afterDismissed().subscribe((result: SeguroMedico | null) => {
      if (result) this.guardarSeguro(result);
    });
  }

  // 🟣 Editar seguro
  async editarSeguro(seguro: SeguroMedico): Promise<void> {
    const ok = await this.verificarContrasenaSiEsNecesario();
    if (!ok) return;

    const sheetRef = this.bottomSheet.open(SeguroMedicoFor, {
      panelClass: 'custom-bottom-sheet',
      data: seguro
    });

    sheetRef.afterDismissed().subscribe((result: SeguroMedico | null) => {
      if (result) this.actualizarSeguro(seguro.idseguro, result);
    });
  }

  // 🔴 Eliminar seguro
  async eliminarSeguro(seguro: SeguroMedico): Promise<void> {
    const ok = await this.verificarContrasenaSiEsNecesario();
    if (!ok) return;

    const confirmar = confirm(`¿Deseas eliminar el seguro "${seguro.tiposeguro}"?`);
    if (!confirmar) return;

    this.seguroService.eliminarSeguro(seguro.idseguro).subscribe({
      next: () => this.cargarSeguros(),
      error: (err) => console.error(err)
    });
  }

  // ⚙️ Guardar seguro
  private guardarSeguro(result: SeguroMedico): void {
    if (typeof result.vigencia === 'string') {
      result.vigencia = new Date(result.vigencia);
    }

    this.datosMedicosService.obtenerPorUsuario(this.usuario.id).subscribe({
      next: (datos) => {
        if (!datos.length) return;

        const idDatos = datos[0].id_datos;
        const nuevoSeguro = { ...result, datosmedicosid: idDatos };

        this.seguroService.crearSeguro(nuevoSeguro).subscribe({
          next: () => this.cargarSeguros(),
          error: (err) => console.error(err)
        });
      }
    });
  }

  // ⚙️ Actualizar seguro
  private actualizarSeguro(id: number, result: SeguroMedico): void {
    if (typeof result.vigencia === 'string') {
      result.vigencia = new Date(result.vigencia);
    }

    const actualizado = { ...result, idseguro: id };

    this.seguroService.actualizarSeguro(id, actualizado).subscribe({
      next: () => this.cargarSeguros(),
      error: (err) => console.error(err)
    });
  }
}
