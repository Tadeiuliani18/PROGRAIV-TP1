import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-home',
  imports: [NavbarComponent, GameCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {

  usuario: any = null;
  private sub!: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.sub = this.authService.user$.subscribe(user => {
      this.usuario = user;
      console.log('Usuario actual:', this.usuario);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}


