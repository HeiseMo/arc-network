import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { Target, Radio } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Atmospheric background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-denim-dark via-denim to-steel-dark opacity-20"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 relative">
            <div className="relative">
              {/* Outer ring with rust effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-steel-light to-steel-dark rounded-full p-1 shadow-lg">
                <div className="w-full h-full bg-denim-dark rounded-full"></div>
              </div>
              {/* Icon container */}
              <div className="relative bg-gradient-to-br from-signal-orange to-signal-ochre p-4 rounded-full shadow-crt">
                <Target className="w-12 h-12 text-vintage-white" strokeWidth={2.5} />
              </div>
              {/* Pulsing signal indicator */}
              <div className="absolute -top-1 -right-1">
                <div className="relative">
                  <Radio className="w-5 h-5 text-signal-orange signal-pulse" />
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-display font-bold text-vintage-white text-stencil mb-2 tracking-wider">
            ARC RAIDERS
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-steel"></div>
            <p className="text-steel-light text-sm font-mono uppercase tracking-widest">
              Bounty Hunter Network
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-steel"></div>
          </div>
          <div className="readout mx-auto">
            SYSTEM ONLINE // AWAITING AUTH
          </div>
        </div>

        {isLogin ? (
          <Login onToggleMode={() => setIsLogin(false)} />
        ) : (
          <Register onToggleMode={() => setIsLogin(true)} />
        )}

        {/* Footer terminal text */}
        <div className="mt-8 text-center">
          <p className="text-xs text-steel font-mono opacity-60">
            &gt; ARC BOUNTY NETWORK v2.47.3 // SECURE CONNECTION ESTABLISHED
          </p>
        </div>
      </div>
    </div>
  );
}
