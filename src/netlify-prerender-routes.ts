import { getPrerenderRoutes } from '@netlify/angular-runtime';

export const prerenderRoutes = getPrerenderRoutes([
  '/',
  '/login',
  '/inicio',
  '/registro',
  '/datos-medicos1',
  '/historia-clinica1',
  '/navegacion',
  '/tabla-medica',
  '/antecedentes-h',
  '/qrp'
  // NOTA: NO incluir /acceso/:token aquí
]);
