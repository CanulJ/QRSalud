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

  // 🔹 Listar todos los QR
  listar(): Observable<QRCodigos[]> {
    return this.http.get<QRCodigos[]>(this.apiUrl);
  }

  // 🔹 Obtener QR por ID
  obtenerPorId(idqr: number): Observable<QRCodigos> {
    return this.http.get<QRCodigos>(`${this.apiUrl}/${idqr}`);
  }

  // 🔹 Obtener QR por usuario
  obtenerPorUsuario(userid: number): Observable<QRCodigos[]> {
    return this.http.get<QRCodigos[]>(`${this.apiUrl}/usuario/${userid}`);
  }

  // 🔹 Crear QR con UID NFC opcional
  crearQR(data: { userid: number; urlqrcode: string; estado?: string; nfc_uid?: string }): Observable<QRCodigos> {
    return this.http.post<QRCodigos>(this.apiUrl, data);
  }

  // 🔹 Actualizar QR
  actualizarQR(idqr: number, data: Partial<QRCodigos>): Observable<QRCodigos> {
    return this.http.put<QRCodigos>(`${this.apiUrl}/${idqr}`, data);
  }

  // 🔹 Eliminar QR
  eliminarQR(idqr: number): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.apiUrl}/${idqr}`);
  }

  // 🔹 Obtener por token y UID de tarjeta NFC
  obtenerPorTokenYUID(token: string, nfc_uid: string): Observable<QRCodigos> {
    return this.http.post<QRCodigos>(`${this.apiUrl}/validar-nfc`, { token, nfc_uid });
  }
}
