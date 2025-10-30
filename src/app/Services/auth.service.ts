import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioSubject = new BehaviorSubject<number | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  setUsuario(id: number) {
    sessionStorage.setItem('usuario', JSON.stringify({ id }));
    this.usuarioSubject.next(id);
  }

  getUsuario() {
    const data = sessionStorage.getItem('usuario');
    if (data) {
      const usuario = JSON.parse(data);
      this.usuarioSubject.next(usuario.id);
      return usuario.id;
    }
    return null;
  }

  isLogged() {
    return !!this.getUsuario();
  }

  logout() {
    sessionStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }
}
