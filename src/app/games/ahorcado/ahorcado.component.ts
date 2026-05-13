import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { GamesService } from '../../services/games.service';
import { Subscription } from 'rxjs';
import { TimerService } from '../../services/timer.service';
import { PalabrasService } from '../../services/palabras.service';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

@Component({
    selector: 'app-ahorcado',
    standalone: false,
    templateUrl: './ahorcado.component.html',
    styleUrl: './ahorcado.component.css'
})
export class AhorcadoComponent implements OnInit, OnDestroy {
    letters = ALPHABET;
    selectedLetters = new Set<string>();
    wrongGuesses = 0;
    maxErrors = 6;
    gameOver = false;
    won = false;
    loading = false;

    nivelesCompletados = 0;
    maxNiveles = 2;
    puntajeAcumulado = 0;
    tiempoTotalSegundos = 0;
    
    user: any = null;
    private sub!: Subscription;
    word = '';

    constructor(
        private authService: AuthService,
        private gamesService: GamesService,
        public timerService: TimerService,
        private palabrasService: PalabrasService,
        private router: Router
    ) { }

    async ngOnInit() {
        this.sub = this.authService.user$.subscribe(user => this.user = user);
        this.timerService.reiniciar();
        await this.resetGame();
    }

    ngOnDestroy() {
        this.sub?.unsubscribe();
        this.timerService.reiniciar();
    }

    get displayWord() {
        return this.word
            .split('')
            .map(letter => (this.selectedLetters.has(letter) ? letter : '_'))
            .join(' ');
    }

    async resetGame() {
        this.loading = true;
        this.gameOver = false;

        if (!this.won || this.nivelesCompletados >= this.maxNiveles) {
            this.nivelesCompletados = 0;
            this.puntajeAcumulado = 0;
            this.tiempoTotalSegundos = 0;
        }

        this.won = false;
        this.selectedLetters.clear();
        this.wrongGuesses = 0;
        this.word = '';

        await this.chooseWord();

        this.timerService.reiniciar();
        this.timerService.iniciar();
    }

    private async chooseWord() {
        this.loading = true;
        try {
            this.word = await this.palabrasService.getPalabraAleatoria();
        } catch (error) {
            this.word = 'AHORCADO';
        } finally {
            this.loading = false;
        }
    }

    selectLetter(letter: string) {
        if (this.gameOver || this.loading || this.selectedLetters.has(letter)) {
            return;
        }

        this.selectedLetters.add(letter);

        if (this.word.includes(letter)) {
            this.puntajeAcumulado += 10;
        } else {
            this.wrongGuesses += 1;
        }

        if (this.isWin()) {
            this.finishGame(true);
        } else if (this.wrongGuesses >= this.maxErrors) {
            this.finishGame(false);
        }
    }

    private isWin() {
        return this.word.length > 0 && this.word.split('').every(l => this.selectedLetters.has(l));
    }

    private async finishGame(won: boolean) {
        this.timerService.pausar();
        this.won = won;
        this.gameOver = true;
        
        this.tiempoTotalSegundos += this.timerService.segundos();

        if (won) {
            this.nivelesCompletados++;
            this.puntajeAcumulado += 100; 
            
            if (this.nivelesCompletados >= this.maxNiveles) {
                this.puntajeAcumulado = Math.round(this.puntajeAcumulado * 1.5); 
                await this.guardarEstadisticas();
            }
        } else {
            await this.guardarEstadisticas();
        }
    }

    private async guardarEstadisticas() {
        try {
            await this.gamesService.saveGameResult({
                userId: this.user?.id ?? null,
                gameName: 'Ahorcado',
                tiempo: this.tiempoTotalSegundos,
                fecha: new Date(),
                score: this.puntajeAcumulado
            });
        } catch (error) {
            console.warn('Error al salvar:', error);
        }
    }

    salirHome() {
        this.router.navigate(['/home']);
    }

    get wordStatus() {
        return `Nivel: ${this.nivelesCompletados + 1}/2 | Errores: ${this.wrongGuesses}/${this.maxErrors}`;
    }
}