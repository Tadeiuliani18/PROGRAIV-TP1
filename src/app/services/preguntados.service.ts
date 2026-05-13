import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

export interface PreguntaFútbol {
  imagen: string;
  respuestaCorrecta: string;
  opciones: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {
  // API gratuita de TheSportsDB (Liga Argentina = 4398)
  private apiUrl = 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=Argentinian%20Primera%20Division';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista completa de equipos y genera una pregunta aleatoria.
   */
  async generarPregunta(): Promise<PreguntaFútbol> {
    const response: any = await firstValueFrom(this.http.get(this.apiUrl));

    const equipos = response.teams;
    console.log("Equipos obtenidos de la API:", equipos);
    // 1. Elegimos el equipo correcto al azar
    const indiceCorrecto = Math.floor(Math.random() * equipos.length);
    const equipoCorrecto = equipos[indiceCorrecto];
    console.log("Equipo correcto seleccionado:", equipoCorrecto);

    // 2. Generamos las 4 opciones (la correcta + 3 incorrectas)
    const opciones = this.obtenerOpcionesMezcladas(equipoCorrecto.strTeam, equipos);

    return {
      imagen: equipoCorrecto.strBadge, // URL del escudo
      respuestaCorrecta: equipoCorrecto.strTeam,
      opciones: opciones
    };
  }

  /**
   * Crea un array de 4 nombres de equipo mezclados.
   */
  private obtenerOpcionesMezcladas(correcta: string, todosLosEquipos: any[]): string[] {
    let opciones = [correcta];

    // Buscamos 3 equipos distintos al correcto
    while (opciones.length < 4) {
      const randomIndice = Math.floor(Math.random() * todosLosEquipos.length);
      const nombreCandidato = todosLosEquipos[randomIndice].strTeam;

      if (!opciones.includes(nombreCandidato)) {
        opciones.push(nombreCandidato);
      }
    }

    // Mezclamos el array para que la correcta no esté siempre en la misma posición
    return opciones.sort(() => Math.random() - 0.5);
  }
}