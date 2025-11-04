import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { SeguroMedico } from '../../Models/SeguroMedicoM';
import { SeguroMedicosService } from '../../Services/seguro-medico.service';
import { DatosMedicosService } from '../../Services/datos-medicos.service';
import { SeguroMedicoFor } from '../seguro-medico-for/seguro-medico-for';

@Component({
  selector: 'app-seguro-medico',
  standalone: true,
  imports: [CommonModule, MatBottomSheetModule],
  templateUrl: './seguro-medico.html',
  styleUrls: ['./seguro-medico.css']
})
export class SeguroMedicoComponent implements OnInit {
  usuario: any = null;
  seguros: SeguroMedico[] = [];

  private seguroService = inject(SeguroMedicosService);
  private datosMedicosService = inject(DatosMedicosService);
  private bottomSheet = inject(MatBottomSheet);

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

  // 🔹 Carga los seguros del usuario logueado
  cargarSeguros(): void {
    const usuarioData = sessionStorage.getItem('usuario');
    if (!usuarioData) {
      console.error('⚠️ No se encontró el usuario en sesión.');
      return;
    }

    const usuario = JSON.parse(usuarioData);
    this.datosMedicosService.obtenerPorUsuario(usuario.id).subscribe({
      next: (datos) => {
        if (!datos?.length) {
          console.warn('⚠️ No se encontraron datos médicos para este usuario.');
          return;
        }
        const idDatos = datos[0].id_datos;
        this.seguroService.Lista().subscribe({
          next: (seguros) => {
            this.seguros = seguros.filter(s => s.datosmedicosid === idDatos);
            console.log('✅ Seguros cargados:', this.seguros);
          },
          error: (err) => console.error('❌ Error al obtener seguros médicos', err)
        });
      },
      error: (err) => console.error('❌ Error al obtener datos médicos del usuario', err)
    });
  }

  // 🟢 Agregar nuevo seguro
  openBottomSheet(): void {
    const sheetRef = this.bottomSheet.open(SeguroMedicoFor, { panelClass: 'custom-bottom-sheet' });

    sheetRef.afterDismissed().subscribe((result: SeguroMedico | null) => {
      if (!result) return;
      this.guardarSeguro(result);
    });
  }

  // 🟣 Editar seguro existente
  editarSeguro(seguro: SeguroMedico): void {
    const sheetRef = this.bottomSheet.open(SeguroMedicoFor, {
      panelClass: 'custom-bottom-sheet',
      data: seguro
    });

    sheetRef.afterDismissed().subscribe((result: SeguroMedico | null) => {
      if (!result) return;
      this.actualizarSeguro(seguro.idseguro, result);
    });
  }

  // 🔴 Eliminar seguro
  eliminarSeguro(seguro: SeguroMedico): void {
    const confirmar = confirm(`¿Deseas eliminar el seguro "${seguro.tiposeguro}"?`);
    if (!confirmar) return;

    this.seguroService.eliminarSeguro(seguro.idseguro).subscribe({
      next: () => {
        console.log(`🗑️ Seguro eliminado: ${seguro.tiposeguro}`);
        this.cargarSeguros();
      },
      error: (err) => console.error('❌ Error al eliminar seguro', err)
    });
  }

  // ⚙️ Crear seguro (convertir fecha y asociar con datos médicos)
  private guardarSeguro(result: SeguroMedico): void {
    // 🔧 Si la vigencia viene como string, la convertimos a Date
    if (typeof result.vigencia === 'string') {
      result.vigencia = new Date(result.vigencia);
    }

    this.datosMedicosService.obtenerPorUsuario(this.usuario.id).subscribe({
      next: (datos) => {
        if (datos.length > 0) {
          const idDatos = datos[0].id_datos;
          const nuevoSeguro = { ...result, datosmedicosid: idDatos };
          this.seguroService.crearSeguro(nuevoSeguro).subscribe({
            next: () => {
              console.log('✅ Seguro médico agregado correctamente');
              this.cargarSeguros();
            },
            error: (err) => console.error('❌ Error al crear seguro médico', err)
          });
        }
      },
      error: (err) => console.error('❌ Error al obtener datos médicos del usuario', err)
    });
  }

  // ⚙️ Actualizar seguro (conversión de fecha incluida)
  private actualizarSeguro(id: number, result: SeguroMedico): void {
    if (typeof result.vigencia === 'string') {
      result.vigencia = new Date(result.vigencia);
    }

    const actualizado = { ...result, idseguro: id };

    this.seguroService.actualizarSeguro(id, actualizado).subscribe({
      next: () => {
        console.log('✏️ Seguro actualizado correctamente');
        this.cargarSeguros();
      },
      error: (err) => console.error('❌ Error al actualizar seguro médico', err)
    });
  }
}
