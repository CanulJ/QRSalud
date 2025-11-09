import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UsuariosService } from '../../Services/usuarios.service';

@Component({
  selector: 'app-confirmacion-contrasena',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './confirmacion-contrasena.html',
  styleUrls: ['./confirmacion-contrasena.css'],
})
export class ConfirmacionContrasena {
  form: FormGroup;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConfirmacionContrasena>,
    private usuariosService: UsuariosService,
    @Inject(MAT_DIALOG_DATA) public data: { correo: string }
  ) {
    this.form = this.fb.group({
      password: ['', Validators.required],
    });
  }

  confirmar(): void {
    const { password } = this.form.value;

    this.usuariosService.login({ correo: this.data.correo, password }).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => (this.mensajeError = 'Contraseña incorrecta'),
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
