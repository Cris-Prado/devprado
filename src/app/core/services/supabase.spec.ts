import { SupabaseService } from './supabase';
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({ auth: {} })) }));
import { createClient } from '@supabase/supabase-js';
describe('SupabaseService', () => {
  it('configures a persistent PKCE client with explicit callback handling', () => {
    new SupabaseService();
    expect(createClient).toHaveBeenCalledWith(expect.any(String), expect.any(String), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        flowType: 'pkce',
        detectSessionInUrl: false,
      },
    });
  });
});
