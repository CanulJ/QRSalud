import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../Models/Usuarios';
import { UsuariosService } from '../../Services/usuarios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login implements OnInit {

  usuarios: Usuarios[] = []; 

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.usuariosService.Lista().subscribe({
      next: (data) => {
        this.usuarios = data;
         // 👀 Verifica en consola
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      }
    });
  }
}
