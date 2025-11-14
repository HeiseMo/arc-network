import Navbar from '../components/Layout/Navbar';
import LeaderboardComponent from '../components/Leaderboard/Leaderboard';

export default function Leaderboard() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <LeaderboardComponent />
    </div>
  );
}
