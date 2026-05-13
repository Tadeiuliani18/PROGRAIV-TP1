import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
    providedIn: 'root'
})
export class GamesService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            'https://juabsfiadktunxbkvrcc.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1YWJzZmlhZGt0dW54Ymt2cmNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc5MTE4NywiZXhwIjoyMDkzMzY3MTg3fQ.BMYv7BF50Ye5BTqrdUr7fRaZu-_RWTh8uBDtNT0Xh14'
        );
    }

    async saveGameResult(result: {
        userId: string | null;
        gameName: string;
        tiempo : number; 
        fecha: Date;
        score: number;
    }) {
        if (!result.userId) {
            console.warn('No se puede guardar resultado sin usuario.');
            return;
        }

        const { error } = await this.supabase.from('games_results').insert([
            {
                id_usuario: result.userId,
                juego: result.gameName,
                puntaje: result.score,
                tiempo: result.tiempo,
                fecha: result.fecha.toISOString(),
                detalles: { }
            }
        ]);

        if (error) {
            console.error('Error guardando en games_results:', error.message);
            throw error;
        }
    }
}
