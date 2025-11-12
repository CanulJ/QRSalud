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
          // 🔹 Obtener el QR más reciente del usuario
          this.qrService.obtenerPorUsuario(userId).subscribe({
            next: (qrs) => {
              if (qrs.length > 0) {
                // Ordenar por fecha o id descendente
                const qrsOrdenados = qrs.sort((a, b) => {
                  const fechaA = new Date(a.fechacreacion).getTime();
                  const fechaB = new Date(b.fechacreacion).getTime();
                  return fechaB - fechaA;
                });
                this.qrGenerado = qrsOrdenados[0];
              }
            },
            error: (err) => console.error('Error al obtener QR:', err),
          });

          // 🔹 Obtener la solicitud más reciente del usuario
          this.tarjetasService.getSolicitudes().subscribe({
            next: (sols) => {
              const solicitudesUsuario = sols.filter(s => s.userId === userId);

              if (solicitudesUsuario.length > 0) {
                // Ordenar por fecha_Solicitud descendente
                const ordenadas = solicitudesUsuario.sort((a, b) => {
                  const fechaA = new Date(a.fecha_Solicitud).getTime();
                  const fechaB = new Date(b.fecha_Solicitud).getTime();
                  return fechaB - fechaA;
                });
                this.solicitud = ordenadas[0]; // ✅ la más reciente
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

    // ✅ Validar si ya existe una solicitud pendiente o aprobada
    if (this.solicitud && (this.solicitud.estado === 'pendiente' || this.solicitud.estado === 'aprobada')) {
      this.dialog.open(DialogoMensaje, {
        data: {
          titulo: '⚠️ Solicitud existente',
          mensaje: 'Ya tienes una solicitud activa o aprobada. No puedes enviar otra hasta que se resuelva.',
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
      token: tokenSeguro as any
    };

    this.tarjetasService.createSolicitud(nuevaSolicitud).subscribe({
      next: (solicitudCreada) => {
        this.solicitud = solicitudCreada;
        this.dialog.open(DialogoMensaje, {
          data: {
            titulo: '✅ Solicitud enviada',
            mensaje: `Tu solicitud ha sido enviada correctamente. Tu token es: ${tokenSeguro}`,
          },
        });
      },
      error: (err) => {
        console.error('Error al enviar solicitud:', err);
        this.dialog.open(DialogoMensaje, {
          data: {
            titulo: '❌ Error',
            mensaje: 'No se pudo enviar tu solicitud. Inténtalo nuevamente.',
          },
        });
      }
    });
  }

  volverASolicitar(): void {
    if (!this.usuario?.id) return;

    // ✅ Validar si ya existe una solicitud pendiente o aprobada
    if (this.solicitud && (this.solicitud.estado === 'pendiente' || this.solicitud.estado === 'aprobada')) {
      this.dialog.open(DialogoMensaje, {
        data: {
          titulo: '⚠️ Solicitud existente',
          mensaje: 'Ya tienes una solicitud activa o aprobada. Espera a que sea revisada antes de volver a solicitar.',
        },
      });
      return;
    }

    const nuevoToken = Math.random().toString(36).substring(2, 10);

    const nuevaSolicitud: Partial<SolicitudTarjeta> = {
      userId: this.usuario.id,
      token: nuevoToken,
      estado: 'pendiente' as 'pendiente',
      fecha_Solicitud: new Date().toISOString(),
    };

    this.tarjetasService.createSolicitud(nuevaSolicitud).subscribe({
      next: (res) => {
        this.solicitud = res;
        this.dialog.open(DialogoMensaje, {
          data: {
            titulo: '✅ Solicitud reenviada',
            mensaje: 'Tu nueva solicitud ha sido enviada correctamente. Espera la revisión del sistema.',
          },
        });
      },
      error: (err) => {
        console.error('Error al reenviar solicitud:', err);
        this.dialog.open(DialogoMensaje, {
          data: {
            titulo: '❌ Error',
            mensaje: 'Ocurrió un problema al volver a solicitar la tarjeta. Inténtalo más tarde.',
          },
        });
      },
    });
  }

  generarQR(): void {
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
