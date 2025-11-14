import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Target, X } from 'lucide-react';

export default function NotificationToast() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('bounty-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bounties',
        },
        async (payload) => {
          const bounty = payload.new;

          const stored = localStorage.getItem('activeSession');
          if (stored) {
            const { isActive, sessionId } = JSON.parse(stored);

            if (isActive && sessionId === bounty.session_id) {
              const { data: reporter } = await supabase
                .from('users')
                .select('username')
                .eq('id', bounty.reporter_id)
                .maybeSingle();

              const notification = {
                id: bounty.id,
                title: 'New Bounty in Your Session!',
                message: `${reporter?.username || 'Someone'} reported ${bounty.target_name} in your session`,
                sessionId: bounty.session_id,
                timestamp: Date.now(),
              };

              setNotifications(prev => [notification, ...prev]);

              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(notification.title, {
                  body: notification.message,
                  icon: '/vite.svg',
                });
              }

              setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== notification.id));
              }, 10000);
            }
          }
        }
      )
      .subscribe();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className="bg-blue-600 text-white rounded-lg shadow-lg p-4 border-2 border-blue-400 animate-slide-in"
        >
          <div className="flex items-start gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold mb-1">{notification.title}</h4>
              <p className="text-sm text-blue-100">{notification.message}</p>
              <p className="text-xs text-blue-200 mt-1 font-mono">
                Session: {notification.sessionId}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
