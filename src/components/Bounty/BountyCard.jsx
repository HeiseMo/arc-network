import { useState, useEffect } from 'react';
import { MapPin, Clock, Trophy, User, Image as ImageIcon, AlertTriangle, Target } from 'lucide-react';
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
      setTimeRemaining('EXPIRED');
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  };

  const getStatusStyle = () => {
    switch (bounty.status) {
      case 'active':
        return 'bg-signal-orange/20 text-signal-orange border-signal-ochre';
      case 'claimed':
        return 'bg-olive/20 text-olive border-olive-dark';
      case 'confirmed':
        return 'bg-denim/20 text-denim-light border-denim';
      case 'expired':
        return 'bg-steel-dark/20 text-steel-light border-steel';
      default:
        return 'bg-steel-dark/20 text-steel-light border-steel';
    }
  };

  return (
    <div
      onClick={onClick}
      className="card-weathered p-5 hover:shadow-crt transition-all cursor-pointer relative rust-accent group"
    >
      {/* Corner brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-signal-orange opacity-50"></div>
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-signal-orange opacity-50"></div>
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-signal-orange opacity-50"></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-signal-orange opacity-50"></div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-signal-orange" />
            <h3 className="text-xl font-display font-bold text-vintage-white text-stencil">
              {bounty.target_name}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-steel-light font-mono">
            <User className="w-3.5 h-3.5" />
            <span>&gt; REPORTED BY: </span>
            <span className="text-vintage-cream font-semibold">{reporter?.username || '...'}</span>
          </div>
        </div>

        {bounty.proof_url && (
          <div className="ml-4">
            <div className="w-20 h-20 bg-denim-dark rounded border-2 border-steel-dark overflow-hidden shadow-bezel relative">
              <img
                src={bounty.proof_url}
                alt="Evidence"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 pointer-events-none"></div>
            </div>
          </div>
        )}
      </div>

      {/* Status badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1.5 text-xs font-mono font-bold uppercase border-2 ${getStatusStyle()}`}
              style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
          <div className="w-2 h-2 rounded-full mr-2 signal-pulse bg-current"></div>
          {bounty.status}
        </span>
      </div>

      {/* Info grid */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-sm text-vintage-cream font-mono bg-denim-dark/30 p-2 border border-steel/30">
          <MapPin className="w-4 h-4 text-signal-orange flex-shrink-0" />
          <div className="flex-1">
            <span className="text-xs text-steel-light uppercase block">Last Known Position</span>
            <span className="font-semibold">{bounty.last_location}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-vintage-cream font-mono bg-denim-dark/30 p-2 border border-steel/30">
          <Clock className="w-4 h-4 text-signal-orange flex-shrink-0" />
          <div className="flex-1">
            <span className="text-xs text-steel-light uppercase block">Session ID</span>
            <span className="font-semibold tracking-wider">{bounty.session_id}</span>
          </div>
        </div>

        {bounty.reward_offer && (
          <div className="flex items-center gap-3 text-sm bg-gradient-to-r from-signal-ochre/20 to-signal-orange/20 p-3 border-2 border-signal-orange/50">
            <Trophy className="w-5 h-5 text-signal-orange flex-shrink-0" />
            <div className="flex-1">
              <span className="text-xs text-signal-orange uppercase font-display font-bold block">Bounty Reward</span>
              <span className="text-vintage-white font-display font-semibold">{bounty.reward_offer}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="panel-divider" />
      <div className="mt-3 flex items-center justify-between">
        <div className="readout">
          {timeRemaining} REMAINING
        </div>
        <span className="text-xs text-steel font-mono">
          {new Date(bounty.created_at).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })}
        </span>
      </div>
    </div>
  );
}
