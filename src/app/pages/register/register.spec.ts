import { AuthApiError } from '@supabase/supabase-js';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            login: vi.fn(),
            register: vi.fn(),
            loginWithGoogle: vi.fn(),
            isAuthenticated: () => false,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('rejects invalid submission without calling authentication', async () => {
    await component.submit();
    expect(component.error()).toBeTruthy();
    expect(TestBed.inject(AuthService).register).not.toHaveBeenCalled();
  });
  it('requests signup and explains email confirmation', async () => {
    component.form.setValue({
      name: 'Cristiano',
      email: 'user@example.com',
      password: 'password123',
    });
    await component.submit();
    expect(TestBed.inject(AuthService).register).toHaveBeenCalledWith(
      'Cristiano',
      'user@example.com',
      'password123',
    );
    expect(component.message()).toContain('confirmação');
    expect(component.busy()).toBe(false);
  });
  it('starts Google login without requiring email or password', async () => {
    fixture.nativeElement.querySelector('.google-button').click();
    await fixture.whenStable();
    expect(TestBed.inject(AuthService).loginWithGoogle).toHaveBeenCalledTimes(1);
    expect(TestBed.inject(AuthService).login).not.toHaveBeenCalled();
    expect(TestBed.inject(AuthService).register).not.toHaveBeenCalled();
  });
  it('shows an error and re-enables Google login on failure', async () => {
    vi.mocked(TestBed.inject(AuthService).loginWithGoogle).mockRejectedValueOnce(
      new Error('OAuth failed'),
    );
    await component.loginWithGoogle();
    expect(component.error()).toContain('Google');
    expect(component.busy()).toBe(false);
  });
  it('renders the actual signup failure as a useful message', async () => {
    vi.mocked(TestBed.inject(AuthService).register).mockRejectedValueOnce(
      new AuthApiError('Email rate limit exceeded', 429, 'over_email_send_rate_limit'),
    );
    component.form.setValue({
      name: 'Cristiano',
      email: 'user@example.com',
      password: 'password123',
    });
    await component.submit();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'limite de envio',
    );
    expect(component.message()).toBe('');
    expect(component.busy()).toBe(false);
  });
});
