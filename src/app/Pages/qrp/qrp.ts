import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QRService } from '../../Services/qrs.service';
import { AuthService } from '../../Services/auth.service';
import { QRCodigos } from '../../Models/QRModels';

@Component({
  selector: 'app-qrp',
  templateUrl: './qrp.html',
  styleUrl: './qrp.css'
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

    if (token) {
      this.qrService.obtenerPorToken(token).subscribe({
        next: (qr) => {
          if (!qr || !qr.usuario) {
            alert('Token inválido o expirado');
            this.router.navigate(['/']);
            return;
          }

          // 👇 Guardamos datos del usuario (lo que tú ya tenías)
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

          // 🟦 NUEVO: bandera que indica acceso mediante token
          sessionStorage.setItem('accesoPorToken', 'true');

          // 🟦 OPCIONAL: asegurar que no venga desbloqueado desde antes
          sessionStorage.removeItem('edicionDesbloqueada');

          this.router.navigate(['/inicio']);
        },
        error: (err) => {
          console.error('Error al validar el token', err);
          this.router.navigate(['/']);
        }
      });
    }
  }
}
