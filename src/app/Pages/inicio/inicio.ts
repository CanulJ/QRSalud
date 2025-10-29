import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { DatosMedicosService } from '../../Services/datos-medicos.service';
import { DatosMedicos } from '../../Models/DatosMedicos';
import { historiaClinicaService } from '../../Services/historia-clinica.service';
import { Navegacion } from '../navegacion/navegacion';
import { QRService } from '../../Services/qrs.service';
import { QRCodigos } from '../../Models/QRModels';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, MatBottomSheetModule, Navegacion],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class Inicio implements OnInit {

  usuario: any = null;
  datosMedicos: DatosMedicos | null = null;
  qrGenerado: QRCodigos | null = null; // Para almacenar QR generado

  private router = inject(Router);
  private datosMedicosService = inject(DatosMedicosService);
  private bottomSheet = inject(MatBottomSheet);
  private historiaClinicaService = inject(historiaClinicaService);
  private qrService = inject(QRService);

  ngOnInit(): void {
    const usuarioData = sessionStorage.getItem('usuario');
    if (usuarioData) {
      this.usuario = JSON.parse(usuarioData);

      const userId = this.usuario.id;
      if (!userId) {
        console.error('No se encontró un ID válido para el usuario', this.usuario);
        return;
      }

      this.datosMedicosService.obtenerPorUsuario(userId).subscribe({
        next: (datos) => {
          this.datosMedicos = datos.length > 0 ? datos[0] : null;
        },
        error: (err) => console.error('Error al obtener datos médicos', err)
      });

      // Opcional: cargar QR existente si ya hay uno
      this.qrService.obtenerPorUsuario(userId).subscribe({
        next: (qrs) => {
          if (qrs.length > 0) {
            this.qrGenerado = qrs[0]; // toma el más reciente
          }
        },
        error: (err) => console.warn('No hay QR generado aún', err)
      });
    }
  }

  generarQR(): void {
    if (!this.usuario?.id) {
      console.error('Usuario no definido');
      return;
    }

    const tokenSeguro = this.generarToken();
    const datos = { userid: this.usuario.id, urlqrcode: tokenSeguro };

    this.qrService.crearQR(datos).subscribe({
      next: (qr) => {
        console.log('QR generado:', qr);
        this.qrGenerado = qr; // almacenar para mostrarlo en la tarjeta
        alert(`Se generó la URL segura para la tarjeta: ${qr.urlqrcode}`);
      },
      error: (err) => console.error('Error al generar QR', err)
    });
  }

  // Método privado para generar token/URL segura
  private generarToken(): string {
    const randomToken = Math.random().toString(36).substring(2, 10); // 8 caracteres
    return `https://tuapp.com/acceso/${randomToken}`;
  }
}
