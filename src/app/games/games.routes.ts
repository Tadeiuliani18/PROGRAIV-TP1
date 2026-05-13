import { Routes } from '@angular/router';
import { AhorcadoComponent } from './ahorcado/ahorcado.component';
import { MayorMenorComponent } from './mayor-menor/mayor-menor.component';
import { SimonDiceComponent } from './simon-dice/simon-dice';

export const gamesRoutes: Routes = [
    {
        path: '',
        redirectTo: 'ahorcado',
        pathMatch: 'full'
    },
    {
        path: 'ahorcado',
        loadComponent: () => import('./ahorcado/ahorcado.component').then(m => m.AhorcadoComponent)
    },
    {
        path: 'mayor-menor',
        loadComponent: () => import('./mayor-menor/mayor-menor.component').then(m => m.MayorMenorComponent)
    },
    {
        path: 'simon-dice',
        loadComponent: () => import('./simon-dice/simon-dice').then(m => m.SimonDiceComponent)
    },
    {
        path: 'preguntados',
        loadComponent: () => import('./preguntados/preguntados').then(m => m.PreguntadosComponent)
    }
];
