import { Component, OnInit, WritableSignal, signal } from '@angular/core';
// 1. Eliminamos la interfaz local porque ya viene del servicio (Evita el error de conflicto)
import { PreguntadosService, PreguntaFútbol } from '../../services/preguntados.service';
import { GamesService } from '../../services/games.service'; 
import { AuthService } from '../../services/auth'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-preguntados',
  templateUrl: 'preguntados.html',
  styleUrls: ['preguntados.css'],
  standalone: false
})
export class PreguntadosComponent implements OnInit {
  // 2. CAMBIO: Usamos WritableSignal para poder usar .set() (Resuelve error de Property 'set' does not exist)
  preguntaActual: WritableSignal<PreguntaFútbol | null> = signal(null);
  puntaje: number = 0;
  mostrarModal = signal(false);
  cargando: boolean = false;
  tiempoInicio: number = 0;

  constructor(
    private preguntadosSrv: PreguntadosService,
    private gamesSrv: GamesService, 
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.iniciarJuego();
  }

  async iniciarJuego() {
    this.puntaje = 0;
    this.tiempoInicio = Date.now();
    this.mostrarModal.set(false);
    await this.cargarNuevaPregunta();
  }

  async cargarNuevaPregunta() {
    this.cargando = true;
    try {
      const pregunta = await this.preguntadosSrv.generarPregunta();
      // 3. CORRECCIÓN: Quitamos "PreguntaFútbol(pregunta)" ya que la interfaz no es una función (Resuelve error de 'value here')
      this.preguntaActual.set(pregunta);
      console.log("Pregunta cargada:", this.preguntaActual());
    } catch (error) {
      console.error("Error API:", error);
    } finally {
      this.cargando = false;
    }
  }

  async verificarRespuesta(opcion: string) {
    const actual = this.preguntaActual();
    // 4. CORRECCIÓN: Verificamos que 'actual' no sea null antes de acceder (Resuelve error de 'Object is possibly null')
    if (actual && opcion === actual.respuestaCorrecta) {
      this.puntaje++;
      await this.cargarNuevaPregunta();
    } else {
      await this.finalizarPartida();
    }
  }

  async finalizarPartida() {
    this.mostrarModal.set(true);
    
    const user = await this.auth.getUser();

    const resultado = {
      userId: user?.id || user?.email || null,
      gameName: 'Preguntados',
      score: this.puntaje,
      tiempo: 0,
      fecha: new Date()
    };

    try {
      await this.gamesSrv.saveGameResult(resultado);
      console.log('Resultado guardado con éxito');
    } catch (e) {
      console.error("Error al guardar:", e);
    }
  }

  salir() {
    this.router.navigate(['/home']);
  }
}