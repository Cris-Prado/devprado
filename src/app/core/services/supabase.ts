import { inject, Injectable, InjectionToken } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export const SUPABASE_CLIENT_FACTORY = new InjectionToken<typeof createClient>(
  'Supabase client factory',
  { providedIn: 'root', factory: () => createClient },
);

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client = inject(SUPABASE_CLIENT_FACTORY)(
    environment.supabaseUrl,
    environment.supabaseKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        flowType: 'pkce',
        detectSessionInUrl: false,
      },
    },
  );
}
