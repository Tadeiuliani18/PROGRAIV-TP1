import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-home',
  imports: [NavbarComponent, GameCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home { 

  usuario: any = null;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.usuario = await this.authService.getUser();
  }

  async logout() {
    await this.authService.logout();
    this.usuario = null;
  }
}


