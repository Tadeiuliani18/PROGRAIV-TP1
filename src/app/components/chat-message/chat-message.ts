import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-chat-message',
  imports: [CommonModule],
  templateUrl: './chat-message.html',
  styleUrl: './chat-message.css',
})

export class ChatMessage {
  @Input() nombreUsuario: string = '';
  @Input() texto: string = '';
  @Input() fecha: any;
  @Input() esPropio: boolean = false;
}