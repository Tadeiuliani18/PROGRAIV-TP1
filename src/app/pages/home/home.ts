import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [GameCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {

  usuario: any = null;
  mensajeError: string | null = null; 
  private timerRef: any; 
  private sub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.sub = this.authService.user$.subscribe(user => {
      this.usuario = user;
      console.log('Usuario actual:', this.usuario);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  verificarYJugar(ruta: string) {
  if (this.usuario) {
    this.router.navigateByUrl(ruta);
  } else {
    if (this.timerRef) {
      clearTimeout(this.timerRef);
    }

    this.mensajeError = null;

    Promise.resolve().then(() => {
      this.mensajeError = "¡Debes iniciar sesión con tu cuenta para jugar!";
      
      this.timerRef = setTimeout(() => {
        this.mensajeError = null;
      }, 3000);
    });
  }
}

  private mostrarAviso(mensaje: string) {
    if (this.timerRef) {
        clearTimeout(this.timerRef);
    }

    this.mensajeError = null;

    setTimeout(() => {
        this.mensajeError = mensaje;

        this.timerRef = setTimeout(() => {
            this.mensajeError = null;
            this.timerRef = null;
        }, 3000);
    }, 10); 
}
}


