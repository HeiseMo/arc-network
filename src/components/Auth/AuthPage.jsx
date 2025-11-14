import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { Target } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Target className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Arc Raiders</h1>
          <p className="text-gray-400 text-lg">Bounty Hunter Network</p>
        </div>

        {isLogin ? (
          <Login onToggleMode={() => setIsLogin(false)} />
        ) : (
          <Register onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
