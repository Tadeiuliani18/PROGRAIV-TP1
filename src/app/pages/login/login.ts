import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  error = '';

  login(event: Event): void {
    this.error = '';

    if (!this.username.trim() || !this.password.trim()) {
      event.preventDefault();
      this.error = 'Completa usuario y contraseña.';
      console.log('Login fallido: datos incompletos');
      return;
    }

    console.log('Simulando conexión a BD para usuario:', this.username);

    if (!this.authenticate(this.username, this.password)) {
      event.preventDefault();
      this.error = 'Usuario o contraseña incorrectos.';
      console.log('Login fallido: credenciales inválidas');
      return;
    }

    console.log('Login exitoso:', this.username, '- redirigiendo a Home');
  }

  private authenticate(username: string, password: string): boolean {
    console.log('Consulta ficticia a la DB:', { username, password });
    return username === 'admin' && password === '1234';
  }
}

