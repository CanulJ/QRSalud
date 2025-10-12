import { Routes } from '@angular/router';
import { Login } from './Pages/login/login';

export const routes: Routes = [

     { path: '', component: Login },
  { path: 'login', component: Login},
  { path: 'login/Id', component: Login }

];
