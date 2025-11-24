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
import { TarjetasService } from '../../Services/tarjetas-s.service';
import { SolicitudTarjeta } from '../../Models/Solicitud';

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
  solicitud: SolicitudTarjeta | null = null;
  cargando = false;

  constructor(
    private qrService: QRService,
    private tarjetasService: TarjetasService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const usuarioData = sessionStorage.getItem('usuario');
      if (usuarioData) {
        this.usuario = JSON.parse(usuarioData);
        const userId = this.usuario?.id;

        if (userId) {
          // 🔹 Obtener el QR más reciente
          this.qrService.obtenerPorUsuario(userId).subscribe({
            next: (qrs) => {
              if (qrs.length > 0) {
                const qrsOrdenados = qrs.sort((a, b) =>
                  new Date(b.fechacreacion).getTime() - new Date(a.fechacreacion).getTime()
                );
                this.qrGenerado = qrsOrdenados[0];
              }
            },
            error: (err) => console.error('Error al obtener QR:', err),
          });

          // 🔹 Obtener la solicitud más reciente del usuario
          this.tarjetasService.getSolicitudes().subscribe({
            next: (sols) => {
              const userSols = sols.filter(s => s.userId === userId);

              if (userSols.length > 0) {
                this.solicitud = userSols.sort((a, b) =>
                  new Date(b.fecha_Solicitud).getTime() - new Date(a.fecha_Solicitud).getTime()
                )[0];
              } else {
                this.solicitud = null;
              }
            },
            error: (err) => console.error('Error al obtener solicitudes:', err),
          });
        }
      }
    }
  }

  solicitarTarjeta(): void {
    if (!this.usuario) return;

    if (this.solicitud && (this.solicitud.estado === 'pendiente' || this.solicitud.estado === 'aprobada')) {
      this.dialog.open(DialogoMensaje, {
        data: {
          titulo: '⚠️ Solicitud existente',
          mensaje: 'Ya tienes una solicitud activa o aprobada.',
        },
      });
      return;
    }

    const tokenSeguro = Math.random().toString(36).substring(2, 10);

    const nuevaSolicitud: SolicitudTarjeta = {
      userId: this.usuario.id,
      fecha_Solicitud: new Date().toISOString(),
      estado: 'pendiente',
      qrId: undefined,
      token: tokenSeguro,
    };

    this.tarjetasService.createSolicitud(nuevaSolicitud).subscribe({
      next: (sol) => {
        this.solicitud = sol;
        this.dialog.open(DialogoMensaje, {
          data: {
            titulo: '✅ Solicitud enviada',
            mensaje: `Tu solicitud ha sido enviada. Tu token es: ${tokenSeguro}`,
          },
        });
      },
      error: () => {
        this.dialog.open(DialogoMensaje, {
          data: { titulo: '❌ Error', mensaje: 'No se pudo enviar la solicitud.' },
        });
      }
    });
  }

  volverASolicitar(): void {
    if (!this.usuario?.id) return;

    if (this.solicitud && (this.solicitud.estado === 'pendiente' || this.solicitud.estado === 'aprobada')) {
      this.dialog.open(DialogoMensaje, {
        data: {
          titulo: '⚠️ Solicitud existente',
          mensaje: 'No puedes volver a solicitar hasta que la actual sea revisada.',
        },
      });
      return;
    }

    const nuevoToken = Math.random().toString(36).substring(2, 10);

    const nuevaSolicitud: Partial<SolicitudTarjeta> = {
      userId: this.usuario.id,
      token: nuevoToken,
      estado: 'pendiente',
      fecha_Solicitud: new Date().toISOString(),
    };

    this.tarjetasService.createSolicitud(nuevaSolicitud).subscribe({
      next: (res) => {
        this.solicitud = res;
        this.dialog.open(DialogoMensaje, {
          data: {
            titulo: '✅ Solicitud reenviada',
            mensaje: 'Tu nueva solicitud ha sido enviada correctamente.',
          },
        });
      },
      error: () => {
        this.dialog.open(DialogoMensaje, {
          data: { titulo: '❌ Error', mensaje: 'No se pudo reenviar.' },
        });
      },
    });
  }

 reportarPerdida(): void {
  if (!this.solicitud) return;

  const dialogRef = this.dialog.open(DialogoMensaje, {
    data: {
      titulo: "🛑 ¿Estás seguro?",
      mensaje:
        "Si reportas tu tarjeta como perdida, dejará de funcionar de inmediato. " +
        "Además, tendrás que esperar a que un administrador valide el nuevo token. ¿Deseas continuar?",
      modoConfirmacion: true
    }
  });

  dialogRef.afterClosed().subscribe((confirmado: boolean) => {
    if (!confirmado) return;

    // 1️⃣ Eliminar el QR de la tabla QRCodigos
    if (this.solicitud!.qrId) {
      this.qrService.eliminarQR(this.solicitud!.qrId).subscribe({
        next: () => {
          console.log('QR eliminado correctamente');
          this.actualizarSolicitudComoReportada();
        },
        error: (err) => {
          console.error('No se pudo eliminar el QR:', err);
          // aunque falle eliminar el QR, igual actualizamos estado
          this.actualizarSolicitudComoReportada();
        }
      });
    } else {
      this.actualizarSolicitudComoReportada();
    }
  });
}

// 2️⃣ Actualizar estado y token en la solicitud
private actualizarSolicitudComoReportada() {
  const nuevoToken = Math.random().toString(36).substring(2, 10);
  const solicitudActualizada: Partial<SolicitudTarjeta> = {
    estado: "reportada",
    token: nuevoToken,
    fecha_Revision: new Date().toISOString(),
    qrId: null
  };

  this.tarjetasService.updateSolicitud(this.solicitud!.idSolicitud!, solicitudActualizada)
    .subscribe({
      next: () => {
        this.solicitud!.estado = "reportada";
        this.solicitud!.token = nuevoToken;
        this.solicitud!.qrId = null;

        this.dialog.open(DialogoMensaje, {
          data: {
            titulo: "📢 Tarjeta reportada",
            mensaje: `Tu tarjeta se ha marcado como perdida.\n\nSe generó un nuevo token para validación: 🔐 **${nuevoToken}**`
          }
        });
      },
      error: () => {
        this.dialog.open(DialogoMensaje, {
          data: {
            titulo: "❌ Error",
            mensaje: "No se pudo reportar la tarjeta. Intenta más tarde."
          }
        });
      }
    });
}



  generarQR(): void {
    if (this.qrGenerado) {
      this.dialog.open(DialogoMensaje, {
        data: {
          titulo: '⚠️ Atención',
          mensaje: 'Ya cuentas con un token generado.',
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
        this.qrGenerado = qr;
        this.dialog.open(DialogoMensaje, {
          data: { titulo: '✅ Éxito', mensaje: 'Token generado correctamente.' },
        });
      },
      error: () => {
        this.cargando = false;
        this.dialog.open(DialogoMensaje, {
          data: { titulo: '❌ Error', mensaje: 'No se pudo generar el token.' },
        });
      },
    });
  }

  copiarToken(): void {
    if (this.qrGenerado?.urlqrcode) {
      navigator.clipboard.writeText(this.qrGenerado.urlqrcode);
      this.snackBar.open('📋 Token copiado', '', {
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
