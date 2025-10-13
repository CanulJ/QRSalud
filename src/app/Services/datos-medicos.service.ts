import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatosMedicos } from '../Models/DatosMedicos';
import { appsettings } from '../Settings/appsettings';

@Injectable({
  providedIn: 'root'
})
export class DatosMedicosService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'datosmedicos'; // ajusta según tu endpoint

  constructor() { }

  // Obtener todos los registros de datos médicos
  listar(): Observable<DatosMedicos[]> {
    return this.http.get<DatosMedicos[]>(this.apiUrl);
  }

  // Obtener los datos médicos de un usuario específico
  obtenerPorUsuario(id_usuario: number): Observable<DatosMedicos[]> {
    return this.http.get<DatosMedicos[]>(`${this.apiUrl}/usuario/${id_usuario}`);
  }

  // Crear un registro de datos médicos
  crear(datosMedicos: DatosMedicos): Observable<DatosMedicos> {
    return this.http.post<DatosMedicos>(this.apiUrl, datosMedicos);
  }

  // Actualizar un registro existente
  actualizar(id: number, datosMedicos: DatosMedicos): Observable<DatosMedicos> {
    return this.http.put<DatosMedicos>(`${this.apiUrl}/${id}`, datosMedicos);
  }

  // Eliminar un registro
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
