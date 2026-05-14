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

    async getRanking(gameName: string, limit: number = 10) {
        const { data, error } = await this.supabase
        .from('games_results')
        .select(`
        id,
        puntaje,
        tiempo,
        fecha,
        juego,
        id_usuario,
        usuarios!left (
            nombre
        )
        `) 
        .eq('juego', gameName)
        .order('puntaje', { ascending: false })
        .order('tiempo', { ascending: true })
        .limit(limit);    

        if (error) throw error;
  
        return data.map(item => {
            const info = Array.isArray(item.usuarios) ? item.usuarios[0] : item.usuarios;
            return {
            ...item,
            nombreUsuario: info?.nombre || 'Anónimo'
            };
        });
}
}