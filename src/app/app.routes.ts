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
  // Ruta principal (Login)
  { path: '', component: Login },
  { path: 'login', component: Login },

  // Registro
  { path: 'registro', component: Registro },

  // Inicio
  { path: 'inicio', component: Inicio },
  { path: 'inicio/:id', component: Inicio },

  // Datos médicos
  { path: 'datos-medicos1', component: DatosMedicos1 },
  { path: 'datos-medicos1/:id', component: DatosMedicos1 },

  // Historia clínica
  { path: 'historia-clinica1', component: HistoriaClinica1 },
  { path: 'historia-clinica1/:id', component: HistoriaClinica1 },

  // Navegación
  { path: 'navegacion', component: Navegacion },
  { path: 'navegacion/:id', component: Navegacion },

  // Tabla médica
  { path: 'tabla-medica', component: TablaMedica },
  { path: 'tabla-medica/:id', component: TablaMedica },

  // Antecedentes
  { path: 'antecedentes-h', component: AntecedentesH },
  { path: 'antecedentes-h/:id', component: AntecedentesH },

  // QR
  { path: 'qrp', component: QRP },
  { path: 'qrp/:id', component: QRP },

  // Ruta dinámica de acceso QR (client-only)
  { 
    path: 'acceso/:token', 
    component: QRP,
    data: { renderMode: 'client-only' }
  },

  // Fallback para cualquier otra ruta
  { path: '**', redirectTo: '' }
];
