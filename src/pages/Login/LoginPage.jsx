import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DEMO_CREDENTIALS, ROLE_LIST, ROLES } from '../../constants';

export default function LoginPage() {
  const { login, quickLogin, isAuthenticated, isPlatformAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={isPlatformAdmin ? '/superadmin' : '/dashboard'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) navigate(res.redirectTo || '/dashboard');
    else setError(res.error);
  };

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-[48%] flex-col justify-between bg-navy-900 p-10 text-white lg:flex">
        <div>
          <p className="text-2xl font-bold tracking-tight">RugOS / ExportOS</p>
          <p className="mt-2 max-w-md text-sm text-slate-300">
            SaaS for commerce · inventory · warehouse · shipping · export/import · finance
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-lg font-semibold">One product. Two modes. Superadmin chooses.</p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Platform Superadmin manages plans & activations</li>
            <li>• Each tenant runs Export OR Import — never both</li>
            <li>• Same modules; mode is assigned at approval</li>
          </ul>
        </div>
        <Link to="/" className="text-sm text-blue-300 hover:text-blue-200">← Back to marketing site</Link>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <p className="text-xl font-bold text-navy-900">RugOS / ExportOS</p>
            <p className="text-sm text-slate-500">Sign in to tenant app or Superadmin</p>
          </div>
          <h1 className="text-xl font-semibold text-navy-900">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Platform admin, export tenant, or import tenant demos.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="label-field">Email</label>
              <input id="email" type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
            </div>
            <div>
              <label htmlFor="password" className="label-field">Password</label>
              <input id="password" type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 space-y-2 rounded-lg border border-border bg-slate-50 p-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">Demo accounts (password: demo123)</p>
            <p><strong>Superadmin:</strong> admin@rugos.demo</p>
            <p><strong>Export tenant:</strong> tenant@rugos.demo</p>
            <p><strong>Import tenant:</strong> import@rugos.demo</p>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Quick login (tenant roles)</p>
            <div className="grid grid-cols-2 gap-2">
              {ROLE_LIST.filter((r) => r !== 'Sales').map((r) => (
                <button
                  key={r}
                  type="button"
                  className="btn-secondary justify-center text-xs"
                  onClick={() => {
                    const res = quickLogin(r);
                    navigate(res?.redirectTo || (r === ROLES.SUPER_ADMIN ? '/superadmin' : '/dashboard'));
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
