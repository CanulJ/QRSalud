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

  // Login
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'login/Id', component: Login },

  // Inicio
  { path: 'inicio', component: Inicio },
  { path: 'inicio/Id', component: Inicio },

  // Registro
  { path: 'registro', component: Registro },

  // Datos Médicos
  { path: 'datos-medicos1', component: DatosMedicos1 },

  // Historia Clínica
  { path: 'historia-clinica1', component: HistoriaClinica1 },
  { path: 'historia-clinica1/id', component: HistoriaClinica1 },

  // Navegación
  { path: 'navegacion', component: Navegacion },
  { path: 'navegacion/id', component: Navegacion },

  // Tabla Médica
  { path: 'tabla-medica', component: TablaMedica },
  { path: 'tabla-medica/id', component: TablaMedica },

  // Antecedentes
  { path: 'antecedentes-h', component: AntecedentesH },
  { path: 'antecedentes-h/id', component: AntecedentesH },

  // QRP
  { path: 'qrp', component: QRP },
  { path: 'qrp/id', component: QRP },

  // Ruta para QR dinámico
  {
    path: 'acceso/:token',
    component: QRP,
    data: {
      renderMode: 'server' // se renderiza al vuelo, permite usar token dinámico
    }
  },

  // Redirección por si la ruta no existe
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
