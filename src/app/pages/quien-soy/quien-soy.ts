import { Component, OnInit, signal, inject } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoy implements OnInit {
  // Inyecciones modernas
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Definimos la Signal para los datos de GitHub
  usuario = signal<any>(null);

  // Convertimos el observable de Auth a Signal también para ser consistentes
  usuarioAuth = toSignal(this.authService.user$);

  username: string = 'Tadeiuliani18';

  ngOnInit() {
    this.obtenerDatosGithub();
  }

  obtenerDatosGithub() {
    const url = `https://api.github.com/users/${this.username}`;

    this.http.get(url).subscribe({
      next: (data) => {
        // Actualizamos la Signal. Esto notificará al HTML automáticamente.
        this.usuario.set(data);
      },
      error: (err) => {
        console.error('Error al obtener datos de GitHub', err);
      }
    });
  }
}