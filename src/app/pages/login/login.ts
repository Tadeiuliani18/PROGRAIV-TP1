import { Component, OnInit, OnDestroy, signal } from '@angular/core';
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
  error = signal('');
  usuario: any = null;
  private sub!: Subscription;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.sub = this.authService.user$.subscribe(user => this.usuario = user);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async login(event: Event): Promise<void> {
    event.preventDefault(); 
    console.log('Intentando login con:', this.email, this.password);
    this.error.set('');

    if (!this.email.trim() || !this.password.trim()) {
      this.error.set('Completa email y contraseña.');
      return;
    }

    try {
      await this.authService.login(this.email, this.password);

      console.log('Login exitoso:', this.email);
      this.error.set(''); 
      this.router.navigate(['/home']);

    } catch (error: any) {
      console.error('Error login:', error.message);
    
      if (error.message.includes('Invalid login credentials')) {
        this.error.set('Email o contraseña incorrectos.');
      } else if (error.message.includes('Email not confirmed')) {
        this.error.set('Por favor confirma tu email antes de login.');
      } else {
        this.error.set(error.message || 'Error al iniciar sesión.');
      }
    }
  }


  async loginRapido(userIndex: number) {
    const users = [
      { email: 'pablo@hotmail.com.ar', password: '1234567' },
      { email: 'tadeiuliani3@gmail.com', password: 'tadefacu2' },
      { email: 'facuiuliani@gmail.com', password: 'peep1232' }
    ];

    const user = users[userIndex];

    try {
      await this.authService.login(user.email, user.password);
      this.error.set('');
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error en login rápido:', error.message);
      if (error.message.includes('Invalid login credentials')) {
        this.error.set('Credenciales incorrectas para este usuario.');
      } else {
        this.error.set(error.message || 'Error al iniciar sesión.');
      }
    }
  }
}
