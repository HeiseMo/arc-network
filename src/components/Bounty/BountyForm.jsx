import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';

export default function BountyForm({ onSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    sessionId: '',
    targetName: '',
    lastLocation: '',
    description: '',
    rewardOffer: '',
  });
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload an image (JPEG, PNG, GIF) or video (MP4, WEBM)');
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

  const validateForm = () => {
    const sessionPattern = /^[A-Z0-9]{5}-[A-Z0-9]{4}$/;
    if (!sessionPattern.test(formData.sessionId)) {
      setError('Invalid session ID format. Expected: XXXXX-XXXX');
      return false;
    }

    if (formData.targetName.length < 3) {
      setError('Target name must be at least 3 characters');
      return false;
    }

    if (formData.lastLocation.length < 3) {
      setError('Location must be at least 3 characters');
      return false;
    }

    return true;
  };

  const uploadProof = async () => {
    if (!proofFile) return null;

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
    setSuccess(false);

    if (!validateForm()) return;

    setLoading(true);

    try {
      let proofUrl = null;
      if (proofFile) {
        proofUrl = await uploadProof();
      }

      const { error: insertError } = await supabase
        .from('bounties')
        .insert({
          session_id: formData.sessionId.toUpperCase(),
          reporter_id: user.id,
          target_name: formData.targetName,
          last_location: formData.lastLocation,
          description: formData.description || null,
          proof_url: proofUrl,
          reward_offer: formData.rewardOffer || null,
          status: 'active',
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        sessionId: '',
        targetName: '',
        lastLocation: '',
        description: '',
        rewardOffer: '',
      });
      setProofFile(null);
      setProofPreview(null);

      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 2000);

    } catch (err) {
      console.error('Error submitting bounty:', err);
      setError(err.message || 'Failed to submit bounty. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Report a Bounty</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-700 rounded-lg flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-green-300">Bounty posted successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="sessionId" className="block text-sm font-medium text-gray-300 mb-1">
            Session ID <span className="text-red-400">*</span>
          </label>
          <input
            id="sessionId"
            name="sessionId"
            type="text"
            value={formData.sessionId}
            onChange={handleInputChange}
            placeholder="XXXXX-XXXX"
            maxLength={10}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="targetName" className="block text-sm font-medium text-gray-300 mb-1">
            Killer's Name <span className="text-red-400">*</span>
          </label>
          <input
            id="targetName"
            name="targetName"
            type="text"
            value={formData.targetName}
            onChange={handleInputChange}
            placeholder="Enter the player who killed you"
            required
            minLength={3}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="lastLocation" className="block text-sm font-medium text-gray-300 mb-1">
            Last Known Location <span className="text-red-400">*</span>
          </label>
          <input
            id="lastLocation"
            name="lastLocation"
            type="text"
            value={formData.lastLocation}
            onChange={handleInputChange}
            placeholder="e.g., North Base, Mining Site"
            required
            minLength={3}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Additional details about the encounter..."
            rows={3}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label htmlFor="rewardOffer" className="block text-sm font-medium text-gray-300 mb-1">
            Reward Offer (Optional)
          </label>
          <input
            id="rewardOffer"
            name="rewardOffer"
            type="text"
            value={formData.rewardOffer}
            onChange={handleInputChange}
            placeholder="e.g., 500 credits, rare weapon"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Proof (Optional)
          </label>

          {proofPreview ? (
            <div className="relative">
              {proofFile.type.startsWith('image') ? (
                <img
                  src={proofPreview}
                  alt="Proof preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={proofPreview}
                  className="w-full h-48 object-cover rounded-lg"
                  controls
                />
              )}
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
                <p className="text-sm text-gray-400">Click to upload image or video</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, MP4, WEBM (max 10MB)</p>
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Posting Bounty...' : 'Post Bounty'}
        </button>
      </form>
    </div>
  );
}
