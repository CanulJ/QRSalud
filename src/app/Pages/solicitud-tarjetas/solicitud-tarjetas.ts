import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { TarjetasService } from '../../Services/tarjetas-s.service';
import { SolicitudTarjeta } from '../../Models/Solicitud';
import { QRService } from '../../Services/qrs.service';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-solicitud-tarjetas',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  templateUrl: './solicitud-tarjetas.html',
  styleUrls: ['./solicitud-tarjetas.css'],
})
export class SolicitudTarjetasComponent implements OnInit {
  solicitudes: SolicitudTarjeta[] = [];
  cargando = true;
  error = '';

  displayedColumns = ['idSolicitud', 'userId', 'estado', 'fecha_Solicitud', 'token', 'qr', 'acciones'];

  constructor(
    private tarjetasService: TarjetasService,
    private qrService: QRService,
    private cdr: ChangeDetectorRef // <-- Importamos ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerSolicitudes();
  }

  obtenerSolicitudes() {
  this.tarjetasService.getSolicitudes().subscribe({
    next: (data) => {
      this.solicitudes = data;

      // Para cada solicitud aprobada con token, generamos el QR
      this.solicitudes.forEach(solicitud => {
        if (solicitud.estado === 'aprobada' && (solicitud as any).token) {
          const urlAcceso = `https://qrtests.netlify.app/acceso/${(solicitud as any).token}`;
          QRCode.toDataURL(urlAcceso)
            .then(url => (solicitud as any).qrDataURL = url)
            .catch(err => console.error('Error generando QR:', err));
        }
      });

      this.cargando = false;
    },
    error: (err) => {
      console.error('Error al cargar solicitudes:', err);
      this.error = 'No se pudieron cargar las solicitudes.';
      this.cargando = false;
    },
  });
}


  aprobarSolicitud(solicitud: SolicitudTarjeta) {
    if (!solicitud.idSolicitud) return;

    const tokenSeguro = (solicitud as any).token || Math.random().toString(36).substring(2, 10);
    const urlAcceso = `https://qrtests.netlify.app/acceso/${tokenSeguro}`;

    // Generamos QR y forzamos Angular a actualizar la vista
    QRCode.toDataURL(urlAcceso)
      .then(url => {
        (solicitud as any).qrDataURL = url;
        this.cdr.detectChanges(); // <-- Forzamos actualización de la vista
      })
      .catch(err => console.error('Error al generar QR:', err));

    const nuevoQR = { userid: solicitud.userId, urlqrcode: tokenSeguro, estado: 'activo', fechacreacion: new Date() };

    this.qrService.crearQR(nuevoQR).subscribe({
      next: (qrCreado) => {
        const solicitudActualizada: SolicitudTarjeta = {
          ...solicitud,
          estado: 'aprobada',
          qrId: qrCreado.idqr,
          fecha_Revision: new Date().toISOString()
        };

        this.tarjetasService.updateSolicitud(solicitud.idSolicitud!, solicitudActualizada).subscribe({
          next: () => {
            solicitud.estado = 'aprobada';
            solicitud.qrId = qrCreado.idqr;
            solicitud.fecha_Revision = solicitudActualizada.fecha_Revision;
            (solicitud as any).token = tokenSeguro;
          },
          error: (err) => console.error('Error al actualizar solicitud:', err)
        });
      },
      error: (err) => console.error('Error al crear QR:', err)
    });
  }

  rechazarSolicitud(solicitud: SolicitudTarjeta) {
    if (!solicitud.idSolicitud) return;

    if ((solicitud as any).qrId) {
      this.qrService.eliminarQR((solicitud as any).qrId).subscribe({
        next: () => {
          console.log('QR eliminado correctamente.');
          this.actualizarSolicitudRechazada(solicitud);
        },
        error: (err) => {
          console.error('Error al eliminar QR:', err);
          this.actualizarSolicitudRechazada(solicitud);
        }
      });
    } else {
      this.actualizarSolicitudRechazada(solicitud);
    }
  }

  private actualizarSolicitudRechazada(solicitud: SolicitudTarjeta) {
    const solicitudActualizada: SolicitudTarjeta = {
      ...solicitud,
      estado: 'rechazada',
      qrId: null,
      fecha_Revision: new Date().toISOString()
    };

    this.tarjetasService.updateSolicitud(solicitud.idSolicitud!, solicitudActualizada).subscribe({
      next: () => {
        solicitud.estado = 'rechazada';
        solicitud.qrId = null;
        console.log('Solicitud rechazada y actualizada correctamente.');
      },
      error: (err) => console.error('Error al rechazar solicitud:', err)
    });
  }
}
