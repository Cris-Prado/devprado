import { TestBed } from '@angular/core/testing';
import {
  provideRouter,
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth';
import { authChildGuard } from './auth-guard';

describe('authChildGuard', () => {
  let authenticated: boolean;
  beforeEach(() => {
    authenticated = false;
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { ready: Promise.resolve(), isAuthenticated: () => authenticated },
        },
      ],
    });
  });
  const run = () =>
    TestBed.runInInjectionContext(() =>
      authChildGuard({} as ActivatedRouteSnapshot, { url: '/dashboard' } as RouterStateSnapshot),
    );
  it('redirects anonymous users and preserves the destination', async () => {
    const result = await run();
    expect(TestBed.inject(Router).serializeUrl(result as import('@angular/router').UrlTree)).toBe(
      '/login?returnUrl=%2Fdashboard',
    );
  });
  it('allows authenticated users', async () => {
    authenticated = true;
    expect(await run()).toBe(true);
  });
});
