import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {

  nombre = '';
  apellido = '';
  edad: number | null = null;
  email = '';
  password = '';
  confirmPassword = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async register(event: Event): Promise<void> {
    event.preventDefault();
    this.error = '';

    // VALIDACIONES
    if (!this.nombre || !this.apellido || !this.edad || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Completa todos los campos.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    try {
      // REGISTRO EN SUPABASE
      await this.authService.register(
        this.email,
        this.password,
        {
          nombre: this.nombre,
          apellido: this.apellido,
          edad: this.edad
        }
      );

      // LOGIN AUTOMÁTICO
      await this.authService.login(this.email, this.password);

      console.log('Registro exitoso');

      this.router.navigate(['/home']);

    } catch (error: any) {
      console.error('Error registro:', error.message);
      this.error = error.message;
    }
  }
}