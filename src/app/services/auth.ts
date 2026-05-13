import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabase: SupabaseClient;
  private currentUser: User | null = null;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.supabase = createClient(
      'https://juabsfiadktunxbkvrcc.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1YWJzZmlhZGt0dW54Ymt2cmNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc5MTE4NywiZXhwIjoyMDkzMzY3MTg3fQ.BMYv7BF50Ye5BTqrdUr7fRaZu-_RWTh8uBDtNT0Xh14'
    );
    this.initializeUser();
  }

  private async initializeUser() {
    const { data } = await this.supabase.auth.getUser();
    this.currentUser = data.user;
    this.userSubject.next(data.user);
  }

  async register(email: string, password: string, extraData: any) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    const { error: loginError } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (loginError) throw loginError;

    const { error: dbError } = await this.supabase.from('usuarios').insert([
      {
        id: data.user?.id,
        email,
        ...extraData
      }
    ]);

    if (dbError) throw dbError;

    this.currentUser = data.user;
    this.userSubject.next(data.user);
    return data;

  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    this.currentUser = data.user;
    this.userSubject.next(data.user);
    return data;
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.currentUser = null;
    this.userSubject.next(null);
  }

  async getUser() {
    const { data } = await this.supabase.auth.getUser();
    this.currentUser = data.user;
    this.userSubject.next(data.user);
    return data.user;
  }

  isLoggedIn() {
    return this.currentUser != null;
  }
}