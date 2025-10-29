import { Routes } from '@angular/router';

// Importaciones de tus páginas
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

  // 🚪 Redirección inicial
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 🔐 Autenticación
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },

  // 🏠 Páginas principales
  { path: 'inicio', component: Inicio },
  { path: 'navegacion', component: Navegacion },

  // 📋 Módulos médicos
  { path: 'datos-medicos1', component: DatosMedicos1 },
  { path: 'historia-clinica1', component: HistoriaClinica1 },
  { path: 'tabla-medica', component: TablaMedica },
  { path: 'antecedentes-h', component: AntecedentesH },

  // 🧾 QR principal
  { path: 'qrp', component: QRP },

  // 🎫 Acceso mediante token (lectura QR con SSR)
  {
    path: 'acceso/:token',
    loadComponent: () => import('./Pages/qrp/qrp').then(m => m.QRP),
    data: {
      renderMode: 'server' // 👈 Renderiza al vuelo en Netlify SSR o Angular Universal
    }
  },

  // ⚠️ Fallback (ruta no encontrada)
  { path: '**', redirectTo: 'login' }
];
