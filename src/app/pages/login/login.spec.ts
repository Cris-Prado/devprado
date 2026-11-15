import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
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

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('rejects invalid submission without calling authentication', async () => {
    await component.submit();
    expect(component.error()).toBeTruthy();
    expect(TestBed.inject(AuthService).login).not.toHaveBeenCalled();
  });
  it('submits values from the rendered custom inputs', async () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    for (const [id, value] of [
      ['email', 'user@example.com'],
      ['password', 'password123'],
    ]) {
      const input = fixture.nativeElement.querySelector('#' + id) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(TestBed.inject(AuthService).login).toHaveBeenCalledWith(
      'user@example.com',
      'password123',
    );
    expect(navigate).toHaveBeenCalledWith('/dashboard');
  });
  it('shows an error when credentials are rejected', async () => {
    vi.mocked(TestBed.inject(AuthService).login).mockRejectedValueOnce(
      new Error('Invalid credentials'),
    );
    component.form.setValue({ email: 'user@example.com', password: 'password123' });
    await component.submit();
    expect(component.error()).toBeTruthy();
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
});
