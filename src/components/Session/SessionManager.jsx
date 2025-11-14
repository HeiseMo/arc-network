import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Radio, Circle, AlertCircle } from 'lucide-react';

export default function SessionManager() {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('activeSession');
    if (stored) {
      const data = JSON.parse(stored);
      setSessionId(data.sessionId || '');
      setIsActive(data.isActive || false);
    }

    loadActiveSession();
  }, [user]);

  const loadActiveSession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('active_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSessionId(data.session_id);
        setIsActive(true);
        localStorage.setItem('activeSession', JSON.stringify({
          sessionId: data.session_id,
          isActive: true,
          lastUpdated: data.last_updated,
        }));
      }
    } catch (err) {
      console.error('Error loading active session:', err);
    }
  };

  const validateSessionId = (id) => {
    const pattern = /^[A-Z0-9]{5}-[A-Z0-9]{4}$/;
    return pattern.test(id);
  };

  const toggleActiveStatus = async () => {
    if (!sessionId.trim()) {
      setError('Please enter a session ID first');
      return;
    }

    if (!validateSessionId(sessionId.toUpperCase())) {
      setError('Invalid session ID format. Expected format: XXXXX-XXXXX-XXXXX');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const normalizedSessionId = sessionId.toUpperCase();

      if (!isActive) {
        const { error } = await supabase
          .from('active_sessions')
          .upsert({
            user_id: user.id,
            session_id: normalizedSessionId,
            is_active: true,
            last_updated: new Date().toISOString(),
          }, {
            onConflict: 'user_id,session_id'
          });

        if (error) throw error;

        setIsActive(true);
        localStorage.setItem('activeSession', JSON.stringify({
          sessionId: normalizedSessionId,
          isActive: true,
          lastUpdated: new Date().toISOString(),
        }));
      } else {
        const { error } = await supabase
          .from('active_sessions')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('session_id', normalizedSessionId);

        if (error) throw error;

        setIsActive(false);
        localStorage.setItem('activeSession', JSON.stringify({
          sessionId: normalizedSessionId,
          isActive: false,
          lastUpdated: new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.error('Error toggling active status:', err);
      setError('Failed to update status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Hunter Status</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="sessionId" className="block text-sm font-medium text-gray-300 mb-2">
            Current Session ID
          </label>
          <input
            id="sessionId"
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value.toUpperCase())}
            placeholder="XXXXX-XXXXX-XXXXX"
            maxLength={10}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Find your session ID in the bottom-right corner of your game screen
          </p>
        </div>

        <button
          onClick={toggleActiveStatus}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isActive ? (
            <>
              <Radio className="w-5 h-5" />
              Active - On Duty
            </>
          ) : (
            <>
              <Circle className="w-5 h-5" />
              Inactive - Go On Duty
            </>
          )}
        </button>

        {isActive && (
          <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
            <p className="text-sm text-green-300">
              You'll receive real-time notifications for bounties in session: <span className="font-mono font-bold">{sessionId}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
