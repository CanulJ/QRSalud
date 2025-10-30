import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QRService } from '../../Services/qrs.service';
import { AuthService } from '../../Services/auth.service';
import { QRCodigos } from '../../Models/QRModels';

@Component({
  selector: 'app-qrp',
  templateUrl: './qrp.html',
  styleUrl: './qrp.css'
})
export class QRP implements OnInit {

  private qrService = inject(QRService);
  private authService = inject(AuthService);
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

        // Guardamos la info del usuario en sessionStorage
        const usuario = {
          id: qr.userid,
          nombre: qr.usuario?.nombre, // si tu API devuelve la relación usuario
          email: qr.usuario?.email
        };
        sessionStorage.setItem('usuario', JSON.stringify(usuario));

        // Redirigimos al inicio, ahora ya “logueado”
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
