import { Target, LogOut, User, Trophy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Arc Raiders</h1>
              <p className="text-xs text-gray-400">Bounty Network</p>
            </div>
          </div>

          {profile && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-300">{profile.reputation}</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-white">{profile.username}</span>
              </div>

              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
