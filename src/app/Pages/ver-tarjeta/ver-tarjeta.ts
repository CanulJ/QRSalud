import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { QRService } from '../../Services/qrs.service';
import { QRCodigos } from '../../Models/QRModels';
import { DialogoMensaje } from '../dialogo-mensaje/dialogo-mensaje';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-ver-tarjeta',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './ver-tarjeta.html',
  styleUrls: ['./ver-tarjeta.css'],
})
export class VerTarjeta implements OnInit {

  usuario: any = null;
  qrGenerado: QRCodigos | null = null;
  cargando = false;

  constructor(
    private qrService: QRService,
    private router: Router,
      private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const usuarioData = sessionStorage.getItem('usuario');
      if (usuarioData) {
        this.usuario = JSON.parse(usuarioData);
        const userId = this.usuario?.id;
        if (userId) {
          this.qrService.obtenerPorUsuario(userId).subscribe({
            next: (qrs) => {
              if (qrs.length > 0) {
                this.qrGenerado = qrs[0];
              }
            },
            error: (err) => console.error('Error al obtener QR:', err),
          });
        }
      }
    }
  }

  generarQR(): void {
    // 🚫 Si ya tiene un QR generado, mostrar aviso
    if (this.qrGenerado) {
      this.dialog.open(DialogoMensaje, {
        data: {
          titulo: '⚠️ Atención',
          mensaje: 'Su token ya ha sido generado. No es posible crear uno nuevo.',
        },
      });
      return;
    }

    if (!this.usuario?.id) return;

    this.cargando = true;
    const tokenSeguro = Math.random().toString(36).substring(2, 10);
    const datos = { userid: this.usuario.id, urlqrcode: tokenSeguro };

    this.qrService.crearQR(datos).subscribe({
      next: (qr) => {
        this.cargando = false;
        console.log('Nuevo QR generado:', qr);
        this.qrGenerado = qr;

        this.dialog.open(DialogoMensaje, {
          data: {
            titulo: '✅ Éxito',
            mensaje: 'Se generó su token de acceso correctamente.',
          },
        });
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al generar QR:', err);
        this.dialog.open(DialogoMensaje, {
          data: {
            titulo: '❌ Error',
            mensaje: 'No se pudo generar el token. Intente nuevamente.',
          },
        });
      },
    });
  }

 copiarToken(): void {
  if (this.qrGenerado?.urlqrcode) {
    navigator.clipboard.writeText(this.qrGenerado.urlqrcode);
   this.snackBar.open('📋 Token copiado al portapapeles', '', {
  duration: 3000,
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
});
  }
}


  regresarInicio(): void {
    this.router.navigate(['/inicio']);
  }
}
