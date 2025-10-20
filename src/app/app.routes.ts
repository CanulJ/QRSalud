import { Routes } from '@angular/router';
import { Login } from './Pages/login/login';
import { Inicio } from './Pages/inicio/inicio';
import { Registro } from './Pages/registro/registro';
import { DatosMedicos1 } from './Pages/datos-medicos/datos-medicos1';
import { HistoriaClinica1 } from './Pages/historia-clinica/historia-clinica1';
import { Navegacion } from './Pages/navegacion/navegacion';
import { TablaMedica } from './Pages/tabla-medica/tabla-medica';

export const routes: Routes = [

    { path: '', component: Login },
  { path: 'login', component: Login},
  { path: 'login/Id', component: Login },

  { path: '', component: Inicio },
  { path: 'inicio', component: Inicio},
  { path: 'inicio/Id', component: Inicio },
  { path: 'registro', component: Registro},

  { path: '', component: DatosMedicos1 },
  { path: 'datos-medicos1', component: DatosMedicos1},
  { path: 'datos-medicos1', component: DatosMedicos1 },

  { path: '', component: HistoriaClinica1 },
  { path: 'historia-clinica1', component: HistoriaClinica1},
  { path: 'historia-clinica1/id', component: HistoriaClinica1 },

  { path: '', component: Navegacion },
  { path: 'navegacion', component: Navegacion},
  { path: 'navegacion/id', component: Navegacion },

  { path: '', component: TablaMedica },
  { path: 'tabla-medica', component: TablaMedica},
  { path: 'tabla-medica/id', component: TablaMedica },

];
