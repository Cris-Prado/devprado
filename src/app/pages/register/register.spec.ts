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
});
