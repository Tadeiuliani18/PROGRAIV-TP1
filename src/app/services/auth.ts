import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabase: SupabaseClient;
  private currentUser: User | null = null;

  constructor() {
    this.supabase = createClient(
      'TU_URL',
      'TU_ANON_KEY'
    );
  }

  async register(email: string, password: string, extraData: any) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    const { error: dbError } = await this.supabase.from('usuarios').insert([
      {
        id: data.user?.id,
        email,
        ...extraData
      }
    ]);

    if (dbError) throw dbError;

    return data;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    this.currentUser = data.user;
    return data;
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.currentUser = null;
  }

  async getUser() {
    const { data } = await this.supabase.auth.getUser();
    this.currentUser = data.user;
    return data.user;
  }

  isLoggedIn() {
    return this.currentUser != null;
  }
}