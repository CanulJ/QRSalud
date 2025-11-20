import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QRCodigos } from '../Models/QRModels';
import { appsettings } from '../Settings/appsettings';

@Injectable({
  providedIn: 'root'
})
export class QRService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'qrcodigos';

  constructor() { }

  // Traer todos los códigos QR
  listar(): Observable<QRCodigos[]> {
    return this.http.get<QRCodigos[]>(this.apiUrl);
  }

  // Traer un código QR por su id
  obtenerPorId(idqr: number): Observable<QRCodigos> {
    return this.http.get<QRCodigos>(`${this.apiUrl}/${idqr}`);
  }

  // Traer códigos QR de un usuario
  obtenerPorUsuario(userid: number): Observable<QRCodigos[]> {
    return this.http.get<QRCodigos[]>(`${this.apiUrl}/usuario/${userid}`);
  }

  // Crear un nuevo código QR
  crearQR(data: { userid: number; urlqrcode: string; estado?: string }): Observable<QRCodigos> {
    return this.http.post<QRCodigos>(this.apiUrl, data);
  }

  // Actualizar un código QR existente
  actualizarQR(idqr: number, data: Partial<QRCodigos>): Observable<QRCodigos> {
    return this.http.put<QRCodigos>(`${this.apiUrl}/${idqr}`, data);
  }

  // Eliminar un código QR
  eliminarQR(idqr: number): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.apiUrl}/${idqr}`);
  }

  obtenerPorToken(token: string) {
    return this.http.get<QRCodigos>(`${this.apiUrl}/token/${token}`);
  }

  loginConQR(tokenQr: string) {
  return this.http.post<any>(`${this.apiUrl}/login-qr`, { tokenQr });
}


}
