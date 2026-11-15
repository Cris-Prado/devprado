import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { AuthCallback } from './auth-callback';

describe('AuthCallback', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/auth/callback');
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            ready: Promise.resolve(),
            completeOAuth: vi.fn().mockResolvedValue(undefined),
          },
        },
      ],
    });
  });
  afterEach(() => window.history.replaceState({}, '', '/'));
  it('exchanges a PKCE code and removes it from the URL', async () => {
    window.history.replaceState({}, '', '/auth/callback?code=test-code');
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const component = TestBed.runInInjectionContext(() => new AuthCallback());
    await component.ngOnInit();
    expect(TestBed.inject(AuthService).completeOAuth).toHaveBeenCalledWith('test-code');
    expect(window.location.search).toBe('');
    expect(navigate).toHaveBeenCalledWith(['/dashboard'], { replaceUrl: true });
  });
  it('shows a recoverable error for a missing code', async () => {
    const component = TestBed.runInInjectionContext(() => new AuthCallback());
    await component.ngOnInit();
    expect(component.message()).toContain('Não foi possível');
    expect(TestBed.inject(AuthService).completeOAuth).not.toHaveBeenCalled();
  });
  it('does not exchange a cancelled OAuth request', async () => {
    window.history.replaceState({}, '', '/auth/callback?error=access_denied&code=ignored');
    const component = TestBed.runInInjectionContext(() => new AuthCallback());
    await component.ngOnInit();
    expect(component.message()).toContain('Não foi possível');
    expect(TestBed.inject(AuthService).completeOAuth).not.toHaveBeenCalled();
  });
});
