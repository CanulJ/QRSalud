import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QRService } from '../../Services/qrs.service';
import { QRCodigos } from '../../Models/QRModels';

@Component({
  selector: 'app-qrp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qrp.html',
  styleUrl: './qrp.css'
})
export class QRP implements OnInit {
  private qrService = inject(QRService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  mensaje = 'Verificando acceso...';
  qrUsuario: QRCodigos | null = null;

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.mensaje = 'Token no encontrado.';
      return;
    }

    this.qrService.validarToken(token).subscribe({
      next: (data) => {
        if (data) {
          this.qrUsuario = data;
          this.mensaje = 'Acceso autorizado. Redirigiendo...';
          setTimeout(() => this.router.navigate(['/inicio']), 2000);
        } else {
          this.mensaje = 'Token no válido o expirado.';
        }
      },
      error: (err) => {
        console.error('Error al validar token:', err);
        this.mensaje = 'Error en la validación del token.';
      }
    });
  }
}
