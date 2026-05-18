import { Component, NgZone, OnInit, OnDestroy, signal } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth'; 
import { GamesService } from '../../services/games.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-simon-dice',
  standalone: false,
  templateUrl: './simon-dice.html',
  styleUrl: './simon-dice.css',
})
export class SimonDiceComponent implements OnInit, OnDestroy {
  colores = ['verde', 'rojo', 'amarillo', 'azul'];
  secuencia: string[] = [];
  secuenciaUsuario: string[] = [];
  
  estaJugando = false;
  puntaje = 0;
  ronda = signal(0);
  mensaje = '¡Presiona START para jugar!';
  colorActivo = signal<string | null>(null);
  mostrarModal = signal(false);
  // Gestión de usuario y guardado
  user: any = null;
  private sub?: Subscription;
  saveMessage = signal('');

  constructor(
    private cdr: ChangeDetectorRef, 
    private ngZone: NgZone,
    private authService: AuthService,
    private gamesService: GamesService,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtenemos el usuario para poder guardar el puntaje al final
    this.sub = this.authService.user$.subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  async iniciarJuego() {
    this.secuencia = [];
    this.puntaje = 0;
    this.mensaje = 'Simon dice...';
    this.saveMessage.set('');
    this.mostrarModal.set(false);

    this.ronda.set(0);
    await this.siguienteRonda();
  }

  async siguienteRonda() {
    this.estaJugando = true; 
    this.secuenciaUsuario = [];
    this.ronda.update(r => r + 1);
    this.mensaje = `Ronda ${this.ronda()}`;

    this.secuencia = [];
    for (let i = 0; i < this.ronda(); i++) {
      const colorAleatorio = this.colores[Math.floor(Math.random() * 4)];
      this.secuencia.push(colorAleatorio);
    }

    await new Promise(r => setTimeout(r, 800));
    await this.reproducirSecuencia();
  }

  async reproducirSecuencia() {
    this.estaJugando = true;
    for (const color of this.secuencia) {
      await this.iluminarColor(color);
    }
    this.estaJugando = false;
    this.mensaje = 'Tu turno...';  
  }

  iluminarColor(color: string): Promise<void> {
    return new Promise((resolve) => {
      this.ngZone.run(() => {
        this.colorActivo.set(color);
        this.cdr.detectChanges(); 
      });

      setTimeout(() => {
        this.ngZone.run(() => {
          this.colorActivo.set(null);
          this.cdr.detectChanges();
        });
        setTimeout(() => resolve(), 200); 
      }, 600);
    });
  }

  presionarColor(color: string) {
    if (this.estaJugando || this.ronda() === 0) return;

    this.secuenciaUsuario.push(color);
    const pasoActual = this.secuenciaUsuario.length - 1;

    if (this.secuenciaUsuario[pasoActual] !== this.secuencia[pasoActual]) {
      this.gameOver();
      return;
    }

    if (this.secuenciaUsuario.length === this.secuencia.length) {
      this.puntaje++; 
      this.mensaje = '¡Excelente!';
      this.estaJugando = true;  
      setTimeout(() => this.siguienteRonda(), 1200);
    }  
  }

  async gameOver() {
    this.mensaje = '¡GAME OVER!';
    
    await this.saveResult();
    this.estaJugando = false; 
    this.mostrarModal.set(true);

    this.ronda.set(0);
    this.secuencia = []; 
  }

  async saveResult() {
    if (!this.user?.id) {
      this.saveMessage.set('Inicia sesión para guardar tu récord.');
      return;
    }

    try {
      await this.gamesService.saveGameResult({
        userId: this.user.id,
        gameName: 'SimonDice',
        tiempo: 0, 
        fecha: new Date(),
        score: this.puntaje 
      });
      this.saveMessage.set('Récord guardado.');
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  }

  salir() {
  this.router.navigate(['/home'])
  this.mostrarModal.set(false);
}
}