import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-registro',
  imports: [NavbarComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';

  register(event: Event): void {
    this.error = '';

    if (!this.username.trim() || !this.email.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
      event.preventDefault();
      this.error = 'Completa todos los campos.';
      console.log('Registro fallido: datos incompletos');
      return;
    }

    if (this.password !== this.confirmPassword) {
      event.preventDefault();
      this.error = 'Las contraseñas no coinciden.';
      console.log('Registro fallido: contraseñas no coinciden');
      return;
    }

    console.log('Simulando registro para usuario:', this.username, this.email);

    // Simular registro exitoso
    console.log('Registro exitoso:', this.username, '- redirigiendo a Home');
  }
}
