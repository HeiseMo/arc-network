import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trophy, Target, FileText, Medal, Crown } from 'lucide-react';

export default function Leaderboard() {
  const [topHunters, setTopHunters] = useState([]);
  const [topReporters, setTopReporters] = useState([]);
  const [mostWanted, setMostWanted] = useState([]);
  const [activeTab, setActiveTab] = useState('hunters');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      const { data: hunters } = await supabase
        .from('users')
        .select('id, username, reputation')
        .order('reputation', { ascending: false })
        .limit(10);

      if (hunters) {
        const huntersWithStats = await Promise.all(
          hunters.map(async (hunter) => {
            const { count } = await supabase
              .from('confirmations')
              .select('id', { count: 'exact', head: true })
              .eq('hunter_id', hunter.id);

            return { ...hunter, kills: count || 0 };
          })
        );
        setTopHunters(huntersWithStats);
      }

      const { data: reporters } = await supabase
        .from('users')
        .select('id, username, reputation')
        .order('reputation', { ascending: false })
        .limit(10);

      if (reporters) {
        const reportersWithStats = await Promise.all(
          reporters.map(async (reporter) => {
            const { count } = await supabase
              .from('bounties')
              .select('id', { count: 'exact', head: true })
              .eq('reporter_id', reporter.id);

            return { ...reporter, reports: count || 0 };
          })
        );
        setTopReporters(reportersWithStats);
      }

      const { data: bounties } = await supabase
        .from('bounties')
        .select('target_name')
        .eq('status', 'confirmed');

      if (bounties) {
        const targetCounts = {};
        bounties.forEach(bounty => {
          targetCounts[bounty.target_name] = (targetCounts[bounty.target_name] || 0) + 1;
        });

        const sortedTargets = Object.entries(targetCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([name, count]) => ({ name, deaths: count }));

        setMostWanted(sortedTargets);
      }

    } catch (err) {
      console.error('Error fetching leaderboards:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    if (rank === 0) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-orange-600" />;
    return <span className="text-gray-500 font-bold">{rank + 1}</span>;
  };

  const tabs = [
    { id: 'hunters', label: 'Top Hunters', icon: Target },
    { id: 'reporters', label: 'Top Reporters', icon: FileText },
    { id: 'wanted', label: 'Most Wanted', icon: Trophy },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="border-b border-gray-700">
        <div className="flex">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-900/50'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-900/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'hunters' && (
          <div className="space-y-2">
            {topHunters.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No hunters yet</p>
            ) : (
              topHunters.map((hunter, index) => (
                <div
                  key={hunter.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index < 3 ? 'bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700' : 'bg-gray-900'
                  }`}
                >
                  <div className="w-8 flex justify-center">
                    {getMedalIcon(index)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{hunter.username}</p>
                    <p className="text-sm text-gray-400">{hunter.kills} confirmed kills</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-white">{hunter.reputation}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'reporters' && (
          <div className="space-y-2">
            {topReporters.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No reporters yet</p>
            ) : (
              topReporters.map((reporter, index) => (
                <div
                  key={reporter.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index < 3 ? 'bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700' : 'bg-gray-900'
                  }`}
                >
                  <div className="w-8 flex justify-center">
                    {getMedalIcon(index)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{reporter.username}</p>
                    <p className="text-sm text-gray-400">{reporter.reports} bounties reported</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-white">{reporter.reputation}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'wanted' && (
          <div className="space-y-2">
            {mostWanted.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No confirmed bounties yet</p>
            ) : (
              mostWanted.map((target, index) => (
                <div
                  key={target.name}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index < 3 ? 'bg-gradient-to-r from-red-900/20 to-gray-800 border border-red-700' : 'bg-gray-900'
                  }`}
                >
                  <div className="w-8 flex justify-center">
                    {getMedalIcon(index)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{target.name}</p>
                    <p className="text-sm text-gray-400">High-value target</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-red-500" />
                    <span className="font-bold text-white">{target.deaths} deaths</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
