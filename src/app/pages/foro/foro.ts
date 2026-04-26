import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
    standalone: true,
    selector: 'app-foro',
    imports: [NavbarComponent],
    templateUrl: './foro.html',
    styleUrl: './foro.css',
})
export class Foro { }
