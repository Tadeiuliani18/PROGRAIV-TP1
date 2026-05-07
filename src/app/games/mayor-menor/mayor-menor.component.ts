import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { GamesService } from '../../services/games.service';
import { Subscription } from 'rxjs';
import { TimerService } from '../../services/timer.service';

interface DeckCard {
    value: string;
    suit: string;
    image: string;
    code: string;
}

const CARD_VALUE_MAP: Record<string, number> = {
    'ACE': 14,
    'KING': 13,
    'QUEEN': 12,
    'JACK': 11,
    '10': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2
};

@Component({
    selector: 'app-mayor-menor',
    standalone: false,
    templateUrl: './mayor-menor.component.html',
    styleUrls: ['./mayor-menor.component.css']
})
export class MayorMenorComponent implements OnInit, OnDestroy {
    user: any = null;
    private sub?: Subscription;

    // Signals para el estado del juego
    deckId = signal<string | null>(null);
    currentCard = signal<DeckCard | null>(null);
    nextCard = signal<DeckCard | null>(null);
    score = signal(0);
    attempts = signal(0);
    message = signal('');
    saveMessage = signal('');
    loading = signal(false);
    gameOver = signal(false);


    constructor(
        private authService: AuthService,
        private gamesService: GamesService,
        private router: Router,
        public timerService: TimerService
    ) { }

    ngOnInit() {
        this.sub = this.authService.user$.subscribe(user => this.user = user);
        this.timerService.reiniciar();
        this.startGame();
    }

    ngOnDestroy() {
        this.sub?.unsubscribe();
        // Limpiamos el interval si el componente se destruye en medio de una partida
        this.timerService.reiniciar();
    }

    get tiempoFormateado() {
        return this.timerService.tiempoFormateado();
    }

    async startGame() {
        this.loading.set(true);
        this.gameOver.set(false);
        this.score.set(0);
        this.attempts.set(0);
        this.message.set('');
        this.saveMessage.set('');
        this.currentCard.set(null);
        this.nextCard.set(null);
        // Reiniciamos el timer pero NO lo arrancamos todavía
        this.timerService.reiniciar();
        this.timerService.iniciar();  

        try {
            const id = await this.createDeck();
            this.deckId.set(id);
            const card = await this.drawCard();
            this.currentCard.set(card);
        } catch (error) {
            this.message.set('No se pudo iniciar la partida. Intenta nuevamente.');
            console.error(error);
        } finally {
            this.loading.set(false);
        }
    }

    async createDeck(): Promise<string> {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        if (!response.ok) {
            throw new Error('Error al crear el mazo');
        }
        const data = await response.json();
        return data.deck_id as string;
    }

    async drawCard(): Promise<DeckCard> {
        const id = this.deckId();
        if (!id) {
            throw new Error('No hay deck_id disponible');
        }

        const response = await fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`);
        if (!response.ok) {
            throw new Error('Error al sacar una carta');
        }
        const data = await response.json();

        if (!data.success || !data.cards || data.cards.length === 0) {
            throw new Error('No se pudieron obtener cartas del mazo');
        }

        const card = data.cards[0];
        return {
            value: card.value,
            suit: card.suit,
            image: card.image || (card.images ? card.images.png : ''),
            code: card.code
        } as DeckCard;
    }

    private getNumericValue(value: string): number {
        return CARD_VALUE_MAP[value] ?? 0;
    }

    async guess(isHigher: boolean) {
        if (this.gameOver() || this.loading() || !this.currentCard()) {
            return;
        }

        // El timer arranca con el primer guess (iniciar() es idempotente: no duplica el interval)
        this.timerService.iniciar();

        this.loading.set(true);
        this.message.set('');

        try {
            const drawn = await this.drawCard();
            this.nextCard.set(drawn);
            this.attempts.update(a => a + 1);

            const currentValue = this.getNumericValue(this.currentCard()!.value);
            const nextValue = this.getNumericValue(drawn.value);
            const equal = nextValue === currentValue;
            const correct = !equal && (isHigher ? nextValue > currentValue : nextValue < currentValue);

            if (correct) {
                this.score.update(s => s + 1);
                this.message.set(`¡Correcto! ${this.currentCard()!.value} → ${drawn.value}`);
                this.currentCard.set(drawn);
                this.nextCard.set(null);
            } else {
                this.message.set(
                    equal
                        ? `Empate. La próxima carta también vale ${drawn.value}. Perdiste.`
                        : `Fallaste. ${this.currentCard()!.value} → ${drawn.value}`
                );
                await this.finishGame();
            }
        } catch (error) {
            this.message.set('Error al leer la carta. Intenta reiniciar la partida.');
            console.error(error);
        } finally {
            this.loading.set(false);
        }
    }

    async finishGame() {
        // Pausamos el timer al perder
        this.timerService.pausar();
        this.gameOver.set(true);
        await this.saveResult();
    }

    async saveResult() {
        if (!this.user?.id) {
            this.saveMessage.set('Inicia sesión para guardar el resultado en la base de datos.');
            return;
        }

        try {
            await this.gamesService.saveGameResult({
                userId: this.user.id,
                gameName: 'Mayor o Menor',
                // Guardamos los segundos exactos del TimerService
                tiempo: this.timerService.segundos(),
                fecha: new Date(),
                score: this.score()
            });
            this.saveMessage.set('Resultado guardado exitosamente.');
        } catch (error) {
            this.saveMessage.set('No se pudo guardar el resultado. Intenta de nuevo más tarde.');
            console.error('Error guardando resultado:', error);
        }
    }

    async endGame() {
        if (!this.gameOver()) {
            // Pausamos el timer al terminar manualmente
            this.timerService.pausar();
            this.gameOver.set(true);
            await this.saveResult();
            this.message.set('Partida finalizada manualmente.');
        }
    }

    salirHome() {
        this.router.navigate(['/home']);
    }

    get currentCardLabel(): string {
        const card = this.currentCard();
        return card ? `${card.value} de ${card.suit}` : '';
    }
}