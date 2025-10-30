import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QRService } from '../../Services/qrs.service';
import { AuthService } from '../../Services/auth.service';
import { QRCodigos } from '../../Models/QRModels';
declare var NDEFReader: any;

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

    // 🚀 Intentar leer la tarjeta NFC al abrir la URL
    this.leerTarjetaNFC(token);
  }

  async leerTarjetaNFC(token: string) {
    if (!('NDEFReader' in window)) {
      alert('Este dispositivo o navegador no soporta lectura NFC.');
      this.router.navigate(['/']);
      return;
    }

    try {
      const ndef = new NDEFReader();
      await ndef.scan();

      ndef.onreading = (event: any) => {
        const uid = event.serialNumber;
        console.log('UID detectado:', uid);

        // 🔥 Paso 2: Llamar al backend para verificar token + UID
        this.qrService.verificarTokenYUID(token, uid).subscribe({
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
            this.router.navigate(['/inicio']);
          },
          error: (err) => {
            console.error('Error al validar QR y NFC:', err);
            alert('Acceso denegado: tarjeta NFC o enlace inválido.');
            this.router.navigate(['/']);
          }
        });
      };
    } catch (error) {
      console.error('Error al iniciar lectura NFC:', error);
      alert('No se pudo acceder al lector NFC. Asegúrate de permitir el acceso.');
      this.router.navigate(['/']);
    }
  }
}
