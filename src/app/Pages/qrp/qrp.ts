import { Component, inject, OnInit } from '@angular/core';
import { QRService } from '../../Services/qrs.service';
import { QRCodigos } from '../../Models/QRModels';

@Component({
  selector: 'app-qrp',
  imports: [],
  templateUrl: './qrp.html',
  styleUrl: './qrp.css'
})
export class QRP implements OnInit {

  private qrService = inject(QRService);

  qrUsuario: QRCodigos[] = [];
  usuarioId: number | null = null; // Este lo podrías obtener al leer la tarjeta NFC

  ngOnInit(): void {
    // Si ya tienes el ID del usuario desde la tarjeta
    if (this.usuarioId) {
      this.cargarQRs(this.usuarioId);
    }
  }

  cargarQRs(userid: number) {
    this.qrService.obtenerPorUsuario(userid).subscribe({
      next: (data) => this.qrUsuario = data,
      error: (err) => console.error('Error al cargar códigos QR del usuario', err)
    });
  }
}