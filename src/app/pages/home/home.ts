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
  mensajeError: string | null = null; // Para mostrar el aviso
  private timerRef: any; // Para guardar la referencia del timer
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
    // 1. Cancelamos cualquier cierre programado previo
    if (this.timerRef) {
      clearTimeout(this.timerRef);
    }

    // 2. Limpiamos el mensaje y esperamos un 'tick' de la CPU
    this.mensajeError = null;

    // 3. Usamos Promise para asegurar que el cambio a 'null' se procese antes de volver a poner el texto
    Promise.resolve().then(() => {
      this.mensajeError = "¡Debes iniciar sesión con tu cuenta para jugar!";
      
      // 4. Programamos el cierre
      this.timerRef = setTimeout(() => {
        this.mensajeError = null;
      }, 3000);
    });
  }
}

  private mostrarAviso(mensaje: string) {
    // 1. Si ya había un timer corriendo, lo cancelamos para que no borre el nuevo mensaje antes de tiempo
    if (this.timerRef) {
        clearTimeout(this.timerRef);
    }

    // 2. IMPORTANTE: Ponemos el mensaje en null inmediatamente
    this.mensajeError = null;

    // 3. Usamos un pequeño delay (setTimeout 0) para que Angular detecte que el div desapareció
    // y luego lo vuelva a crear, disparando así la animación de CSS cada vez.
    setTimeout(() => {
        this.mensajeError = mensaje;

        // 4. Programamos la desaparición después de 3 segundos (o el tiempo que prefieras)
        this.timerRef = setTimeout(() => {
            this.mensajeError = null;
            this.timerRef = null;
        }, 3000);
    }, 10); 
}
}


