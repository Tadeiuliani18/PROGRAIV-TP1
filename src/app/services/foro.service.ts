import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class ForoService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://juabsfiadktunxbkvrcc.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1YWJzZmlhZGt0dW54Ymt2cmNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc5MTE4NywiZXhwIjoyMDkzMzY3MTg3fQ.BMYv7BF50Ye5BTqrdUr7fRaZu-_RWTh8uBDtNT0Xh14'
    );
  }

  async obtenerMensajes() {
    const { data, error } = await this.supabase
      .from('mensajes')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error al obtener mensajes:', error.message);
      throw error;
    }
    return data;
  }

  async enviarMensaje(mensaje: { usuario: string; texto: string; uid: string }) {
    const { error } = await this.supabase
      .from('mensajes')
      .insert([
        {
          usuario_nombre: mensaje.usuario,
          contenido: mensaje.texto,
          usuario_id: mensaje.uid
        }
      ]);

    if (error) {
      console.error('Error al enviar mensaje:', error.message);
      throw error;
    }
  }

  getSupabase() {
    return this.supabase;
  }
}