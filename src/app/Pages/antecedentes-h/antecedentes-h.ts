import { Component, inject, OnInit } from '@angular/core';
import { Antecedentes } from '../../Models/Antecedentes';
import { antecedentesService } from '../../Services/antecedentesM.service';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { CommonModule } from '@angular/common';
import { ForAntecedentesC } from '../for-antecedentes-c/for-antecedentes-c';
import { HistoriaClinica } from '../../Models/HistoriaClinica';
import { historiaClinicaService } from '../../Services/historia-clinica.service'; // <-- service para obtener historias

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
    
    // Traemos la historia clínica más reciente del usuario
    this.historiaService.obtenerPorUsuario(usuario.id).subscribe({
      next: (historias: HistoriaClinica[]) => {
        if (historias.length > 0) {
          // Ordenamos por fecha y tomamos la más reciente
          historias.sort((a, b) => new Date(b.fecharegistro).getTime() - new Date(a.fecharegistro).getTime());
          this.idHistoriaClinica = historias[0].idhistoria;

          // Guardamos temporalmente en sessionStorage por si quieres reutilizar
          sessionStorage.setItem('historiaClinicaId', String(this.idHistoriaClinica));

          // Ahora cargamos los antecedentes
          this.cargarAntecedentes();
        } else {
          console.warn('El usuario no tiene historias clínicas');
        }
      },
      error: (err) => console.error('Error al obtener historias clínicas del usuario', err)
    });
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
