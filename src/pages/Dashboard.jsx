import { useState, useEffect } from 'react';
import Navbar from '../components/Layout/Navbar';
import SessionManager from '../components/Session/SessionManager';
import BountyForm from '../components/Bounty/BountyForm';
import BountyFeed from '../components/Bounty/BountyFeed';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import NotificationToast from '../components/Notifications/NotificationToast';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <NotificationToast />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, {profile?.username}!
              </h2>
              <p className="text-gray-400">
                Track down your targets and claim your bounties
              </p>
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
