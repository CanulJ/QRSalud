import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../Services/usuarios.service';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatCardModule,
  FormsModule,
  ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatIconModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  loginForm!: FormGroup;
  mensajeError: string = '';

  constructor(
    private usuariosService: UsuariosService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Creamos el formulario reactivo
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Función para hacer login
  login(): void {
  if (this.loginForm.invalid) {
    this.mensajeError = 'Por favor completa todos los campos';
    return;
  }

  const { correo, password } = this.loginForm.value;

  this.usuariosService.login({ correo, password }).subscribe({
    next: (usuario) => {
      // Login OK
      alert(`Bienvenido, ${usuario.nombre}`);
      sessionStorage.setItem('usuario', JSON.stringify(usuario));
      this.mensajeError = '';
      this.router.navigate(['/inicio']);
    },
    error: (err) => {
      console.error('Error en login:', err);

      // err puede venir como HttpErrorResponse donde err.error es:
      // { statusCode: 400, message: 'Contraseña incorrecta', error: 'Bad Request' }
      // o message puede ser un array en algunos casos.
      let mensaje = 'Usuario o contraseña incorrectos';

      if (err && err.status) {
        // Mensajes por código HTTP (opcional)
        if (err.status === 0) {
          mensaje = 'No se pudo conectar al servidor';
        } else if (err.status === 401) {
          mensaje = 'No autorizado';
        } else if (err.status === 500) {
          mensaje = 'Error interno del servidor';
        }
      }

      // Intentamos sacar el message real que envía el backend
      const payload = err?.error;
      if (payload) {
        if (typeof payload === 'string') {
          mensaje = payload;
        } else if (payload.message) {
          // payload.message puede ser string o array
          if (Array.isArray(payload.message)) {
            mensaje = payload.message.join(', ');
          } else {
            mensaje = payload.message;
          }
        } else if (payload.errors) {
          // por si tu backend envía errores en un campo 'errors'
          if (Array.isArray(payload.errors)) {
            mensaje = payload.errors.map((e: any) => e.message || e).join(', ');
          } else if (typeof payload.errors === 'string') {
            mensaje = payload.errors;
          }
        }
      } else if (err?.message) {
        mensaje = err.message;
      }

      this.mensajeError = mensaje;
    }
  });
}


  irARegistro(): void {
    this.router.navigate(['/registro']);
  }
}
