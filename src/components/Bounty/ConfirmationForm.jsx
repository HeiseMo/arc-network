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
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <h4 className="text-lg font-semibold text-white mb-4">Claim Bounty</h4>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="confirmSessionId" className="block text-sm font-medium text-gray-300 mb-1">
            Session ID <span className="text-red-400">*</span>
          </label>
          <input
            id="confirmSessionId"
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value.toUpperCase())}
            placeholder="XXXXX-XXXX"
            maxLength={10}
            required
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Session where you confirmed the kill
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Proof of Kill <span className="text-red-400">*</span>
          </label>

          {proofPreview ? (
            <div className="relative">
              <img
                src={proofPreview}
                alt="Proof preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeFile}
                className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-gray-600 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-400">Click to upload screenshot</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (max 10MB)</p>
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

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Claim'}
          </button>
        </div>
      </form>
    </div>
  );
}
