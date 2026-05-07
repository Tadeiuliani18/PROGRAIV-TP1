import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-game-card',
    imports: [CommonModule, RouterModule],
    templateUrl: './game-card.component.html',
    styleUrl: './game-card.component.css',
})
export class GameCardComponent {
    @Input() color!: string;
    @Input() nombre!: string;
    @Input() descripcion!: string;
    @Input() imagen!: string;
    @Input() ruta!: string;

    constructor(private router: Router) { }

    isImageUrl(value: string): boolean {
        return typeof value === 'string' && /\.(png|jpe?g|gif|svg|webp)$/i.test(value.trim());
    }

    jugar() {
        console.log('Navegando a:', this.ruta);
        this.router.navigateByUrl(this.ruta);
    }
}
