import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to listen for new bounties in active session
 * Returns new bounty notifications for hunters in the same session
 */
export function useBountyNotifications() {
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(null);

  useEffect(() => {
    // Get active session from localStorage
    const updateActiveSession = () => {
      const stored = localStorage.getItem('activeSession');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.isActive && data.sessionId) {
          setActiveSessionId(data.sessionId);
        } else {
          setActiveSessionId(null);
        }
      }
    };

    updateActiveSession();
    
    // Check for session changes every second
    const interval = setInterval(updateActiveSession, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user || !activeSessionId) return;

    // Subscribe to new bounties in the active session
    const channel = supabase
      .channel(`bounties:${activeSessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bounties',
          filter: `session_id=eq.${activeSessionId}`,
        },
        async (payload) => {
          // Don't notify if this user created the bounty
          if (payload.new.reporter_id === user.id) return;

          // Fetch reporter username
          const { data: reporter } = await supabase
            .from('users')
            .select('username')
            .eq('id', payload.new.reporter_id)
            .single();

          setNotification({
            id: payload.new.id,
            targetName: payload.new.target_name,
            location: payload.new.last_location,
            reporter: reporter?.username || 'Unknown',
            timestamp: new Date(),
          });

          // Clear notification after 10 seconds
          setTimeout(() => setNotification(null), 10000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeSessionId]);

  const clearNotification = () => setNotification(null);

  return { notification, clearNotification, activeSessionId };
}
