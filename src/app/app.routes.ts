import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { QuienSoy } from './pages/quien-soy/quien-soy';
import { Foro } from './pages/foro/foro';
import { AuthGuard } from './guards/auth-guard';
import { NoAuthGuard } from './guards/no-auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: Home,

    },
    {
        path: 'home',
        component: Home,
    },
    {
        path: 'login',
        component: Login,
        canActivate: [NoAuthGuard]
    },
    {
        path: 'registro',
        component: Registro,
        canActivate: [NoAuthGuard]
    },
    {
        path: 'foro',
        component: Foro,
        canActivate: [AuthGuard]
    },
    {
        path: 'quien-soy',
        component: QuienSoy,
        canActivate: [AuthGuard]
    },
    {
        path: 'games',
        loadChildren: () => import('./games/games.module').then(m => m.GamesModule)
    },
    {
        path: 'mayor-menor',
        redirectTo: '/games/mayor-menor',
        pathMatch: 'full'
    },
    {
        path: 'ahorcado',
        redirectTo: '/games/ahorcado',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: ''
    }
];


