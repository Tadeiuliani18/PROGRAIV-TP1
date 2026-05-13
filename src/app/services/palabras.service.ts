import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PalabrasService {

  constructor(private http: HttpClient) {}

  async getPalabraAleatoria(): Promise<string> {
    try {
        const palabra = palabras[Math.floor(Math.random() * palabras.length)];

        return palabra;

    } catch (error) {
      console.error('Error obteniendo palabra:', error);
      const palabrasFallback = ['ANGULAR', 'SALA', 'JUEGO', 'CODIGO'];
      return palabrasFallback[Math.floor(Math.random() * palabrasFallback.length)];
    }
  }

  
}


const palabras = [
  "ANGULAR",
  "JAVASCRIPT",
  "TYPESCRIPT",
  "BACKEND",
  "FRONTEND",
  "SERVIDOR",
  "DATABASE",
  "ALGORITMO",
  "COMPILADOR",
  "DESARROLLO",
  "PROGRAMACION",
  "COMPONENTE",
  "SERVICIO",
  "INTERFAZ",
  "VARIABLE",
  "FUNCION",
  "DOCKER",
  "GITHUB",
  "API",
  "FRAMEWORK"
]