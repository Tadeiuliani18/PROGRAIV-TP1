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
            loadComponent: () => import('./pages/home/home').then(m => m.Home)

        },
        {
            path: 'home',
            loadComponent: () => import('./pages/home/home').then(m => m.Home),
        },
        {
            path: 'login',
            loadComponent: () => import('./pages/login/login').then(m => m.Login),
            canActivate: [NoAuthGuard]
        },
        {
            path: 'registro',
            loadComponent: () => import('./pages/registro/registro').then(m => m.Registro),
            canActivate: [NoAuthGuard]
        },
        {
            path: 'foro',
            loadComponent: () => import('./pages/foro/foro').then(m => m.Foro),
            canActivate: [AuthGuard]
        },
        {
            path: 'quien-soy',
            loadComponent: () => import('./pages/quien-soy/quien-soy').then(m => m.QuienSoy),
            canActivate: [AuthGuard]
        },
        {
            path: 'games',
            loadChildren: () => import('./games/games.module').then(m => m.GamesModule)
        },
         
        {
            path: '**',
            redirectTo: ''
        }
    ];


