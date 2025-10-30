import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../Services/usuarios.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  mensajeError: string = '';
  private isBrowser: boolean;

  constructor(
    private usuariosService: UsuariosService,
    private fb: FormBuilder,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object  // Inyectamos PLATFORM_ID
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.mensajeError = 'Por favor completa todos los campos';
      return;
    }

    const { correo, password } = this.loginForm.value;

    this.usuariosService.login({ correo, password }).subscribe({
      next: (usuario) => {
        alert(`Bienvenido, ${usuario.nombre}`);

        // 🔹 Guardamos usuario solo si estamos en navegador
        if (this.isBrowser) {
          sessionStorage.setItem('usuario', JSON.stringify(usuario));
        }

        this.mensajeError = '';
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error('Error en login:', err);

        let mensaje = 'Usuario o contraseña incorrectos';
        if (err && err.status) {
          if (err.status === 0) mensaje = 'No se pudo conectar al servidor';
          else if (err.status === 401) mensaje = 'No autorizado';
          else if (err.status === 500) mensaje = 'Error interno del servidor';
        }

        const payload = err?.error;
        if (payload) {
          if (typeof payload === 'string') mensaje = payload;
          else if (payload.message)
            mensaje = Array.isArray(payload.message)
              ? payload.message.join(', ')
              : payload.message;
          else if (payload.errors)
            mensaje = Array.isArray(payload.errors)
              ? payload.errors.map((e: any) => e.message || e).join(', ')
              : payload.errors;
        } else if (err?.message) mensaje = err.message;

        this.mensajeError = mensaje;
      }
    });
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }
}
