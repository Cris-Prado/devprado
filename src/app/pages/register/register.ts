import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { LoginForms } from '../../layouts/login-forms/login-forms';
import { InputLabel } from '../../shared/components/input-label/input-label';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-register',
  imports: [LoginForms, InputLabel, Icon, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly message = signal('');
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/\S/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  async submit(): Promise<void> {
    if (this.busy()) return;
    this.error.set('');
    this.message.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Preencha os campos corretamente. A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    this.busy.set(true);
    try {
      const values = this.form.getRawValue();
      await this.auth.register(values.name, values.email, values.password);
      if (this.auth.isAuthenticated()) await this.router.navigateByUrl('/dashboard');
      else
        this.message.set(
          'Cadastro recebido. Confira seu e-mail e use o link de confirmação antes de entrar.',
        );
    } catch {
      this.error.set('Não foi possível cadastrar. Confira os dados e tente novamente.');
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
