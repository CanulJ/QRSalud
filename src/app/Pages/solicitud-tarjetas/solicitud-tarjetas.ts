import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { TarjetasService } from '../../Services/tarjetas-s.service';
import { SolicitudTarjeta } from '../../Models/Solicitud';
import { QRService } from '../../Services/qrs.service';
import { QRCodigos } from '../../Models/QRModels';

@Component({
  selector: 'app-solicitud-tarjetas',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './solicitud-tarjetas.html',
  styleUrls: ['./solicitud-tarjetas.css'],
})
export class SolicitudTarjetasComponent implements OnInit {
  solicitudes: SolicitudTarjeta[] = [];
  cargando = true;
  error = '';

  // Columnas visibles, agregué "token" para mostrarlo
  displayedColumns = ['idSolicitud', 'userId', 'estado', 'fecha_Solicitud', 'token', 'acciones'];

  constructor(
    private tarjetasService: TarjetasService,
    private qrService: QRService
  ) {}

  ngOnInit(): void {
    this.obtenerSolicitudes();
  }

  obtenerSolicitudes() {
    this.tarjetasService.getSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data;
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

    // 🔹 Si la solicitud ya tiene token, lo usamos para crear el QR
    const tokenSeguro = (solicitud as any).token || Math.random().toString(36).substring(2, 10);

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
            // Guardamos token para mostrarlo en la tabla
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

    const solicitudActualizada: SolicitudTarjeta = {
      ...solicitud,
      estado: 'rechazada'
    };

    this.tarjetasService.updateSolicitud(solicitud.idSolicitud, solicitudActualizada).subscribe({
      next: () => solicitud.estado = 'rechazada',
      error: (err) => console.error('Error al rechazar solicitud:', err)
    });
  }

  

}
