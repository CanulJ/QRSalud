import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuarios } from '../Models/Usuarios';
import { appsettings } from '../Settings/appsettings';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'usuarios';

  constructor() { }

Lista(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(this.apiUrl);
  }

 obtenerUsuarios(): Observable<Usuarios[]> {
  return this.http.get<Usuarios[]>(this.apiUrl);
}

obtenerUsuario(id: number): Observable<Usuarios> {
  return this.http.get<Usuarios>(`${this.apiUrl}/${id}`);
}

crearUsuario(usuario: Usuarios): Observable<Usuarios> {
  return this.http.post<Usuarios>(this.apiUrl, usuario);
}

actualizarUsuario(id: number, usuario: Usuarios): Observable<Usuarios> {
  return this.http.put<Usuarios>(`${this.apiUrl}/${id}`, usuario);
}

eliminarUsuario(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
}