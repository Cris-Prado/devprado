import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import type { Session, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly _user = signal<User | null>(null);
  private readonly _session = signal<Session | null>(null);
  private readonly _loading = signal(true);
  readonly user = this._user.asReadonly();
  readonly session = this._session.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user() && !!this._session());
  readonly ready: Promise<void>;
  constructor() {
    const { data } = this.supabase.auth.onAuthStateChange((_event, session) => {
      this.applySession(session);
    });
    inject(DestroyRef).onDestroy(() => data.subscription.unsubscribe());
    this.ready = this.initializeSession();
    void this.ready.catch(() => {
      /* Guards and auth pages handle initialization failures. */
    });
  }
  private applySession(session: Session | null): void {
    this._session.set(session);
    this._user.set(session?.user ?? null);
  }
  private async initializeSession(): Promise<void> {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      if (error) throw error;
      this.applySession(data.session);
    } finally {
      this._loading.set(false);
    }
  }
  async register(name: string, email: string, password: string): Promise<void> {
    const { data, error } = await this.supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    this.applySession(data.session);
  }
  async login(email: string, password: string): Promise<void> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw error;
    this.applySession(data.session);
  }
  async verifyEmail(email: string, token: string): Promise<Session | null> {
    if (!/^\d{6}$/.test(token.trim())) {
      throw new Error('O código deve conter seis dígitos.');
    }
    const { data, error } = await this.supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: token.trim(),
      type: 'email',
    });
    if (error) throw error;
    this.applySession(data.session);
    return data.session;
  }
  async resendConfirmation(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
    });
    if (error) throw error;
  }
  async loginWithGoogle(): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  }
  async completeOAuth(code: string): Promise<void> {
    const { data, error } = await this.supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    this.applySession(data.session);
  }
  async logout(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    this.applySession(null);
  }
}
