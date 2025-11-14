import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import BountyCard from './BountyCard';
import BountyModal from './BountyModal';
import { Filter, AlertCircle } from 'lucide-react';

export default function BountyFeed({ activeSessionId }) {
  const [bounties, setBounties] = useState([]);
  const [filteredBounties, setFilteredBounties] = useState([]);
  const [selectedBounty, setSelectedBounty] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBounties();

    const channel = supabase
      .channel('bounties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bounties',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBounties(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setBounties(prev =>
              prev.map(b => b.id === payload.new.id ? payload.new : b)
            );
          } else if (payload.eventType === 'DELETE') {
            setBounties(prev => prev.filter(b => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    applyFilter();
  }, [bounties, filter, activeSessionId]);

  const fetchBounties = async () => {
    try {
      const { data, error } = await supabase
        .from('bounties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setBounties(data || []);
    } catch (err) {
      console.error('Error fetching bounties:', err);
      setError('Failed to load bounties');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = [...bounties];

    if (filter === 'active') {
      filtered = filtered.filter(b => b.status === 'active');
    } else if (filter === 'session' && activeSessionId) {
      filtered = filtered.filter(b => b.session_id === activeSessionId);
    } else if (filter === 'claimed') {
      filtered = filtered.filter(b => b.status === 'claimed');
    }

    setFilteredBounties(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Active Bounties</h2>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Bounties</option>
            <option value="active">Active Only</option>
            {activeSessionId && (
              <option value="session">My Session ({activeSessionId})</option>
            )}
            <option value="claimed">Claimed</option>
          </select>
        </div>
      </div>

      {filteredBounties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No bounties found</p>
          <p className="text-sm text-gray-500 mt-1">Be the first to report a bounty!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBounties.map(bounty => (
            <BountyCard
              key={bounty.id}
              bounty={bounty}
              onClick={() => setSelectedBounty(bounty)}
            />
          ))}
        </div>
      )}

      {selectedBounty && (
        <BountyModal
          bounty={selectedBounty}
          onClose={() => setSelectedBounty(null)}
        />
      )}
    </div>
  );
}
