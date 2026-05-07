import { Routes } from '@angular/router';
import { AhorcadoComponent } from './ahorcado/ahorcado.component';
import { MayorMenorComponent } from './mayor-menor/mayor-menor.component';

export const gamesRoutes: Routes = [
    {
        path: '',
        redirectTo: 'ahorcado',
        pathMatch: 'full'
    },
    {
        path: 'ahorcado',
        component: AhorcadoComponent
    },
    {
        path: 'mayor-menor',
        component: MayorMenorComponent
    }
];
