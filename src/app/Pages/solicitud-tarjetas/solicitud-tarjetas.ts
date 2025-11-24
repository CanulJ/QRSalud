import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './solicitud-tarjetas.html',
  styleUrls: ['./solicitud-tarjetas.css'],
})
export class SolicitudTarjetasComponent implements OnInit {

  dataSource = new MatTableDataSource<SolicitudTarjeta>([]);
  solicitudes: SolicitudTarjeta[] = [];
  cargando = true;
  error = '';

  filtroEstado = '';
  filtroTexto = '';

  displayedColumns = [
    'idSolicitud',
    'userId',
    'estado',
    'fecha_Solicitud',
    'token',
    'qr',
    'acciones'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tarjetasService: TarjetasService,
    private qrService: QRService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerSolicitudes();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  obtenerSolicitudes() {
    this.tarjetasService.getSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.dataSource.data = data;

        // Generación de QR
        this.solicitudes.forEach(solicitud => {
          if (solicitud.estado === 'aprobada' && (solicitud as any).token) {
            const urlAcceso = `https://qrtests.netlify.app/acceso/${(solicitud as any).token}`;
            QRCode.toDataURL(urlAcceso)
              .then(url => (solicitud as any).qrDataURL = url)
              .catch(err => console.error('Error generando QR:', err));
          }
        });

        this.aplicarFiltros();
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las solicitudes.';
        this.cargando = false;
      }
    });
  }

  // 🔍 Filtro general
  applyFilter(event: Event) {
    this.filtroTexto = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.aplicarFiltros();
  }

  // 🎚️ Filtro por estado
  filtrarPorEstado(estado: string) {
    this.filtroEstado = estado;
    this.aplicarFiltros();
  }

  // 👉 Extrae solo números
  private onlyDigits(str: string): string {
    return str.replace(/\D/g, '');
  }

  // 🧠 Combinación de filtros
  aplicarFiltros() {
    const txt = this.filtroTexto.toLowerCase();
    const txtDigits = this.onlyDigits(txt);

    this.dataSource.data = this.solicitudes.filter(s => {

      const idMatch = s.idSolicitud?.toString().includes(txt);
      const userMatch = s.userId?.toString().includes(txt);
      const estadoMatch = s.estado?.toLowerCase().includes(txt);

      // --- Variantes de fecha ---
      const fecha = s.fecha_Solicitud?.toString() ?? '';
      const f = new Date(fecha);

      const day = f.getDate().toString().padStart(2, '0');
      const month = (f.getMonth() + 1).toString().padStart(2, '0');
      const year = f.getFullYear().toString();
      const shortYear = year.slice(-2);

      const fechaVariants = [
        `${day}/${month}/${year}`,
        `${day}/${month}/${shortYear}`,
        `${month}/${day}/${year}`,
        `${month}/${day}/${shortYear}`,
        `${year}-${month}-${day}`,
        fecha.toLowerCase()
      ];

      const fechaMatchText = fechaVariants.some(v => v.toLowerCase().includes(txt));

      const fechaMatchDigits = txtDigits
        ? fechaVariants.some(v => this.onlyDigits(v).includes(txtDigits))
        : false;

      const fechaMatchPrefix =
        txt.endsWith('/') &&
        fechaVariants.some(v =>
          v.toLowerCase().startsWith(txt.replace('/', ''))
        );

      const coincideTexto =
        idMatch ||
        userMatch ||
        estadoMatch ||
        fechaMatchText ||
        fechaMatchDigits ||
        fechaMatchPrefix;

      const coincideEstado =
        this.filtroEstado === '' || s.estado === this.filtroEstado;

      return coincideTexto && coincideEstado;
    });

    if (this.paginator) this.paginator.firstPage();
  }

  aprobarSolicitud(solicitud: SolicitudTarjeta) {
    if (!solicitud.idSolicitud) return;

    const tokenSeguro =
      (solicitud as any).token ||
      Math.random().toString(36).substring(2, 10);

    const urlAcceso = `https://qrtests.netlify.app/acceso/${tokenSeguro}`;

    QRCode.toDataURL(urlAcceso).then(url => {
      (solicitud as any).qrDataURL = url;
      this.cdr.detectChanges();
    });

    const nuevoQR = {
      userid: solicitud.userId,
      urlqrcode: tokenSeguro,
      estado: 'activo',
      fechacreacion: new Date(),
    };

    this.qrService.crearQR(nuevoQR).subscribe({
      next: (qrCreado) => {
        const solicitudActualizada: SolicitudTarjeta = {
          ...solicitud,
          estado: 'aprobada',
          qrId: qrCreado.idqr,
          fecha_Revision: new Date().toISOString(),
        };

        this.tarjetasService
          .updateSolicitud(solicitud.idSolicitud!, solicitudActualizada)
          .subscribe({
            next: () => {
              solicitud.estado = 'aprobada';
              solicitud.qrId = qrCreado.idqr;
              solicitud.fecha_Revision = solicitudActualizada.fecha_Revision;
              (solicitud as any).token = tokenSeguro;

              this.aplicarFiltros();
            },
          });
      },
    });
  }

  rechazarSolicitud(solicitud: SolicitudTarjeta) {
    if (!solicitud.idSolicitud) return;

    if ((solicitud as any).qrId) {
      this.qrService.eliminarQR((solicitud as any).qrId).subscribe({
        next: () => this.actualizarSolicitudRechazada(solicitud),
        error: () => this.actualizarSolicitudRechazada(solicitud),
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
      fecha_Revision: new Date().toISOString(),
    };

    this.tarjetasService
      .updateSolicitud(solicitud.idSolicitud!, solicitudActualizada)
      .subscribe({
        next: () => {
          solicitud.estado = 'rechazada';
          solicitud.qrId = null;
          this.aplicarFiltros();
        },
      });
  }

  // 👉 NUEVO: soporte para “reportar pérdida” si lo agregas en futuro
  reportarPerdida(solicitud: SolicitudTarjeta) {
    if (!solicitud.idSolicitud) return;

    const solicitudActualizada: Partial<SolicitudTarjeta> = {
  estado: "reportada" as const,
  fecha_Revision: new Date().toISOString()
};


    this.tarjetasService
      .updateSolicitud(solicitud.idSolicitud, solicitudActualizada)
      .subscribe(() => {
        solicitud.estado = 'reportada';
        this.aplicarFiltros();
      });
  }

  cerrarSesion() {
    sessionStorage.clear();
    window.location.href = '/login';
  }

}
