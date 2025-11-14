import { useState, useEffect } from 'react';
import Navbar from '../components/Layout/Navbar';
import SessionManager from '../components/Session/SessionManager';
import BountyForm from '../components/Bounty/BountyForm';
import BountyFeed from '../components/Bounty/BountyFeed';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import NotificationToast from '../components/Notifications/NotificationToast';
import BountyNotificationToast from '../components/Notifications/BountyNotificationToast';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { profile } = useAuth();
  const [activeSessionId, setActiveSessionId] = useState('');
  const [refreshFeed, setRefreshFeed] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('activeSession');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.isActive && data.sessionId) {
        setActiveSessionId(data.sessionId);
      }
    }

    const interval = setInterval(() => {
      const stored = localStorage.getItem('activeSession');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.isActive && data.sessionId) {
          setActiveSessionId(data.sessionId);
        } else {
          setActiveSessionId('');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBountySuccess = () => {
    setRefreshFeed(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <NotificationToast />
      <BountyNotificationToast />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Panel */}
            <div className="crt-frame-static p-6 rust-accent">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-signal-orange signal-pulse"></div>
                <h2 className="text-2xl font-display font-bold text-vintage-white text-stencil">
                  OPERATIVE: {profile?.username}
                </h2>
              </div>
              <p className="text-steel-light font-mono text-sm">
                &gt; MISSION STATUS: ACTIVE // AWAITING TARGET ACQUISITION
              </p>
              <div className="readout mt-2">
                BOUNTY NETWORK SYNCHRONIZED // {new Date().toLocaleTimeString('en-US', { hour12: false })}
              </div>
            </div>

            <BountyFeed activeSessionId={activeSessionId} key={refreshFeed} />
          </div>

          <div className="space-y-6">
            <SessionManager />
            <BountyForm onSuccess={handleBountySuccess} />
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}
