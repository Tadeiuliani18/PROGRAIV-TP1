import { Routes } from '@angular/router';
import { AhorcadoComponent } from './ahorcado/ahorcado.component';
import { MayorMenorComponent } from './mayor-menor/mayor-menor.component';
import { SimonDiceComponent } from './simon-dice/simon-dice';
import { PreguntadosComponent } from './preguntados/preguntados';

export const gamesRoutes: Routes = [
  { path: '', redirectTo: 'ahorcado', pathMatch: 'full' },
  { path: 'ahorcado', component: AhorcadoComponent },
  { path: 'mayor-menor', component: MayorMenorComponent },
  { path: 'simon-dice', component: SimonDiceComponent },
  { path: 'preguntados', component: PreguntadosComponent }
];