import { Component, inject, OnInit } from '@angular/core';
import { Antecedentes } from '../../Models/Antecedentes';
import { antecedentesService } from '../../Services/antecedentesM.service';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { CommonModule } from '@angular/common';
import { ForAntecedentesC } from '../for-antecedentes-c/for-antecedentes-c';
import { HistoriaClinica } from '../../Models/HistoriaClinica';
import { historiaClinicaService } from '../../Services/historia-clinica.service';

@Component({
  selector: 'app-antecedentes-h',
  standalone: true,
  imports: [CommonModule, MatBottomSheetModule],
  templateUrl: './antecedentes-h.html',
  styleUrls: ['./antecedentes-h.css']
})
export class AntecedentesH implements OnInit {

  antecedentes: Antecedentes | null = null;
  idHistoriaClinica: number | null = null;

  private antecedentesService = inject(antecedentesService);
  private bottomSheet = inject(MatBottomSheet);
  private historiaService = inject(historiaClinicaService);

  ngOnInit(): void {
    const usuarioData = sessionStorage.getItem('usuario');

    if (!usuarioData) {
      console.error('No hay usuario logueado');
      return;
    }

    const usuario = JSON.parse(usuarioData);

    // 🔹 Primero cargamos los antecedentes del usuario
    this.antecedentesService.obtenerPorUsuario(usuario.id).subscribe({
      next: (antecedentes: Antecedentes[]) => {
        if (antecedentes.length > 0) {
          // Tomamos el primero, suponiendo que sea el más reciente
          this.antecedentes = antecedentes[0];
        }

        // 🔹 Ahora traemos la historia clínica más reciente (solo para vincular si crea uno nuevo)
        this.historiaService.obtenerPorUsuario(usuario.id).subscribe({
          next: (historias: HistoriaClinica[]) => {
            if (historias.length > 0) {
              historias.sort((a, b) => new Date(b.fecharegistro).getTime() - new Date(a.fecharegistro).getTime());
              this.idHistoriaClinica = historias[0].idhistoria;
              sessionStorage.setItem('historiaClinicaId', String(this.idHistoriaClinica));
            }
          },
          error: (err) => console.error('Error al obtener historia clínica', err)
        });
      },
      error: (err) => console.error('Error al obtener antecedentes del usuario', err)
    });
  }

  openBottomSheet(): void {
    if (!this.idHistoriaClinica) {
      console.error('No hay historia clínica disponible');
      return;
    }

    const sheetRef = this.bottomSheet.open(ForAntecedentesC, {
      data: { ...this.antecedentes, id_historia: this.idHistoriaClinica },
      panelClass: 'custom-bottom-sheet'
    });

    sheetRef.afterDismissed().subscribe((result: any) => {
      if (result) {
        if (this.antecedentes?.id_antecedente) {
          // 🔹 Actualizar existente
          this.antecedentesService.actualizar(this.antecedentes.id_antecedente, result).subscribe({
            next: (updated) => this.antecedentes = updated,
            error: (err) => console.error('Error al actualizar antecedentes', err)
          });
        } else {
          // 🔹 Crear nuevo antecedente y vincular con historia más reciente si existe
          const datosConHistoria = { 
            ...result, 
            historia: this.idHistoriaClinica ? { idhistoria: this.idHistoriaClinica } : undefined 
          };
          this.antecedentesService.crear(datosConHistoria).subscribe({
            next: (created) => this.antecedentes = created,
            error: (err) => console.error('Error al crear antecedentes', err)
          });
        }
      }
    });
  }

  // 🔹 Método opcional si quieres recargar antecedentes manualmente
  recargarAntecedentes(): void {
    const usuarioData = sessionStorage.getItem('usuario');
    if (!usuarioData) return;

    const usuario = JSON.parse(usuarioData);
    this.antecedentesService.obtenerPorUsuario(usuario.id).subscribe({
      next: (antecedentes: Antecedentes[]) => {
        if (antecedentes.length > 0) this.antecedentes = antecedentes[0];
      },
      error: (err) => console.error('Error al recargar antecedentes', err)
    });
  }
}
