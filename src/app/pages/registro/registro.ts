import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit, OnDestroy {

  nombre = '';
  apellido = '';
  edad: number | null = null;
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  usuario: any = null;
  private sub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.sub = this.authService.user$.subscribe(user => this.usuario = user);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async register(event: Event): Promise<void> {
    event.preventDefault();
    this.error = '';
    console.log('Intentando registro con:', this.nombre, this.apellido, this.edad, this.email);
    // VALIDACIONES
    if (!this.nombre || !this.apellido || !this.edad || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Completa todos los campos.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
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
      // Mostrar mensaje de error más amigable
      if (error.message.includes('already registered')) {
        this.error = 'Este email ya está registrado.';
      } else if (error.message.includes('Password')) {
        this.error = 'La contraseña no cumple con los requisitos de seguridad.';
      } else if (error.message.includes('Invalid email')) {
        this.error = 'El email ingresado no es válido.';
      } else {
        this.error = error.message || 'Error al registrarse.';
      }
    }
  }
}