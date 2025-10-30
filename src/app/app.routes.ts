import { Routes } from '@angular/router';
import { Login } from './Pages/login/login';
import { Inicio } from './Pages/inicio/inicio';
import { Registro } from './Pages/registro/registro';
import { DatosMedicos1 } from './Pages/datos-medicos/datos-medicos1';
import { HistoriaClinica1 } from './Pages/historia-clinica/historia-clinica1';
import { Navegacion } from './Pages/navegacion/navegacion';
import { TablaMedica } from './Pages/tabla-medica/tabla-medica';
import { AntecedentesH } from './Pages/antecedentes-h/antecedentes-h';
import { QRP } from './Pages/qrp/qrp';

export const routes: Routes = [
  // Rutas normales
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'inicio', component: Inicio },
  { path: 'registro', component: Registro },
  { path: 'datos-medicos1', component: DatosMedicos1 },
  { path: 'historia-clinica1', component: HistoriaClinica1 },
  { path: 'navegacion', component: Navegacion },
  { path: 'tabla-medica', component: TablaMedica },
  { path: 'antecedentes-h', component: AntecedentesH },
  { path: 'qrp', component: QRP },

  // Rutas dinámicas → client-only para evitar prerender
  { path: 'login/:id', component: Login, data: { renderMode: 'client-only' } },
  { path: 'inicio/:id', component: Inicio, data: { renderMode: 'client-only' } },
  { path: 'datos-medicos1/:id', component: DatosMedicos1, data: { renderMode: 'client-only' } },
  { path: 'historia-clinica1/:id', component: HistoriaClinica1, data: { renderMode: 'client-only' } },
  { path: 'navegacion/:id', component: Navegacion, data: { renderMode: 'client-only' } },
  { path: 'tabla-medica/:id', component: TablaMedica, data: { renderMode: 'client-only' } },
  { path: 'antecedentes-h/:id', component: AntecedentesH, data: { renderMode: 'client-only' } },
  { path: 'qrp/:id', component: QRP, data: { renderMode: 'client-only' } },

  // Ruta de token
  { path: 'acceso/:token', component: QRP, data: { renderMode: 'client-only' } }
];
