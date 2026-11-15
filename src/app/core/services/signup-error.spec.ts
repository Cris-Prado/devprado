import { AuthApiError } from '@supabase/supabase-js';
import { signupErrorMessage } from './signup-error';

describe('signupErrorMessage', () => {
  it.each([
    ['weak_password', 'senha mais forte'],
    ['email_address_invalid', 'e-mail é inválido'],
    ['signup_disabled', 'desativado'],
    ['over_email_send_rate_limit', 'limite de envio'],
    ['over_request_rate_limit', 'Muitas tentativas'],
    ['user_already_exists', 'recuperar sua senha'],
  ])('explains %s', (code, expected) => {
    expect(signupErrorMessage(new AuthApiError('Auth failure', 400, code))).toContain(expected);
  });
  it('preserves an unrecognized Auth message for diagnosis', () => {
    expect(signupErrorMessage(new AuthApiError('Custom validation failed', 400, undefined))).toContain(
      'Custom validation failed',
    );
  });
  it('handles connection failures', () => {
    expect(signupErrorMessage(new TypeError('Failed to fetch'))).toContain('conexão');
  });
  it('does not expose unrelated internal exceptions', () => {
    expect(signupErrorMessage(new Error('internal detail'))).not.toContain('internal detail');
  });
});
