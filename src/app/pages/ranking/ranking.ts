import { Component, signal, WritableSignal} from '@angular/core';
import { GamesService } from '../../services/ranking.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-ranking',
  imports: [DatePipe], // Agrega DatePipe aquí
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
})

export class Ranking {

  rankingPreguntados: WritableSignal<any[]> = signal([]);
  rankingAhorcado: WritableSignal<any[]> = signal([]);
  rankingMayorMenor: WritableSignal<any[]> = signal([]);
  rankingPropio: WritableSignal<any[]> = signal([]);

  constructor(private gamesSrv: GamesService) {}

  async ngOnInit() {
    try {
      // Cargamos los 4 rankings en paralelo
      const [preg, ahor, mm, prop] = await Promise.all([
        this.gamesSrv.getRanking('Preguntados'),
        this.gamesSrv.getRanking('Ahorcado'),
        this.gamesSrv.getRanking('Mayor o Menor'),
        this.gamesSrv.getRanking('SimonDice')   
        ]);
        console.log("Rankings obtenidos:", { preg, ahor, mm, prop });
      this.rankingPreguntados.set(preg);
      this.rankingAhorcado.set(ahor);
      this.rankingMayorMenor.set(mm);
      this.rankingPropio.set(prop);

    } catch (error) {
      console.error("Error al cargar los rankings:", error);
    }
  }
}
