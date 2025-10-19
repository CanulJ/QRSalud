import { Routes } from '@angular/router';
import { Login } from './Pages/login/login';
import { Inicio } from './Pages/inicio/inicio';
import { Registro } from './Pages/registro/registro';
import { DatosMedicos1 } from './Pages/datos-medicos/datos-medicos1';
import { HistoriaClinica1 } from './Pages/historia-clinica/historia-clinica1';

export const routes: Routes = [

    { path: '', component: Login },
  { path: 'login', component: Login},
  { path: 'login/Id', component: Login },

  { path: '', component: Inicio },
  { path: 'inicio', component: Inicio},
  { path: 'inicio/Id', component: Inicio },
  { path: 'registro', component: Registro},

  { path: '', component: DatosMedicos1 },
  { path: 'login', component: DatosMedicos1},
  { path: 'login/Id', component: DatosMedicos1 },

  { path: '', component: HistoriaClinica1 },
  { path: 'login', component: HistoriaClinica1},
  { path: 'login/Id', component: HistoriaClinica1 },


];
