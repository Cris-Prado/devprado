import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';
import { SupabaseService } from './supabase';

describe('AuthService', () => {
  const session = { user: { id: 'test-user' } };
  let api: any;
  beforeEach(() => {
    api = {
      onAuthStateChange: vi
        .fn()
        .mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      getSession: vi.fn().mockResolvedValue({ data: { session }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      signUp: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      verifyOtp: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: SupabaseService, useValue: { client: { auth: api } } }],
    });
  });
  it('restores a session and clears it on logout', async () => {
    const auth = TestBed.inject(AuthService);
    await auth.ready;
    expect(auth.isAuthenticated()).toBe(true);
    await auth.logout();
    expect(auth.isAuthenticated()).toBe(false);
    expect(auth.user()).toBeNull();
  });
  it('normalizes signup data and supports confirmation without a session', async () => {
    const auth = TestBed.inject(AuthService);
    await auth.ready;
    await auth.register(' Cristiano ', ' TEST@example.com ', 'password123');
    expect(api.signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test@example.com',
        options: expect.objectContaining({ data: { full_name: 'Cristiano' } }),
      }),
    );
    expect(auth.isAuthenticated()).toBe(false);
  });
  it('rejects malformed OTP without a request', async () => {
    const auth = TestBed.inject(AuthService);
    await auth.ready;
    await expect(auth.verifyEmail('test@example.com', '123')).rejects.toThrow();
    expect(api.verifyOtp).not.toHaveBeenCalled();
  });
});
