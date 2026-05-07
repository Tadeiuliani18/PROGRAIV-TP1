import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop'; // Importante para la conversión
import { AuthService } from './services/auth';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true, // Asumiendo que usas standalone por los imports
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
// Inyectamos el servicio directamente en la propiedad
  private authService = inject(AuthService);

  // Ahora 'this.authService' ya está disponible para usarse aquí
  usuario = toSignal(this.authService.user$, { initialValue: null });

  // ¡Incluso puedes borrar el constructor si no haces nada más en él!
  constructor() {}
}