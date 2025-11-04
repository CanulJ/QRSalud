import { Component, Inject } from '@angular/core';
import { SeguroMedico } from '../../Models/SeguroMedicoM';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-seguro-medico-for',
  imports: [CommonModule, FormsModule,MatButtonModule, MatButtonModule,
    MatBottomSheetModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule],
  templateUrl: './seguro-medico-for.html',
  styleUrl: './seguro-medico-for.css',
})
export class SeguroMedicoFor {
  
   seguro: SeguroMedico = {
    idseguro: 0,
    datosmedicosid: 0,
    tiposeguro: '',
    institucion: '',
    numeropoliza: '',
    vigencia: new Date(),
  };

  constructor(
    private bottomSheetRef: MatBottomSheetRef<SeguroMedico>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    if (data) this.seguro = { ...this.seguro, ...data };
  }

  guardar(): void {
    this.bottomSheetRef.dismiss(this.seguro);
  }

  cerrar(): void {
    this.bottomSheetRef.dismiss();
  }

}
