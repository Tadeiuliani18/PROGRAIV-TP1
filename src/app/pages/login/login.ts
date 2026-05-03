import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { AuthService } from '../../services/auth';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  error = '';

  constructor(private router: Router, private authService: AuthService) {}

  async login(event: Event): Promise<void> {
    event.preventDefault(); // SIEMPRE prevenimos submit

    this.error = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Completa email y contraseña.';
      return;
    }

    try {
      await this.authService.login(this.email, this.password);

      console.log('Login exitoso:', this.email);

      this.router.navigate(['/home']);

    } catch (error: any) {
      console.error('Error login:', error.message);
      this.error = error.message;
    }
  }


   // 🔥 LOGIN RÁPIDO (te suma puntos en el TP)
  async loginRapido(userIndex: number) {
    const users = [
      { email: 'test1@mail.com', password: '123456' },
      { email: 'test2@mail.com', password: '123456' },
      { email: 'test3@mail.com', password: '123456' }
    ];

    const user = users[userIndex];

    try {
      await this.authService.login(user.email, user.password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.error = error.message;
    }
  }
}

