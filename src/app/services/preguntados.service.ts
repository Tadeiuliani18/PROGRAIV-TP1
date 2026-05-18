import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // API gratuita de TheSportsDB
  private apiUrl =
    'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=Argentinian%20Primera%20Division';

  private equiposUsados: string[] = [];

  constructor(private http: HttpClient) {}

  async generarPregunta(): Promise<PreguntaFútbol> {

    const response: any = await firstValueFrom(
      this.http.get(this.apiUrl)
    );

    const equipos = response.teams;

    if (this.equiposUsados.length === equipos.length) {
      this.equiposUsados = [];
    }

    let equipoCorrecto;

    do {

      const indiceCorrecto =
        Math.floor(Math.random() * equipos.length);

      equipoCorrecto = equipos[indiceCorrecto];

    } while (
      this.equiposUsados.includes(equipoCorrecto.strTeam)
    );

    this.equiposUsados.push(equipoCorrecto.strTeam);

    const opciones = this.obtenerOpcionesMezcladas(
      equipoCorrecto.strTeam,
      equipos
    );

    return {
      imagen: equipoCorrecto.strBadge,
      respuestaCorrecta: equipoCorrecto.strTeam,
      opciones: opciones
    };
  }

  private obtenerOpcionesMezcladas(
    correcta: string,
    todosLosEquipos: any[]
  ): string[] {

    let opciones = [correcta];

    // Buscamos 3 equipos distintos al correcto
    while (opciones.length < 4) {

      const randomIndice =
        Math.floor(Math.random() * todosLosEquipos.length);

      const nombreCandidato =
        todosLosEquipos[randomIndice].strTeam;

      if (!opciones.includes(nombreCandidato)) {
        opciones.push(nombreCandidato);
      }
    }

    return opciones.sort(() => Math.random() - 0.5);
  }
}