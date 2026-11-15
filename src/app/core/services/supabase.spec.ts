import { TestBed } from '@angular/core/testing';
import { SUPABASE_CLIENT_FACTORY, SupabaseService } from './supabase';
import { environment } from '../../../environments/environment';

describe('SupabaseService', () => {
  it('configures a persistent PKCE client with explicit callback handling', () => {
    const client = { auth: {} };
    const createClient = vi.fn().mockReturnValue(client);
    TestBed.configureTestingModule({
      providers: [{ provide: SUPABASE_CLIENT_FACTORY, useValue: createClient }],
    });
    const service = TestBed.inject(SupabaseService);
    expect(createClient).toHaveBeenCalledWith(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        flowType: 'pkce',
        detectSessionInUrl: false,
      },
    });
    expect(service.client).toBe(client);
  });
});
