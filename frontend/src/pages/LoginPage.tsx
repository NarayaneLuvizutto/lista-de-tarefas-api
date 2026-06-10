import { FormEvent, useState } from 'react';
import { CheckCircle2, LogIn } from 'lucide-react';
import { login } from '../features/auth/authApi';
import type { LoginResponse } from '../features/auth/authTypes';
import { ApiError } from '../shared/api/apiError';

type Props = {
  onSignIn: (session: LoginResponse) => void;
  onCreateAccount: () => void;
};

export function LoginPage({ onSignIn, onCreateAccount }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const session = await login({ email, senha });
      onSignIn(session);
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : 'Nao foi possivel entrar.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="brand-mark" aria-hidden="true">
          <CheckCircle2 size={28} />
        </div>
        <h1>Lista de Tarefas</h1>
        <p>Entre para organizar suas tarefas por data e status.</p>

        <form onSubmit={handleSubmit} className="stack">
          <label>
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Senha
            <input
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              type="password"
              autoComplete="current-password"
              minLength={6}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button" disabled={isSubmitting} type="submit">
            <LogIn size={18} />
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <button className="text-button" onClick={onCreateAccount} type="button">
          Criar uma conta
        </button>
      </section>
    </main>
  );
}
