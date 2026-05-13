import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gamesRoutes } from './games.routes';
import { AhorcadoComponent } from './ahorcado/ahorcado.component';
import { MayorMenorComponent } from './mayor-menor/mayor-menor.component';
import { SimonDiceComponent } from './simon-dice/simon-dice';
@NgModule({
    imports: [CommonModule, RouterModule.forChild(gamesRoutes)],
    declarations: [AhorcadoComponent, MayorMenorComponent, SimonDiceComponent],
    exports: [AhorcadoComponent, MayorMenorComponent, SimonDiceComponent]
})
export class GamesModule { }
    