import { Component } from '@angular/core';
import { Usuarios } from '../../Models/Usuarios';
import { UsuariosService } from '../../Services/usuarios.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

nuevoUsuario: any = {
  id: 0,
  nombre: '',
  correo: '',
  password_hash: '',
  fecha_creacion: new Date(),
  isActive: true  // ahora es un array
};


  mensaje = '';
  error = '';

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  registrarUsuario() {
  if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.correo || !this.nuevoUsuario.password_hash) {
    this.error = 'Por favor llena todos los campos';
    this.mensaje = '';
    return;
  }

  // Convertir fecha a string compatible con PostgreSQL
  const usuarioParaEnviar = {
    ...this.nuevoUsuario,
    fecha_creacion: this.nuevoUsuario.fecha_creacion.toISOString().split('T')[0] // YYYY-MM-DD
  };

  console.log('Datos a enviar al backend:', usuarioParaEnviar);

  this.usuariosService.crearUsuario(usuarioParaEnviar).subscribe({
    next: (data) => {
      this.mensaje = 'Usuario registrado exitosamente 🎉';
      this.error = '';
      setTimeout(() => this.router.navigate(['/login']), 1500);
    },
    error: (err) => {
      this.error = 'Error al registrar usuario ❌';
      console.error(err);
    }
  });
}


irALogin() {
  this.router.navigate(['/login']);
}


}

