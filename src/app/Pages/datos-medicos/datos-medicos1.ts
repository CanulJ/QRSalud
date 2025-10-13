import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-datos-medicos',
  templateUrl: './datos-medicos.html',
  styleUrls: ['./datos-medicos.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class DatosMedicos1 {
  datos: any = {
    tipo_sangre: '',
    alergias: '',
    medicamentos: '',
    enfermedades: '',
    contacto_emergencia: ''
  };

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<DatosMedicos1>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    if (data) this.datos = { ...data };
  }

  guardar(): void {
    this._bottomSheetRef.dismiss(this.datos); // devolver datos al padre
  }

  cerrar(): void {
    this._bottomSheetRef.dismiss();
  }
}
