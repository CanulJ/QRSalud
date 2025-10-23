import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { Observable } from 'rxjs';
import { HistoriaClinica } from '../Models/HistoriaClinica';

@Injectable({
  providedIn: 'root'
})
export class historiaClinicaService {
  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'historiaclinica'; // Ajusta según tu endpoint

  constructor() { }

  // Obtener todos los registros de historia clínica
  listar(): Observable<HistoriaClinica[]> {
    return this.http.get<HistoriaClinica[]>(this.apiUrl);
  }

  // Obtener todas las historias clínicas de un registro médico específico
  obtenerPorDatosMedicos(datosMedicosid: number): Observable<HistoriaClinica[]> {
    return this.http.get<HistoriaClinica[]>(`${this.apiUrl}/datosmedicos/${datosMedicosid}`);
  }

  // Crear un registro de historia clínica
  crear(historia: HistoriaClinica): Observable<HistoriaClinica> {
    return this.http.post<HistoriaClinica>(this.apiUrl, historia);
  }

  // Actualizar un registro existente
  actualizar(id: number, historia: HistoriaClinica): Observable<HistoriaClinica> {
    return this.http.put<HistoriaClinica>(`${this.apiUrl}/${id}`, historia);
  }

  // Eliminar un registro
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerPorUsuario(usuarioId: number): Observable<HistoriaClinica[]> {
    return this.http.get<HistoriaClinica[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

}
