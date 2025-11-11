import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appsettings } from '../Settings/appsettings';
import { SolicitudTarjeta } from '../Models/Solicitud';

@Injectable({
  providedIn: 'root'
})
export class TarjetasService {
  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'solicitudes-tarjeta';

  // 🔹 Obtener todas las solicitudes
  getSolicitudes(): Observable<SolicitudTarjeta[]> {
    return this.http.get<SolicitudTarjeta[]>(this.apiUrl);
  }

  // 🔹 Obtener una solicitud por ID
  getSolicitudById(id: number): Observable<SolicitudTarjeta> {
    return this.http.get<SolicitudTarjeta>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Crear una nueva solicitud
  createSolicitud(solicitud: SolicitudTarjeta): Observable<SolicitudTarjeta> {
    return this.http.post<SolicitudTarjeta>(this.apiUrl, solicitud);
  }

  // 🔹 Actualizar una solicitud existente
  updateSolicitud(id: number, solicitud: SolicitudTarjeta): Observable<SolicitudTarjeta> {
    return this.http.put<SolicitudTarjeta>(`${this.apiUrl}/${id}`, solicitud);
  }

  // 🔹 Eliminar una solicitud
  deleteSolicitud(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
