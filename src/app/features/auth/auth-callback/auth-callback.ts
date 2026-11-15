import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
@Component({
  selector: 'app-auth-callback',
  template: `<main><h1>Autenticação</h1><p role="status">{{ message() }}</p>
 <a href="/login">Voltar ao login</a></main>`,
  styles: [`main { min-height: 80dvh; display: grid;
 place-content: center; text-align: center; }`],
})
export class AuthCallback implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly message = signal('Concluindo autenticação...');
  async ngOnInit(): Promise<void> {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('error')) throw new Error('Login cancelado.');
      const code = params.get('code');
      if (!code) throw new Error('Código OAuth não localizado.');
      await this.auth.completeOAuth(code);
      window.history.replaceState(window.history.state, '', '/auth/callback');
      await this.router.navigate(['/dashboard'], { replaceUrl: true });
    } catch {
      this.message.set('Não foi possível concluir o login. Tente novamente.');
    }
  }
}
