import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';

export default function ConfirmationForm({ bountyId, onSuccess, onCancel }) {
  const { user, profile, updateProfile } = useAuth();
  const [sessionId, setSessionId] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload an image (JPEG, PNG, GIF)');
        return;
      }

      setProofFile(file);
      setError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setProofFile(null);
    setProofPreview(null);
  };

  const uploadProof = async () => {
    if (!proofFile) throw new Error('Proof image is required');

    const fileExt = proofFile.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('bounty-proofs')
      .upload(fileName, proofFile);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('bounty-proofs')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!proofFile) {
      setError('Please upload proof of the kill');
      return;
    }

    const sessionPattern = /^[A-Z0-9]{5}-[A-Z0-9]{4}$/;
    if (!sessionPattern.test(sessionId)) {
      setError('Invalid session ID format. Expected: XXXXX-XXXX');
      return;
    }

    setLoading(true);

    try {
      const proofUrl = await uploadProof();

      const { error: confirmError } = await supabase
        .from('confirmations')
        .insert({
          bounty_id: bountyId,
          hunter_id: user.id,
          proof_url: proofUrl,
          session_id: sessionId.toUpperCase(),
          verified: false,
        });

      if (confirmError) throw confirmError;

      const { error: bountyError } = await supabase
        .from('bounties')
        .update({ status: 'claimed' })
        .eq('id', bountyId);

      if (bountyError) throw bountyError;

      await updateProfile({
        reputation: (profile?.reputation || 0) + 10,
      });

      if (onSuccess) onSuccess();

    } catch (err) {
      console.error('Error submitting confirmation:', err);
      setError(err.message || 'Failed to submit confirmation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="card-weathered border-red-500/50 bg-red-900/20 flex items-start gap-3 animate-pulse">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-300 font-mono">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Session ID Input */}
        <div>
          <label htmlFor="confirmSessionId" className="block text-xs font-bold text-orange-400 uppercase tracking-wider mb-2 font-mono">
            [ SESSION ID ] <span className="text-red-400">*</span>
          </label>
          <input
            id="confirmSessionId"
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value.toUpperCase())}
            placeholder="XXXXX-XXXX"
            maxLength={10}
            required
            className="input-tactical w-full font-mono text-lg tracking-wider"
          />
          <p className="mt-2 text-xs text-gray-500 font-mono">
            &gt; ENTER SESSION WHERE KILL WAS CONFIRMED
          </p>
        </div>

        {/* Proof Upload */}
        <div>
          <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider mb-2 font-mono">
            [ PROOF OF KILL ] <span className="text-red-400">*</span>
          </label>

          {proofPreview ? (
            <div className="relative card-weathered border-orange-500/30 p-2">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-orange-500/30">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-xs font-bold text-green-400 uppercase tracking-wider">IMAGE LOADED</span>
              </div>
              <div className="relative" style={{ clipPath: 'polygon(2% 0%, 98% 0%, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0% 98%, 0% 2%)' }}>
                <img
                  src={proofPreview}
                  alt="Proof preview"
                  className="w-full h-48 object-cover"
                />
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="absolute top-4 right-4 p-2 bg-rust-700 hover:bg-rust-600 border-2 border-rust-500 transition-colors"
                style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <label className="block card-weathered border-dashed border-2 border-orange-500/30 hover:border-orange-500/60 cursor-pointer transition-colors p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <Upload className="w-12 h-12 text-orange-400 mb-3" />
                <p className="text-sm text-orange-400 font-bold uppercase tracking-wider mb-1 font-mono">
                  [ UPLOAD SCREENSHOT ]
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  PNG, JPG, GIF // MAX 10MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </label>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-tactical bg-gradient-to-r from-steel to-steel-dark border-steel-dark text-white font-bold py-3 px-4 uppercase tracking-wider"
          >
            [ CANCEL ]
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-tactical bg-gradient-to-r from-orange-600 to-orange-500 border-orange-400 text-white font-bold py-3 px-4 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                SUBMITTING...
              </>
            ) : (
              '[ SUBMIT CLAIM ]'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
