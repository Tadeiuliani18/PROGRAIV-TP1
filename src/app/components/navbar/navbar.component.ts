import { Component, Input } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

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
    await this.authService.logout();
  }

}