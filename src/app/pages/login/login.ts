import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {
  email = '';
  password = '';
  error = '';
  usuario: any = null;
  private sub!: Subscription;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.sub = this.authService.user$.subscribe(user => this.usuario = user);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async login(event: Event): Promise<void> {
    event.preventDefault(); // SIEMPRE prevenimos submit
    console.log('Intentando login con:', this.email, this.password);
    this.error = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Completa email y contraseña.';
      return;
    }

    try {
      await this.authService.login(this.email, this.password);

      console.log('Login exitoso:', this.email);
      this.error = ''; // Limpiar errores previos
      this.router.navigate(['/home']);

    } catch (error: any) {
      console.error('Error login:', error.message);
      // Mostrar mensaje de error más amigable
      if (error.message.includes('Invalid login credentials')) {
        this.error = 'Email o contraseña incorrectos.';
      } else if (error.message.includes('Email not confirmed')) {
        this.error = 'Por favor confirma tu email antes de login.';
      } else {
        this.error = error.message || 'Error al iniciar sesión.';
      }
    }
  }


  async loginRapido(userIndex: number) {
    const users = [
      { email: 'test1@mail.com', password: '123456' },
      { email: 'test2@mail.com', password: '123456' },
      { email: 'test3@mail.com', password: '123456' }
    ];

    const user = users[userIndex];

    try {
      await this.authService.login(user.email, user.password);
      this.error = '';
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error en login rápido:', error.message);
      if (error.message.includes('Invalid login credentials')) {
        this.error = 'Credenciales incorrectas para este usuario.';
      } else {
        this.error = error.message || 'Error al iniciar sesión.';
      }
    }
  }
}
