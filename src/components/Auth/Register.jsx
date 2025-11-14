import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, User, Mail, Lock } from 'lucide-react';

export default function Register({ onToggleMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, username);

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
            JOIN THE HUNT
          </h2>
          <div className="readout inline-block">
            REGISTRATION PROTOCOL // v2.47.3
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
            <label htmlFor="username" className="block text-xs font-display font-semibold uppercase tracking-wider text-steel-light mb-2">
              <User className="w-3 h-3 inline mr-1" />
              Operative Callsign
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className="input-tactical"
              placeholder="HUNTER_042"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-display font-semibold uppercase tracking-wider text-steel-light mb-2">
              <Mail className="w-3 h-3 inline mr-1" />
              Secure Transmission ID
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
              minLength={6}
              className="input-tactical"
              placeholder="••••••••"
            />
            <p className="mt-2 text-xs text-steel-light font-mono">
              &gt; MINIMUM 6 CHARACTERS REQUIRED
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-signal"
          >
            {loading ? '[ PROCESSING ... ]' : '[ INITIALIZE ACCOUNT ]'}
          </button>
        </form>

        <div className="panel-divider" />

        <div className="mt-6 text-center">
          <p className="text-sm text-steel-light font-mono">
            &gt; ALREADY REGISTERED?{' '}
            <button
              onClick={onToggleMode}
              className="text-signal-orange hover:text-signal-ochre font-semibold uppercase transition-colors"
            >
              [SIGN IN]
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
