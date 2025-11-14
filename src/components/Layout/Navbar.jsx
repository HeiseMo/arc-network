import { Target, LogOut, User, Trophy, Radio, Signal, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-gradient-to-r from-steel-dark via-denim-dark to-steel-dark border-b-2 border-steel sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {/* Tactical frame around logo */}
              <div className="absolute inset-0 bg-gradient-to-br from-steel-light to-steel-dark rounded p-0.5">
                <div className="w-full h-full bg-denim-dark rounded"></div>
              </div>
              <div className="relative bg-gradient-to-br from-signal-orange to-signal-ochre p-2.5 rounded shadow-bezel">
                <Target className="w-7 h-7 text-vintage-white" strokeWidth={2.5} />
              </div>
              {/* Signal indicator */}
              <div className="absolute -top-1 -right-1">
                <Signal className="w-4 h-4 text-signal-orange signal-pulse" />
              </div>
            </div>
            
            <div className="border-l-2 border-steel pl-4">
              <h1 className="text-xl font-display font-bold text-vintage-white text-stencil tracking-wider">
                ARC RAIDERS
              </h1>
              <p className="text-xs text-steel-light font-mono uppercase tracking-widest">
                Bounty Network
              </p>
            </div>
          </div>

          {profile && (
            <div className="flex items-center gap-3">
              {/* Navigation Links */}
              <div className="flex gap-2 mr-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`btn-tactical py-2 px-4 text-sm ${
                    location.pathname === '/dashboard' ? 'bg-orange-900/40 border-orange-500' : ''
                  }`}
                >
                  <Target className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/leaderboard')}
                  className={`btn-tactical py-2 px-4 text-sm ${
                    location.pathname === '/leaderboard' ? 'bg-orange-900/40 border-orange-500' : ''
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  Leaderboard
                </button>
                <button
                  onClick={() => navigate('/handbook')}
                  className={`btn-tactical py-2 px-4 text-sm ${
                    location.pathname === '/handbook' ? 'bg-orange-900/40 border-orange-500' : ''
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Handbook
                </button>
              </div>

              {/* Reputation Display */}
              <div className="card-weathered px-4 py-2 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-signal-orange" />
                <div className="flex flex-col">
                  <span className="text-xs text-steel-light font-mono uppercase leading-none">Rep</span>
                  <span className="text-lg font-display font-bold text-vintage-white leading-none">
                    {profile.reputation}
                  </span>
                </div>
              </div>

              {/* User Badge */}
              <div className="relative card-weathered px-4 py-2.5 flex items-center gap-3 rust-accent">
                <User className="w-5 h-5 text-steel-light" />
                <div className="flex flex-col">
                  <span className="text-xs text-steel-light font-mono uppercase leading-none">Operative</span>
                  <span className="text-sm font-display font-semibold text-vintage-white leading-none mt-0.5">
                    {profile.username}
                  </span>
                </div>
                {/* Role indicator */}
                <div className="badge-tactical ml-2">
                  {profile.role === 'hunter' && 'HUNTER'}
                  {profile.role === 'reporter' && 'REPORTER'}
                  {profile.role === 'both' && 'DUAL'}
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="btn-danger p-3"
                title="Disconnect"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-signal-orange to-transparent opacity-50"></div>
    </nav>
  );
}
