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

  listar(): Observable<QRCodigos[]> {
    return this.http.get<QRCodigos[]>(this.apiUrl);
  }

  obtenerPorId(idqr: number): Observable<QRCodigos> {
    return this.http.get<QRCodigos>(`${this.apiUrl}/${idqr}`);
  }

  obtenerPorUsuario(userid: number): Observable<QRCodigos[]> {
    return this.http.get<QRCodigos[]>(`${this.apiUrl}/usuario/${userid}`);
  }

  crearQR(data: { userid: number; urlqrcode: string; estado?: string; nfc_uid?: string }): Observable<QRCodigos> {
    return this.http.post<QRCodigos>(this.apiUrl, data);
  }

  actualizarQR(idqr: number, data: Partial<QRCodigos>): Observable<QRCodigos> {
    return this.http.put<QRCodigos>(`${this.apiUrl}/${idqr}`, data);
  }

  eliminarQR(idqr: number): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.apiUrl}/${idqr}`);
  }

  obtenerPorToken(token: string): Observable<QRCodigos> {
    return this.http.get<QRCodigos>(`${this.apiUrl}/token/${token}`);
  }

}
