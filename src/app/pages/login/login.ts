import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { LoginForms } from '../../layouts/login-forms/login-forms';
import { InputLabel } from '../../shared/components/input-label/input-label';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-login',
  imports: [LoginForms, InputLabel, Icon, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly message = signal('');
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  async submit(): Promise<void> {
    if (this.busy()) return;
    this.error.set('');
    this.message.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Preencha os campos corretamente.');
      return;
    }
    this.busy.set(true);
    try {
      const values = this.form.getRawValue();
      await this.auth.login(values.email, values.password);
      const target = this.route.snapshot.queryParamMap.get('returnUrl');
      await this.router.navigateByUrl(
        target?.startsWith('/') && !target.startsWith('//') ? target : '/dashboard',
      );
    } catch {
      this.error.set(
        'Não foi possível entrar. Confira suas credenciais e a confirmação do e-mail.',
      );
    } finally {
      this.busy.set(false);
    }
  }
  async loginWithGoogle(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      await this.auth.loginWithGoogle();
    } catch {
      this.error.set('Não foi possível iniciar o login com Google.');
    } finally {
      this.busy.set(false);
    }
  }
}
