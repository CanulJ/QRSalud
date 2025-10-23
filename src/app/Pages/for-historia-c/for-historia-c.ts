import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HistoriaClinica } from '../../Models/HistoriaClinica';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-for-historia-c',
  templateUrl: './for-historia-c.html',
  styleUrls: ['./for-historia-c.css'],
  standalone: true,
   providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerModule
  ]
})
export class ForHistoriaC {

  @Output() historiaGuardada = new EventEmitter<HistoriaClinica>();

  historia: HistoriaClinica = {
    idhistoria: 0,              // el backend lo reemplazará
    datosmedicosid: 0,
    descripcion: '',
    fecharegistro: new Date().toISOString().substring(0,10)
  };

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef?: MatBottomSheetRef<ForHistoriaC>
  ) {
    if (data && data.datosmedicosid) {
      this.historia.datosmedicosid = data.datosmedicosid;
    }
  }

  guardar(): void {
    if (this._bottomSheetRef) {
      this._bottomSheetRef.dismiss(this.historia); // devuelve la historia al componente padre
    } else {
      this.historiaGuardada.emit(this.historia);
    }
  }

  cerrar(): void {
    if (this._bottomSheetRef) {
      this._bottomSheetRef.dismiss();
    }
  }
}
