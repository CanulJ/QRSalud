import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, HostListener, Inject, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { DatosMedicosService } from '../../Services/datos-medicos.service';
import { DatosMedicos } from '../../Models/DatosMedicos';
import { historiaClinicaService } from '../../Services/historia-clinica.service';
import { Navegacion } from '../navegacion/navegacion';
import { SeguroMedicoComponent } from '../seguro-medico/seguro-medico';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfirmacionContrasena } from '../confirmacion-contrasena/confirmacion-contrasena';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    MatBottomSheetModule,
    Navegacion,
    SeguroMedicoComponent,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class Inicio implements OnInit {

  usuario: any = null;
  datosMedicos: DatosMedicos | null = null;

  private router = inject(Router);
  private datosMedicosService = inject(DatosMedicosService);
  private historiaClinicaService = inject(historiaClinicaService);
  private bottomSheet = inject(MatBottomSheet);
  private dialog = inject(MatDialog);

  private tiempoInactividad = 10 * 60 * 1000; // 10 minutos
  private temporizador: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const usuarioData = sessionStorage.getItem('usuario');
      if (usuarioData) {
        this.usuario = JSON.parse(usuarioData);
        const userId = this.usuario.id;

        if (!userId) {
          console.error('No se encontró un ID válido para el usuario', this.usuario);
          return;
        }

        this.datosMedicosService.obtenerPorUsuario(userId).subscribe({
          next: (datos) => this.datosMedicos = datos.length > 0 ? datos[0] : null,
          error: (err) => console.error('Error al obtener datos médicos', err)
        });

        // Inicia el temporizador de inactividad
        this.reiniciarTemporizador();
      }
    }
  }

  /** Detecta movimiento o teclas para reiniciar el temporizador */
  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  manejarActividadUsuario() {
    this.reiniciarTemporizador();
  }

  private reiniciarTemporizador() {
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => {
      this.cerrarSesion(true);
    }, this.tiempoInactividad);
  }

  /** Cierra sesión manual o automática */
  cerrarSesion(auto = false): void {
    sessionStorage.clear();
    if (auto) {
      alert('Por seguridad, su sesión ha expirado por inactividad.');
    }
    this.router.navigate(['/login']);
  }

  abrirDialogoTarjeta(): void {
    const dialogRef = this.dialog.open(ConfirmacionContrasena, {
      width: '350px',
      data: { correo: this.usuario?.correo }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.router.navigate(['/ver-tarjeta']);
      }
    });
  }
}
