import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes))
  ]
};

// 👇 Esta es la configuración final que usas en main.server.ts
export const config = mergeApplicationConfig(appConfig, serverConfig);

// 👇 Esta función le dice a Angular qué rutas prerenderar
export function getPrerenderRoutes() {
  return [
    '/', '/login', '/inicio', '/registro',
    '/datos-medicos1', '/historia-clinica1',
    '/navegacion', '/tabla-medica', '/antecedentes-h',
    '/qrp'
    // ❌ NO incluyas '/acceso/:token'
  ];
}
