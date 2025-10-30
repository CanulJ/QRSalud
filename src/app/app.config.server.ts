import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import {
  provideServerRendering,
  withRoutes,
  ServerRoute,
  RenderMode
} from '@angular/ssr';
import { appConfig } from './app.config';
import { routes } from './app.routes';

// ✅ Solo rutas con path definido y que no sean dinámicas
const filteredServerRoutes: ServerRoute[] = routes
  .filter((route): route is ServerRoute => {
    return (
      typeof route.path === 'string' &&
      route.path !== 'acceso/:token'
    );
  })
  .map(route => ({
    ...route,
    path: route.path!, // 👈 aseguramos que no sea undefined
    renderMode: RenderMode.Server
  }));

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(filteredServerRoutes))
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);

// ✅ Solo rutas estáticas para prerendering
export function getPrerenderConfig() {
  return {
    routes: [
      '/', '/login', '/inicio', '/registro',
      '/datos-medicos1', '/historia-clinica1',
      '/navegacion', '/tabla-medica', '/antecedentes-h',
      '/qrp'
    ]
  };
}
