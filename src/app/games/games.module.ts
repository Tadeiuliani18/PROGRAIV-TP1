import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gamesRoutes } from './games.routes';
// Importa tus componentes
import { AhorcadoComponent } from './ahorcado/ahorcado.component';
import { MayorMenorComponent } from './mayor-menor/mayor-menor.component';
import { SimonDiceComponent } from './simon-dice/simon-dice';
import { PreguntadosComponent } from './preguntados/preguntados';

@NgModule({
  declarations: [
    // El módulo CONTIENE a los componentes aquí
    AhorcadoComponent,
    MayorMenorComponent,
    SimonDiceComponent,
    PreguntadosComponent
  ],
  imports: [
    CommonModule,
    // El ruteo se MANEJA desde aquí para este módulo
    RouterModule.forChild(gamesRoutes)
  ]
})
export class GamesModule { }