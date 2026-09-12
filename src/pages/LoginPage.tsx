import { useState } from 'react';
import { Logo } from '../components/Logo';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const signInError = await signIn(email, password);
    if (signInError) setError('Incorrect email or password.');
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <Logo size="md" className="mx-auto" />
        <h1 className="mt-5 font-display text-xl text-parchment-50">Leader Dashboard</h1>
        <p className="mt-1 text-sm text-parchment-200/70">Sign in to manage check-ins.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
          <div>
            <label className="text-xs uppercase tracking-widest text-ink-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-md border border-ink-600 bg-ink-900 px-4 py-3 text-parchment-50 outline-none focus:border-gilt-400"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-ink-600">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-md border border-ink-600 bg-ink-900 px-4 py-3 text-parchment-50 outline-none focus:border-gilt-400"
            />
          </div>
          {error && <p className="text-sm text-signal-error">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-gilt-500 py-3 font-semibold text-ink-950 transition-colors hover:bg-gilt-400 disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
