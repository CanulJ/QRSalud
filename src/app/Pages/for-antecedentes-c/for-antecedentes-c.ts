import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Antecedentes } from '../../Models/Antecedentes';

@Component({
  selector: 'app-for-antecedentes-c',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './for-antecedentes-c.html',
  styleUrls: ['./for-antecedentes-c.css']
})
export class ForAntecedentesC {

  @Output() antecedentesGuardados = new EventEmitter<Antecedentes>();

  antecedentes: Antecedentes = {
    id_antecedente: 0, // el backend asignará
    id_historia: 0,     // se recibirá desde el componente padre
    padre: '',
    madre: '',
    abuelos: '',
    hermanos: '',
    otros: ''
  };

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef?: MatBottomSheetRef<ForAntecedentesC>
  ) {
    if (data) {
      this.antecedentes = { ...this.antecedentes, ...data };
    }
  }

  guardar(): void {
    if (this._bottomSheetRef) {
      this._bottomSheetRef.dismiss(this.antecedentes); // devuelve los datos al componente padre
    } else {
      this.antecedentesGuardados.emit(this.antecedentes);
    }
  }

  cerrar(): void {
    if (this._bottomSheetRef) {
      this._bottomSheetRef.dismiss();
    }
  }
}
