import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QRService } from '../../Services/qrs.service';
import { QRCodigos } from '../../Models/QRModels';

@Component({
  selector: 'app-qrp',
  templateUrl: './qrp.html',
  styleUrls: ['./qrp.css']
})
export class QRP implements OnInit {

  private qrService = inject(QRService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  qrUsuario: QRCodigos[] = [];
  usuarioId: number | null = null;

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token'); // Leer token de la URL
    if (token) {
      this.qrService.obtenerPorToken(token).subscribe({
        next: (qr) => {
          if (!qr) {
            alert('Token inválido o expirado');
            this.router.navigate(['/']); // Redirige al login
            return;
          }
          // Guardamos el ID del usuario en sessionStorage
          this.usuarioId = qr.userid;
          sessionStorage.setItem('usuario', JSON.stringify({ id: this.usuarioId }));
          // Cargar los QR de ese usuario
          this.cargarQRs(this.usuarioId);
          // Redirigir al inicio para que cargue datos completos
          this.router.navigate(['/inicio']);
        },
        error: (err) => {
          console.error('Error al validar el token', err);
          this.router.navigate(['/']);
        }
      });
    }
  }

  cargarQRs(userid: number) {
    this.qrService.obtenerPorUsuario(userid).subscribe({
      next: (data) => this.qrUsuario = data,
      error: (err) => console.error('Error al cargar códigos QR del usuario', err)
    });
  }
}
