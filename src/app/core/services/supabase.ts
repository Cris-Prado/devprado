import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client = createClient(environment.supabaseUrl, environment.supabaseKey, {
    auth: {
      persistSession: true, autoRefreshToken: true,
      flowType: 'pkce', detectSessionInUrl: false
    }
  });
}
// Métodos essenciais dentro de AuthService
async register(name: string, email: string, password: string) {
  const { data, error } = await this.supabase.auth.signUp({
    email: email.trim().toLowerCase(), password,
    options: { data: { full_name: name.trim() } }
  });
  if (error) throw error;
  return data;
}
async verifyEmail(email: string, token: string) {
  if (!/^\d{6}$/.test(token.trim())) throw new Error('OTP inválido');
  const { data, error } = await this.supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(), token: token.trim(), type: 'email'
  });
  if (error) throw error;
  return data;
}
async resendConfirmation(email: string) {
  const { error } = await this.supabase.auth.resend({
    type: 'signup', email: email.trim().toLowerCase()
  });
  if (error) throw error;
}
async login(email: string, password: string) {
  const { error } = await this.supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}
async loginWithGoogle() {
  const { error } = await this.supabase.auth.signInWithOAuth({
    provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` }
  })
  if (error) throw error;
}
async completeOAuth(code: string) {
  const { data, error } = await this.supabase.auth.exchangeCodeForSession(code);
  if (error) throw error;
  return data;
}
async logout() {
  const { error } = await this.supabase.auth.signOut();
  if (error) throw error;
}
