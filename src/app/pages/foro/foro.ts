import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';

@Component({
    standalone: true,
    selector: 'app-foro',
    imports: [NavbarComponent],
    templateUrl: './foro.html',
    styleUrl: './foro.css',
})
export class Foro implements OnInit, OnDestroy {

    usuario: any = null;
    private sub!: Subscription;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.sub = this.authService.user$.subscribe(user => this.usuario = user);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
