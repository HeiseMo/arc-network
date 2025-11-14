import { useState, useEffect } from 'react';
import { MapPin, Clock, Trophy, User, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function BountyCard({ bounty, onClick }) {
  const [reporter, setReporter] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    fetchReporter();
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [bounty]);

  const fetchReporter = async () => {
    const { data } = await supabase
      .from('users')
      .select('username')
      .eq('id', bounty.reporter_id)
      .maybeSingle();

    if (data) setReporter(data);
  };

  const updateTimeRemaining = () => {
    const now = new Date();
    const expires = new Date(bounty.expires_at);
    const diff = expires - now;

    if (diff <= 0) {
      setTimeRemaining('Expired');
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTimeRemaining(`${hours}h ${minutes}m`);
  };

  const getStatusColor = () => {
    switch (bounty.status) {
      case 'active':
        return 'bg-green-900/20 text-green-400 border-green-700';
      case 'claimed':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-700';
      case 'confirmed':
        return 'bg-blue-900/20 text-blue-400 border-blue-700';
      case 'expired':
        return 'bg-gray-900/20 text-gray-400 border-gray-700';
      default:
        return 'bg-gray-900/20 text-gray-400 border-gray-700';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white">{bounty.target_name}</h3>
            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor()}`}>
              {bounty.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <User className="w-3.5 h-3.5" />
            <span>Reported by {reporter?.username || 'Loading...'}</span>
          </div>
        </div>

        {bounty.proof_url && (
          <div className="ml-3">
            <div className="w-16 h-16 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
              <img
                src={bounty.proof_url}
                alt="Proof"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>{bounty.last_location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>Session: <span className="font-mono font-semibold">{bounty.session_id}</span></span>
        </div>

        {bounty.reward_offer && (
          <div className="flex items-center gap-2 text-sm text-yellow-400">
            <Trophy className="w-4 h-4" />
            <span>{bounty.reward_offer}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between text-xs text-gray-500">
        <span>{timeRemaining} remaining</span>
        <span>{new Date(bounty.created_at).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
