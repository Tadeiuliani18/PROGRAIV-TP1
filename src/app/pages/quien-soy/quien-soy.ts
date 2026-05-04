import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quien-soy',
  imports: [NavbarComponent],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoy implements OnInit, OnDestroy {

  usuario: any;
  usuarioAuth: any = null;
  username: string = 'Tadeiuliani18'; // 🔥 CAMBIALO si querés
  private sub!: Subscription;

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.sub = this.authService.user$.subscribe(user => this.usuarioAuth = user);
    this.obtenerDatosGithub();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  obtenerDatosGithub() {
    const url = `https://api.github.com/users/${this.username}`;

    this.http.get(url).subscribe({
      next: (data) => {
        this.usuario = data;
      },
      error: (err) => {
        console.error('Error al obtener datos de GitHub', err);
      }
    });
  }

}
