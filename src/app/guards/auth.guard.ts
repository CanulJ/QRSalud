import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const usuario = sessionStorage.getItem('usuario');

    if (!usuario) {
      this.router.navigate(['/acceso-denegado']);
      return false;
    }

    return true;
  }
}
