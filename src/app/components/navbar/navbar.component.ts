import { Component, Input } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { log } from 'node:console';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
  imports: [MenubarModule, RouterModule]
})
export class NavbarComponent {

  @Input() usuario: any;

  constructor(private authService: AuthService) { }

  async logout() {
    console.log('Cerrando sesión para:', this.usuario);
    await this.authService.logout();
  }

}