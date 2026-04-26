import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { GameCardComponent } from '../../components/game-card/game-card.component';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, GameCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home { }
