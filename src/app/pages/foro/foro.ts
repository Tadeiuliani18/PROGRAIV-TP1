import { Component, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ChatMessage } from '../../components/chat-message/chat-message';
import { AuthService } from '../../services/auth';
import { ForoService } from '../../services/foro.service'; // Inyectamos el nuevo servicio
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-foro',
  imports: [NavbarComponent, ChatMessage, FormsModule],
  templateUrl: './foro.html',
  styleUrl: './foro.css',
})
export class Foro implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private foroService = inject(ForoService);

  usuario = toSignal(this.authService.user$);
  mensajes = signal<any[]>([]);
  nuevoMensaje = '';
  mensajeError = signal<string | null>(null);
  private timerRef: any;
  huboErrorAlCargar = signal<boolean>(false);
  errorEnvio = signal<boolean>(false);
  
  // Guardamos el canal para poder cerrarlo al salir
  private chatChannel: any;

  async ngOnInit() {
    try {
      this.huboErrorAlCargar.set(false);
      const historial = await this.foroService.obtenerMensajes();
      this.mensajes.set(historial || []);
      this.scrollAlFinal();
      
    } catch (e) {
      // Error al cargar
      this.huboErrorAlCargar.set(true);
    }
    this.conectarRealtime();
  }

  conectarRealtime() {
    // Creamos un único canal llamado 'chat-global'
    this.chatChannel = this.foroService.getSupabase()
      .channel('chat-global') 
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'mensajes' 
        }, 
        (payload) => {
          // Recibimos el mensaje de la DB y actualizamos la signal
          this.mensajes.update(actuales => [...actuales, payload.new]);
          this.scrollAlFinal();
        }
      )
      .subscribe();
  }

  async enviar() {
    const user = this.usuario();
    console.log("Usuario actual:", user);
    if (!this.nuevoMensaje.trim() || !user) return;

    const mensajeParaEnviar = {
      usuario: user.email || 'Anónimo',
      texto: this.nuevoMensaje,
      uid: user.id || user.id 
    };

    try {
      // Guardamos en Supabase
      this.errorEnvio.set(false);
      await this.foroService.enviarMensaje(mensajeParaEnviar);
      this.nuevoMensaje = ''; 
    } catch (e) {
      console.error("Error al enviar:", e);
      // Feedback sutil: hacemos que el input brille en ámbar
      this.errorEnvio.set(true);
      // Quitamos el efecto después de 2 segundos
      setTimeout(() => this.errorEnvio.set(false), 2000);  
    }
  }

  scrollAlFinal() {
    setTimeout(() => {
      const chatWindow = document.querySelector('.chat-window');
      if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    }, 50);
  }

  ngOnDestroy() {
    // Limpieza: Cerramos la conexión al canal al destruir el componente
    if (this.chatChannel) {
      this.foroService.getSupabase().removeChannel(this.chatChannel);
    }
  }

  
}