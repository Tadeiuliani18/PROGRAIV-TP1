import { Component } from '@angular/core';

@Component({
    selector: 'app-games-base',
    standalone: false,
    template: `
    <section class="games-base-container">
      <h2>Juegos</h2>
      <p>Selecciona un juego para comenzar. Por ahora el primer juego disponible es Ahorcado.</p>
      
    </section>
  `
})
export class GamesBaseComponent { }
