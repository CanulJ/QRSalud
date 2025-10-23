import { Component, inject, OnInit } from '@angular/core';
import { Antecedentes } from '../../Models/Antecedentes';
import { antecedentesService } from '../../Services/antecedentesM.service';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { CommonModule } from '@angular/common';
import { ForAntecedentesC } from '../for-antecedentes-c/for-antecedentes-c';
import { HistoriaClinica } from '../../Models/HistoriaClinica';

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

  ngOnInit(): void {
    // Intentamos obtener el id de la historia desde sessionStorage
    let historiaData = sessionStorage.getItem('historiaClinicaId');

    if (historiaData) {
      this.idHistoriaClinica = Number(historiaData);
    } else {
      // Si no hay id en sessionStorage, buscamos la historia más reciente del usuario
      const historial: HistoriaClinica[] = JSON.parse(sessionStorage.getItem('historiaClinica') || '[]');
      if (historial.length > 0) {
        // Ordenamos por fecha y tomamos la más reciente
        historial.sort((a, b) => new Date(b.fecharegistro).getTime() - new Date(a.fecharegistro).getTime());
        this.idHistoriaClinica = historial[0].idhistoria;
        sessionStorage.setItem('historiaClinicaId', String(this.idHistoriaClinica));
      }
    }

    if (this.idHistoriaClinica) {
      this.cargarAntecedentes();
    }
  }

  cargarAntecedentes(): void {
    if (!this.idHistoriaClinica) return;
    this.antecedentesService.obtenerPorHistoria(this.idHistoriaClinica).subscribe({
      next: (data) => this.antecedentes = data.length > 0 ? data[0] : null,
      error: (err) => console.error('Error al obtener antecedentes', err)
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
          this.antecedentesService.actualizar(this.antecedentes.id_antecedente, result).subscribe({
            next: (updated) => this.antecedentes = updated,
            error: (err) => console.error('Error al actualizar antecedentes', err)
          });
        } else {
          // Crear nuevo antecedente usando la historia más reciente
          const datosConHistoria = { ...result, historia: { idhistoria: this.idHistoriaClinica } };
          this.antecedentesService.crear(datosConHistoria).subscribe({
            next: (created) => this.antecedentes = created,
            error: (err) => console.error('Error al crear antecedentes', err)
          });
        }
      }
    });
  }
}
