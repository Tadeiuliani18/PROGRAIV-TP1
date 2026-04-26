import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quien-soy',
  imports: [NavbarComponent],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoy {

  usuario: any;
  username: string = 'Tadeiuliani18'; // 🔥 CAMBIALO si querés

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerDatosGithub();
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
