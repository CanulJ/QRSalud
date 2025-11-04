import { Component } from '@angular/core';
import { UsuariosService } from '../../Services/usuarios.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, MatButtonModule,
    MatBottomSheetModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {

  nuevoUsuario: any = {
    id: 0,
    nombre: '',
    apellidos: '',
    correo: '',
    password_hash: '',
    fecha_creacion: new Date(),
    fechanacimiento: new Date(),
    curp: '',
    rolid: 1,
    telefono: '',
    genero: '',
    originario: ''
  };

  mensaje = '';
  error = '';

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  registrarUsuario() {
    const u = this.nuevoUsuario;

    // Validación de campos obligatorios
    if (!u.nombre || !u.apellidos || !u.correo || !u.password_hash || !u.curp) {
      this.error = 'Por favor llena todos los campos obligatorios.';
      this.mensaje = '';
      return;
    }

    // Asegurar que las fechas sean Date antes de usar toISOString
    const fechaCreacion = u.fecha_creacion instanceof Date ? u.fecha_creacion : new Date(u.fecha_creacion);
    const fechaNacimiento = u.fechanacimiento instanceof Date ? u.fechanacimiento : new Date(u.fechanacimiento);

    // Mapear campos correctamente para el backend
    const usuarioParaEnviar = {
  nombre: u.nombre,
  apellidos: u.apellidos,
  correo: u.correo,
  password: u.password_hash,
  curp: u.curp,
  rolid: u.rolid ?? 2,             // valor por defecto (usuario normal)               // valor por defecto
  telefono: u.telefono,
  genero: u.genero,
  originario: u.originario,
  fecha_creacion: fechaCreacion.toISOString().split('T')[0],
  fechanacimiento: fechaNacimiento.toISOString().split('T')[0],
};


    console.log('Datos a enviar al backend:', usuarioParaEnviar);

    this.usuariosService.crearUsuario(usuarioParaEnviar).subscribe({
      next: () => {
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