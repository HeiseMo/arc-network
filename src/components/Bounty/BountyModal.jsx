import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Clock, Trophy, User, Image as ImageIcon, Target, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import ConfirmationForm from './ConfirmationForm';

export default function BountyModal({ bounty, onClose, onUpdate }) {
  const { user } = useAuth();
  const [reporter, setReporter] = useState(null);
  const [confirmations, setConfirmations] = useState([]);
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [processing, setProcessing] = useState(false);

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
      .select('*, users(username, reputation)')
      .eq('bounty_id', bounty.id)
      .order('confirmed_at', { ascending: false });

    if (data) setConfirmations(data);
  };

  const getStatusColor = () => {
    switch (bounty.status) {
      case 'active':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'expired':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const updateTimeRemaining = () => {
    // Handle unlimited bounties
    if (bounty.active_period === 'unlimited') {
      setTimeRemaining('UNLIMITED');
      return;
    }

    const now = new Date();
    const created = new Date(bounty.created_at);
    
    // Calculate expiration based on active_period
    let expirationTime;
    if (bounty.active_period === '24h') {
      expirationTime = new Date(created.getTime() + 24 * 60 * 60 * 1000);
    } else if (bounty.active_period === '1week') {
      expirationTime = new Date(created.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else {
      setTimeRemaining('UNLIMITED');
      return;
    }

    const diff = expirationTime - now;

    if (diff <= 0) {
      setTimeRemaining('EXPIRED');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      setTimeRemaining(`${days}D ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    } else {
      setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    }
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

  const handleApproveConfirmation = async (confirmationId, hunterId) => {
    setProcessing(true);
    try {
      // Update bounty status to confirmed
      const { error: bountyError } = await supabase
        .from('bounties')
        .update({ status: 'confirmed' })
        .eq('id', bounty.id);

      if (bountyError) throw bountyError;

      // Mark confirmation as verified
      const { error: confirmError } = await supabase
        .from('confirmations')
        .update({ verified: true })
        .eq('id', confirmationId);

      if (confirmError) throw confirmError;

      // Award reputation to hunter (+10)
      const { data: hunterData } = await supabase
        .from('users')
        .select('reputation')
        .eq('id', hunterId)
        .single();

      if (hunterData) {
        await supabase
          .from('users')
          .update({ reputation: hunterData.reputation + 10 })
          .eq('id', hunterId);
      }

      // Award reputation to reporter (+5)
      const { data: reporterData } = await supabase
        .from('users')
        .select('reputation')
        .eq('id', bounty.reporter_id)
        .single();

      if (reporterData) {
        await supabase
          .from('users')
          .update({ reputation: reporterData.reputation + 5 })
          .eq('id', bounty.reporter_id);
      }

      fetchConfirmations();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error approving confirmation:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectConfirmation = async (confirmationId) => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('confirmations')
        .delete()
        .eq('id', confirmationId);

      if (error) throw error;

      fetchConfirmations();
    } catch (error) {
      console.error('Error rejecting confirmation:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmSuccess = () => {
    setShowConfirmForm(false);
    fetchConfirmations();
    if (onUpdate) onUpdate();
  };

  const isReporter = user && user.id === bounty.reporter_id;
  const canClaim = bounty.status === 'active' && user && !isReporter;

  return createPortal(
    <div 
      className="fixed bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn" 
      style={{ 
        zIndex: 10000,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onClick={onClose}
    >
      {/* Wrapper for corner brackets - stays fixed at visible corners */}
      <div className="relative w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh]">
        {/* Corner Brackets - Fixed to wrapper */}
        <div className="absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-orange-500 z-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-orange-500 z-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-orange-500 z-20 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-orange-500 z-20 pointer-events-none"></div>

        {/* Scrollable Content */}
        <div
          className="crt-frame-static w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >

        {/* Header Bar */}
        <div className="sticky top-0 bg-gradient-to-r from-rust-900/95 to-rust-800/95 backdrop-blur-sm border-b-2 border-orange-500 p-3 sm:p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 animate-pulse" />
            <h2 className="text-base sm:text-xl font-bold text-orange-400 uppercase tracking-wider font-mono">
              [ BOUNTY DOSSIER ]
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-rust-700/50 transition-colors border border-orange-500/30 hover:border-orange-500"
            style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
          </button>
        </div>

        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Target Header */}
          <div className="relative">
            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-rust-600"></div>
            <div className="pl-3 sm:pl-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                <h3 className="text-2xl sm:text-4xl font-bold text-orange-400 uppercase tracking-wider font-mono break-words" style={{ textShadow: '0 0 20px rgba(249, 115, 22, 0.5)' }}>
                  {bounty.target_name}
                </h3>
                <span className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-wider border-2 ${getStatusColor()} animate-pulse w-fit`} style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 25%, 100% 75%, 95% 100%, 5% 100%, 0% 75%, 0% 25%)' }}>
                  {bounty.status}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                <span className="text-gray-400 font-mono">
                  REPORTED BY: <span className="font-bold text-orange-400">{reporter?.username || 'LOADING...'}</span>
                  {reporter && <span className="ml-2 sm:ml-3 text-gray-500">[ REP: {reporter.reputation} ]</span>}
                </span>
              </div>
            </div>
          </div>

          {/* Proof Image/Video */}
          {bounty.proof_url && (
            <div className="card-weathered border-orange-500/30 p-2">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-orange-500/30">
                <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">VISUAL PROOF</span>
              </div>
              <div className="relative overflow-hidden" style={{ clipPath: 'polygon(2% 0%, 98% 0%, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0% 98%, 0% 2%)' }}>
                {bounty.proof_url.includes('.mp4') || bounty.proof_url.includes('.webm') ? (
                  <video src={bounty.proof_url} controls className="w-full" />
                ) : (
                  <img src={bounty.proof_url} alt="Proof" className="w-full" />
                )}
              </div>
            </div>
          )}

          {/* Intelligence Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="card-weathered border-denim-600/30 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-denim-600/30">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-denim-400" />
                <span className="text-xs font-bold text-denim-400 uppercase tracking-wider">LAST KNOWN LOCATION</span>
              </div>
              <p className="text-white font-mono text-sm sm:text-lg font-bold break-words">{bounty.last_location}</p>
            </div>

            <div className="card-weathered border-denim-600/30 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-denim-600/30">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-denim-400" />
                <span className="text-xs font-bold text-denim-400 uppercase tracking-wider">SESSION ID</span>
              </div>
              <p className="text-white font-mono text-sm sm:text-lg font-bold break-all">{bounty.session_id}</p>
            </div>

            {bounty.time_left_when_killed && (
              <div className="card-weathered border-orange-600/30 p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-orange-600/30">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">TIME LEFT IN SESSION</span>
                </div>
                <p className="text-white font-mono text-sm sm:text-lg font-bold">{bounty.time_left_when_killed} MIN</p>
              </div>
            )}

            <div className="card-weathered border-olive-600/30 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-olive-600/30">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-olive-400" />
                <span className="text-xs font-bold text-olive-400 uppercase tracking-wider">ACTIVE PERIOD</span>
              </div>
              <p className="text-white font-mono text-sm sm:text-lg font-bold uppercase">
                {bounty.active_period === '24h' && '24 HOURS'}
                {bounty.active_period === '1week' && '1 WEEK'}
                {bounty.active_period === 'unlimited' && 'UNLIMITED'}
              </p>
            </div>
          </div>

          {/* Intelligence Brief */}
          {bounty.description && (
            <div className="card-weathered border-olive-600/30 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-olive-600/30">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-olive-400" />
                <span className="text-xs font-bold text-olive-400 uppercase tracking-wider">INTELLIGENCE BRIEF</span>
              </div>
              <p className="text-gray-300 font-mono text-sm sm:text-base leading-relaxed break-words">{bounty.description}</p>
            </div>
          )}

          {/* Reward */}
          {bounty.reward_offer && (
            <div className="relative overflow-hidden card-weathered border-orange-500/50 p-3 sm:p-4 bg-gradient-to-r from-orange-900/20 to-rust-900/20">
              <div className="absolute top-0 right-0 opacity-10">
                <Trophy className="w-24 h-24 sm:w-32 sm:h-32 text-orange-500" />
              </div>
              <div className="relative flex items-center gap-3 sm:gap-4">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 animate-pulse" />
                <div>
                  <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">BOUNTY REWARD</p>
                  <p className="text-lg sm:text-2xl text-white font-bold font-mono break-words">{bounty.reward_offer}</p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs sm:text-sm font-mono pt-4 border-t-2 border-orange-500/30">
            <span className="text-gray-400">
              POSTED: <span className="text-white">{new Date(bounty.created_at).toLocaleString()}</span>
            </span>
            <span className={`font-bold ${timeRemaining === 'EXPIRED' ? 'text-red-400 animate-pulse' : timeRemaining === 'UNLIMITED' ? 'text-green-400' : 'text-orange-400'}`}>
              {timeRemaining === 'UNLIMITED' ? '∞ UNLIMITED' : `TIME: ${timeRemaining}`}
            </span>
          </div>

          {bounty.status === 'active' && user && user.id !== bounty.reporter_id && !showConfirmForm && (
            <button
              onClick={() => setShowConfirmForm(true)}
              className="w-full btn-tactical bg-gradient-to-r from-orange-600 to-orange-500 border-orange-400 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2 sm:gap-3 group"
            >
              <Target className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="truncate">[ CLAIM BOUNTY - SUBMIT PROOF ]</span>
              <Target className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          )}

          {showConfirmForm && (
            <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t-2 border-orange-500/50 bg-rust-900/20 -mx-3 sm:-mx-6 px-3 sm:px-6 pb-4 sm:pb-6">
              <div className="mb-4 flex items-center justify-between pb-3 border-b border-orange-500/30">
                <h4 className="text-sm sm:text-lg font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2 font-mono">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                  <span className="hidden sm:inline">[ SUBMIT KILL CONFIRMATION ]</span>
                  <span className="sm:hidden">[ SUBMIT PROOF ]</span>
                </h4>
                <button
                  onClick={() => setShowConfirmForm(false)}
                  className="p-1.5 sm:p-2 hover:bg-rust-700/50 transition-colors border border-orange-500/30 hover:border-orange-500"
                  style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }}
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                </button>
              </div>
              <ConfirmationForm
                bountyId={bounty.id}
                onSuccess={handleConfirmSuccess}
                onCancel={() => setShowConfirmForm(false)}
              />
            </div>
          )}

          {confirmations.length > 0 && (
            <div className="pt-6 border-t-2 border-orange-500/30">
              <h4 className="text-lg font-bold text-orange-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Kill Confirmations ({confirmations.length})
              </h4>
              <div className="space-y-4">
                {confirmations.map(confirmation => (
                  <div
                    key={confirmation.id}
                    className="card-weathered border-orange-500/20"
                  >
                    <div className="flex items-start gap-4">
                      {confirmation.proof_url && (
                        <div className="relative group">
                          <img
                            src={confirmation.proof_url}
                            alt="Confirmation proof"
                            className="w-32 h-32 object-cover border-2 border-orange-500/30 group-hover:border-orange-500 transition-colors"
                            style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)' }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="w-4 h-4 text-orange-400" />
                          <p className="text-white font-bold font-mono text-lg">
                            {confirmation.users?.username}
                          </p>
                          <span className="px-2 py-1 bg-steel-800/50 border border-steel-600 text-steel-300 text-xs font-bold font-mono">
                            REP: {confirmation.users?.reputation || 0}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 font-mono flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(confirmation.confirmed_at).toLocaleString()}
                        </p>
                        {confirmation.session_id && (
                          <p className="text-xs text-gray-500 font-mono mt-1 flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            SESSION: {confirmation.session_id}
                          </p>
                        )}
                        {confirmation.verified && (
                          <span className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-green-900/30 text-green-400 text-xs font-bold uppercase tracking-wider border-2 border-green-500 animate-pulse" style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 25%, 100% 75%, 95% 100%, 5% 100%, 0% 75%, 0% 25%)' }}>
                            <CheckCircle className="w-4 h-4" />
                            VERIFIED - KILL CONFIRMED
                          </span>
                        )}

                        {/* Approve/Reject Buttons - Only for Reporter */}
                        {isReporter && !confirmation.verified && (
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() => handleApproveConfirmation(confirmation.id, confirmation.hunter_id)}
                              disabled={processing}
                              className="flex-1 btn-tactical bg-gradient-to-r from-green-700 to-green-600 border-green-500 text-white font-bold py-3 px-4 uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CheckCircle className="w-5 h-5" />
                              [ APPROVE ]
                            </button>
                            <button
                              onClick={() => handleRejectConfirmation(confirmation.id)}
                              disabled={processing}
                              className="flex-1 btn-tactical bg-gradient-to-r from-rust-700 to-rust-600 border-rust-500 text-white font-bold py-3 px-4 uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <XCircle className="w-5 h-5" />
                              [ REJECT ]
                            </button>
                          </div>
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
    </div>,
    document.body
  );
}
