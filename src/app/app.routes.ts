import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { QuienSoy } from './pages/quien-soy/quien-soy';
import { Foro } from './pages/foro/foro';

export const routes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: 'home',
        component: Home
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'registro',
        component: Registro
    },
    {
        path: 'foro',
        component: Foro
    },
    {
        path: 'quien-soy',
        component: QuienSoy
    },
    {
        path: '**',
        redirectTo: ''
    }
];
