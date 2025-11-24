import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dialogo-mensaje',
  standalone: true,
  imports: [NgIf],
  templateUrl: './dialogo-mensaje.html',
  styleUrls: ['./dialogo-mensaje.css'],
})
export class DialogoMensaje {

  constructor(
    public dialogRef: MatDialogRef<DialogoMensaje>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      titulo: string; 
      mensaje: string;
      modoConfirmacion?: boolean;
    }
  ) {}

  aceptar() {
    if (this.data.modoConfirmacion) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close();
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
