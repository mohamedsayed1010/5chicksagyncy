import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { BACKEND } from '../../cms/config.js';
import { useAuth } from '../auth.jsx';
import { Button, TextInput } from '../ui.jsx';

export default function LoginPage() {
  const { loading, session, isAdmin, api, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next')?.startsWith('/admin') ? params.get('next') : '/admin/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading) return <div className="admin-boot">Checking your session…</div>;
  if (session && isAdmin) return <Navigate to={next} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!email || !password) return setError('Enter your email and password.');
    setBusy(true);
    try {
      const result = await signIn(email.trim(), password);
      if (!result.isAdmin) {
        await signOut();
        setError('This account does not have admin access.');
      } else navigate(next, { replace: true });
    } catch (e) {
      setError(/invalid/i.test(e.message) ? 'Incorrect email or password.' : e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="a-login">
      <form className="a-login__card" onSubmit={submit} noValidate>
        <img src="/assets/identity/logo-dark.webp" alt="5CHICKS" width="150" height="39" />
        <h1>Sign in to the CMS</h1>
        {!api ? (
          <p className="a-state a-state--error" role="alert">
            The CMS backend is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example) and rebuild.
          </p>
        ) : (
          <>
            <TextInput label="Email" type="email" autoComplete="username" value={email} onChange={setEmail} required />
            <TextInput label="Password" type="password" autoComplete="current-password" value={password} onChange={setPassword} required />
            {error && <p className="a-error" role="alert">{error}</p>}
            <Button type="submit" variant="primary" busy={busy}>Sign in</Button>
            {BACKEND === 'mock' && api.mockCredentials && (
              <p className="a-mock-note">
                Local mock backend. Test account: {api.mockCredentials.email} / {api.mockCredentials.password}
              </p>
            )}
          </>
        )}
        <a className="a-login__back" href="/">← Back to the website</a>
      </form>
    </div>
  );
}
