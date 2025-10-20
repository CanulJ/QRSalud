import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { DatosMedicos1 } from '../datos-medicos/datos-medicos1';
import { HistoriaClinica1 } from '../historia-clinica/historia-clinica1';
import { TablaMedica } from '../tabla-medica/tabla-medica';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-navegacion',
  imports: [MatTabsModule,HistoriaClinica1,TablaMedica,MatBottomSheetModule],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.css'
})
export class Navegacion {

  
}
