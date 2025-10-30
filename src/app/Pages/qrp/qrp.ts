import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QRService } from '../../Services/qrs.service';
import { AuthService } from '../../Services/auth.service';
import { QRCodigos } from '../../Models/QRModels';

@Component({
  selector: 'app-qrp',
  templateUrl: './qrp.html',
  styleUrls: ['./qrp.css']
})
export class QRP implements OnInit {

  private qrService = inject(QRService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  qrUsuario: QRCodigos[] = [];
  usuarioId: number | null = null;

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      alert('No se detectó ningún token en la URL');
      this.router.navigate(['/']);
      return;
    }

    // 🚀 Paso 1: Leer el UID NFC simulado o real (desde sessionStorage o API NFC)
    const uidLeido = sessionStorage.getItem('nfc_uid_leido');

    if (!uidLeido) {
      alert('Por seguridad, escanea la tarjeta NFC antes de acceder.');
      this.router.navigate(['/']);
      return;
    }

    // 🚀 Paso 2: Validar token y UID NFC directamente con el backend
    this.qrService.obtenerPorTokenYUID(token, uidLeido).subscribe({
      next: (qr) => {
        if (!qr || !qr.usuario) {
          alert('Token inválido o tarjeta no autorizada.');
          this.router.navigate(['/']);
          return;
        }

        // ✅ Si pasa la validación, guardar los datos del usuario
        const usuario = {
          id: qr.usuario.id,
          nombre: qr.usuario.nombre,
          apellidos: qr.usuario.apellidos,
          fechanacimiento: qr.usuario.fechanacimiento,
          genero: qr.usuario.genero,
          telefono: qr.usuario.telefono,
          curp: qr.usuario.curp,
          originario: qr.usuario.originario,
          correo: qr.usuario.correo,
          fecha_creacion: qr.usuario.fecha_creacion
        };

        sessionStorage.setItem('usuario', JSON.stringify(usuario));

        // Redirigir al inicio
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error('Error al validar QR y NFC:', err);
        alert('Acceso denegado: tarjeta NFC o enlace inválido.');
        this.router.navigate(['/']);
      }
    });
  }
}
