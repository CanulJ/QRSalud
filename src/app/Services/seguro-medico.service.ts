import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SeguroMedico } from '../Models/SeguroMedicoM';
import { appsettings } from '../Settings/appsettings';


@Injectable({
  providedIn: 'root'
})
export class SeguroMedicosService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'seguromedico';

  constructor() { }

  // Obtener todos los seguros médicos
  Lista(): Observable<SeguroMedico[]> {
    return this.http.get<SeguroMedico[]>(this.apiUrl);
  }

  // Obtener todos (alternativa semántica)
  obtenerSeguros(): Observable<SeguroMedico[]> {
    return this.http.get<SeguroMedico[]>(this.apiUrl);
  }

  // Obtener un seguro por ID
  obtenerSeguro(id: number): Observable<SeguroMedico> {
    return this.http.get<SeguroMedico>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo seguro médico
  crearSeguro(seguro: SeguroMedico): Observable<SeguroMedico> {
    return this.http.post<SeguroMedico>(this.apiUrl, seguro);
  }

  // Actualizar un seguro médico existente
  actualizarSeguro(id: number, seguro: SeguroMedico): Observable<SeguroMedico> {
    return this.http.put<SeguroMedico>(`${this.apiUrl}/${id}`, seguro);
  }

  // Eliminar un seguro médico por ID
  eliminarSeguro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerPorUsuario(datosmedicosid: number): Observable<SeguroMedico[]> {
  return this.http.get<SeguroMedico[]>(`${this.apiUrl}/usuario/${datosmedicosid}`);
}


}
