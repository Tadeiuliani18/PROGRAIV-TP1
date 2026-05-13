import { Component, OnInit, signal } from '@angular/core';
import { PreguntadosService, PreguntaFútbol } from '../../services/preguntados.service';
import { GamesService } from '../../services/games.service'; // Tu servicio de Supabase
import { AuthService } from '../../services/auth'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-preguntados',
  templateUrl: 'preguntados.html',
  styleUrls: ['preguntados.css']
})
export class PreguntadosComponent implements OnInit {
  preguntaActual: PreguntaFútbol | null = null;
  puntaje: number = 0;
  mostrarModal = signal(false);
  cargando: boolean = false;
  
  // Para el registro de tiempo si lo necesitas
  tiempoInicio: number = 0;

  constructor(
    private preguntadosSrv: PreguntadosService,
    private gamesSrv: GamesService, // Inyectamos Supabase
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.iniciarJuego();
  }

  async iniciarJuego() {
    this.puntaje = 0;
    this.tiempoInicio = Date.now(); // Iniciamos cronómetro
    this.mostrarModal.set(false);
    await this.cargarNuevaPregunta();
  }

  async cargarNuevaPregunta() {
    this.cargando = true;
    try {
      this.preguntaActual = await this.preguntadosSrv.generarPregunta();
      console.log("Pregunta cargada:", this.preguntaActual);
    } catch (error) {
      console.error("Error API:", error);
    } finally {
      this.cargando = false;
    }
  }

  async verificarRespuesta(opcion: string) {
    if (this.preguntaActual && opcion === this.preguntaActual.respuestaCorrecta) {
      this.puntaje++;
      await this.cargarNuevaPregunta();
    } else {
      await this.finalizarPartida();
    }
  }

  async finalizarPartida() {
    this.mostrarModal.set(true);
    
    const user = await this.auth.getUser();
    // Calculamos el tiempo total en segundos
    const tiempoTotal = Math.floor((Date.now() - this.tiempoInicio) / 1000);

    const resultado = {
    userId: user?.id || user?.email || null, // Ajusta según tu AuthService
      gameName: 'Preguntados',
      score: this.puntaje,
      tiempo: tiempoTotal,
      fecha: new Date()
    };

    try {
      // Usamos tu método existente de Supabase
      await this.gamesSrv.saveGameResult(resultado);
      console.log('Resultado guardado en Supabase con éxito');
    } catch (e) {
      console.error("Error al guardar en la base de datos:", e);
    }
  }

  salir() {
    this.router.navigate(['/home']);
  }
}