import { useState, useEffect } from 'react';
import { X, MapPin, Clock, Trophy, User, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import ConfirmationForm from './ConfirmationForm';

export default function BountyModal({ bounty, onClose }) {
  const { user } = useAuth();
  const [reporter, setReporter] = useState(null);
  const [confirmations, setConfirmations] = useState([]);
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    fetchReporter();
    fetchConfirmations();
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [bounty]);

  const fetchReporter = async () => {
    const { data } = await supabase
      .from('users')
      .select('username, reputation')
      .eq('id', bounty.reporter_id)
      .maybeSingle();

    if (data) setReporter(data);
  };

  const fetchConfirmations = async () => {
    const { data } = await supabase
      .from('confirmations')
      .select('*, users(username)')
      .eq('bounty_id', bounty.id)
      .order('confirmed_at', { ascending: false });

    if (data) setConfirmations(data);
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

  const handleConfirmSuccess = () => {
    setShowConfirmForm(false);
    fetchConfirmations();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Bounty Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-white">{bounty.target_name}</h3>
                <span className={`px-3 py-1 rounded text-sm font-medium border ${getStatusColor()}`}>
                  {bounty.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User className="w-4 h-4" />
                <span>
                  Reported by <span className="font-semibold text-white">{reporter?.username || 'Loading...'}</span>
                  {reporter && <span className="ml-2">({reporter.reputation} rep)</span>}
                </span>
              </div>
            </div>
          </div>

          {bounty.proof_url && (
            <div className="rounded-lg overflow-hidden border border-gray-700">
              {bounty.proof_url.includes('.mp4') || bounty.proof_url.includes('.webm') ? (
                <video src={bounty.proof_url} controls className="w-full" />
              ) : (
                <img src={bounty.proof_url} alt="Proof" className="w-full" />
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Last Location</span>
              </div>
              <p className="text-white font-medium">{bounty.last_location}</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Session ID</span>
              </div>
              <p className="text-white font-mono font-medium">{bounty.session_id}</p>
            </div>
          </div>

          {bounty.description && (
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
              <p className="text-white">{bounty.description}</p>
            </div>
          )}

          {bounty.reward_offer && (
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-yellow-400 font-medium">Reward Offered</p>
                  <p className="text-white font-semibold">{bounty.reward_offer}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-700">
            <span>Posted {new Date(bounty.created_at).toLocaleString()}</span>
            <span className="font-medium">{timeRemaining} remaining</span>
          </div>

          {bounty.status === 'active' && user && user.id !== bounty.reporter_id && (
            <button
              onClick={() => setShowConfirmForm(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Claim This Bounty
            </button>
          )}

          {showConfirmForm && (
            <div className="pt-4 border-t border-gray-700">
              <ConfirmationForm
                bountyId={bounty.id}
                onSuccess={handleConfirmSuccess}
                onCancel={() => setShowConfirmForm(false)}
              />
            </div>
          )}

          {confirmations.length > 0 && (
            <div className="pt-4 border-t border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-3">
                Confirmations ({confirmations.length})
              </h4>
              <div className="space-y-3">
                {confirmations.map(confirmation => (
                  <div
                    key={confirmation.id}
                    className="bg-gray-900 rounded-lg p-3 border border-gray-700"
                  >
                    <div className="flex items-start gap-3">
                      {confirmation.proof_url && (
                        <img
                          src={confirmation.proof_url}
                          alt="Confirmation proof"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {confirmation.users?.username}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(confirmation.confirmed_at).toLocaleString()}
                        </p>
                        {confirmation.verified && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-900/20 text-green-400 text-xs rounded border border-green-700">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
