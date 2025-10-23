import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { Observable } from 'rxjs';
import { Antecedentes } from '../Models/Antecedentes';

@Injectable({
  providedIn: 'root'
})
export class antecedentesService {
  
 private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'antecedentes'; // ajusta según tu endpoint

constructor() { }

  // Obtener todos los antecedentes
  listar(): Observable<Antecedentes[]> {
    return this.http.get<Antecedentes[]>(this.apiUrl);
  }

  // Obtener antecedentes de una historia clínica específica
  obtenerPorHistoria(idHistoria: number): Observable<Antecedentes[]> {
    return this.http.get<Antecedentes[]>(`${this.apiUrl}/historia/${idHistoria}`);
  }

  // Crear un nuevo antecedente
  crear(antecedente: Antecedentes): Observable<Antecedentes> {
    return this.http.post<Antecedentes>(this.apiUrl, antecedente);
  }

  // Actualizar un antecedente existente
  actualizar(id: number, antecedente: Antecedentes): Observable<Antecedentes> {
    return this.http.put<Antecedentes>(`${this.apiUrl}/${id}`, antecedente);
  }

  // Eliminar un antecedente
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
