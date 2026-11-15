import { isAuthError } from '@supabase/supabase-js';

const signupMessages: Record<string, string> = {
  weak_password: 'A senha não atende aos requisitos de segurança. Use uma senha mais forte.',
  email_address_invalid: 'O endereço de e-mail é inválido. Confira e tente novamente.',
  email_address_not_authorized:
    'O envio de confirmação para este endereço não está autorizado. Entre em contato com o suporte.',
  email_exists: 'Não foi possível cadastrar este e-mail. Tente entrar ou recuperar sua senha.',
  user_already_exists:
    'Não foi possível cadastrar este e-mail. Tente entrar ou recuperar sua senha.',
  signup_disabled: 'O cadastro de novas contas está desativado no momento.',
  email_provider_disabled:
    'O cadastro com e-mail está indisponível no momento. Tente continuar com Google.',
  over_email_send_rate_limit:
    'O limite de envio de e-mails de confirmação foi atingido. Aguarde e tente novamente mais tarde.',
  over_request_rate_limit: 'Muitas tentativas em pouco tempo. Aguarde antes de tentar novamente.',
  request_timeout: 'O serviço demorou para responder. Confira sua conexão e tente novamente.',
  captcha_failed: 'Não foi possível validar a verificação de segurança. Tente novamente.',
};

export function signupErrorMessage(error: unknown): string {
  if (isAuthError(error)) {
    if (error.code && signupMessages[error.code]) return signupMessages[error.code];
    if (error.status === 429) return signupMessages['over_request_rate_limit'];
    if (error.status && error.status >= 500)
      return 'O serviço de cadastro está indisponível no momento. Tente novamente mais tarde.';
    // Supabase Auth errors are rendered as plain text by Angular interpolation.
    return error.message
      ? `Não foi possível cadastrar: ${error.message}`
      : 'Não foi possível cadastrar. Tente novamente.';
  }
  if (error instanceof TypeError)
    return 'Não foi possível conectar ao serviço. Confira sua conexão e tente novamente.';
  return 'Não foi possível cadastrar. Tente novamente mais tarde.';
}
