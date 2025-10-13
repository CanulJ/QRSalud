import { Routes } from '@angular/router';
import { Login } from './Pages/login/login';
import { Inicio } from './Pages/inicio/inicio';
import { Registro } from './Pages/registro/registro';
import { DatosMedicos } from './Pages/datos-medicos/datos-medicos';

export const routes: Routes = [

    { path: '', component: Login },
  { path: 'login', component: Login},
  { path: 'login/Id', component: Login },

  { path: '', component: Inicio },
  { path: 'inicio', component: Inicio},
  { path: 'inicio/Id', component: Inicio },
  { path: 'registro', component: Registro},

  { path: '', component: DatosMedicos },
  { path: 'login', component: DatosMedicos},
  { path: 'login/Id', component: DatosMedicos },


];
