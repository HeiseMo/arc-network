import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Mail, Lock } from 'lucide-react';

export default function Login({ onToggleMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="crt-frame p-8">
        {/* Terminal Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-display font-bold text-vintage-white text-stencil mb-2">
            ACCESS TERMINAL
          </h2>
          <div className="readout inline-block">
            AUTHENTICATION PROTOCOL // v2.47.3
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rust-dark/30 border-2 border-rust flex items-start gap-3 rust-accent">
            <AlertCircle className="w-5 h-5 text-signal-orange mt-0.5 flex-shrink-0 signal-pulse" />
            <p className="text-sm text-vintage-cream font-mono">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs font-display font-semibold uppercase tracking-wider text-steel-light mb-2">
              <Mail className="w-3 h-3 inline mr-1" />
              Transmission ID
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-tactical"
              placeholder="operator@arc-net.sys"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-display font-semibold uppercase tracking-wider text-steel-light mb-2">
              <Lock className="w-3 h-3 inline mr-1" />
              Access Code
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-tactical"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-signal"
          >
            {loading ? '[ AUTHENTICATING ... ]' : '[ GRANT ACCESS ]'}
          </button>
        </form>

        <div className="panel-divider" />

        <div className="mt-6 text-center">
          <p className="text-sm text-steel-light font-mono">
            &gt; NEW OPERATIVE?{' '}
            <button
              onClick={onToggleMode}
              className="text-signal-orange hover:text-signal-ochre font-semibold uppercase transition-colors"
            >
              [REGISTER]
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
