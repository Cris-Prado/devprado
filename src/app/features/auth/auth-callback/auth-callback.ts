import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
@Component({
  selector: 'app-auth-callback',
  imports: [RouterLink],
  template: `<main>
    <h1>Autenticação</h1>
    <p role="status">{{ message() }}</p>
    <a routerLink="/login">Voltar ao login</a>
  </main>`,
  styles: [
    `
      main {
        min-height: 80dvh;
        display: grid;
        place-content: center;
        text-align: center;
      }
    `,
  ],
})
export class AuthCallback implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly message = signal('Concluindo autenticação...');
  async ngOnInit(): Promise<void> {
    try {
      await this.auth.ready;
      const params = new URLSearchParams(window.location.search);
      if (params.has('error')) throw new Error('Login cancelado.');
      const code = params.get('code');
      if (!code) throw new Error('Código de confirmação não localizado.');
      await this.auth.completeOAuth(code);
      window.history.replaceState(window.history.state, '', '/auth/callback');
      await this.router.navigate(['/dashboard'], { replaceUrl: true });
    } catch {
      this.message.set(
        'Não foi possível concluir a autenticação. Abra o link no mesmo navegador usado no cadastro ou tente entrar novamente.',
      );
    }
  }
}
