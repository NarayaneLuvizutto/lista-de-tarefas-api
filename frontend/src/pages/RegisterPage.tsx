import { FormEvent, useState } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { register } from '../features/auth/authApi';
import { ApiError } from '../shared/api/apiError';

type Props = {
  onBack: () => void;
  onRegistered: () => void;
};

export function RegisterPage({ onBack, onRegistered }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await register({ nome, email, senha });
      setSuccess('Conta criada. Voce ja pode entrar.');
      setTimeout(onRegistered, 700);
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : 'Nao foi possivel criar a conta.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <button className="icon-link" onClick={onBack} type="button" aria-label="Voltar para login">
          <ArrowLeft size={18} />
          Voltar
        </button>

        <h1>Criar conta</h1>
        <p>Informe seus dados para comecar a usar a lista.</p>

        <form onSubmit={handleSubmit} className="stack">
          <label>
            Nome
            <input value={nome} onChange={(event) => setNome(event.target.value)} minLength={2} required />
          </label>

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
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button className="primary-button" disabled={isSubmitting} type="submit">
            <UserPlus size={18} />
            {isSubmitting ? 'Criando...' : 'Criar conta'}
          </button>
        </form>
      </section>
    </main>
  );
}
