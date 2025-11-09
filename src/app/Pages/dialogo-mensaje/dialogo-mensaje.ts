import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-mensaje',
  imports: [],
  templateUrl: './dialogo-mensaje.html',
  styleUrl: './dialogo-mensaje.css',
})
export class DialogoMensaje {
constructor(
    public dialogRef: MatDialogRef<DialogoMensaje>,
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string; mensaje: string }
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}