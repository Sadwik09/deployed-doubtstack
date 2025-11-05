import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { doubtService } from '../services/doubt.service';
import { userService, leaderboardService } from '../services/user.service';
import { FaQuestionCircle, FaCheckCircle, FaTrophy, FaFire } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [recentDoubts, setRecentDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doubtsRes, platformStats] = await Promise.all([
          doubtService.getDoubts({ author: user.id, limit: 5 }),
          leaderboardService.getPlatformStats()
        ]);

        setRecentDoubts(doubtsRes.data.doubts);
        setStats(platformStats.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <Link to="/doubts/create" className="btn btn-primary">
            Post New Doubt
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
              <FaQuestionCircle color="#1e40af" size={24} />
            </div>
            <div>
              <div className="stat-value">{user?.stats?.questionsAsked || 0}</div>
              <div className="stat-label">Questions Asked</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
              <FaCheckCircle color="#065f46" size={24} />
            </div>
            <div>
              <div className="stat-value">{user?.stats?.answersGiven || 0}</div>
              <div className="stat-label">Answers Given</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
              <FaTrophy color="#92400e" size={24} />
            </div>
            <div>
              <div className="stat-value">{user?.stats?.bestAnswers || 0}</div>
              <div className="stat-label">Best Answers</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fee2e2' }}>
              <FaFire color="#991b1b" size={24} />
            </div>
            <div>
              <div className="stat-value">{user?.reputation || 0}</div>
              <div className="stat-label">Reputation</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">
          <h2>Your Recent Doubts</h2>
          {recentDoubts.length > 0 ? (
            <div className="doubts-list">
              {recentDoubts.map(doubt => (
                <Link to={`/doubts/${doubt._id}`} key={doubt._id} className="doubt-item">
                  <div>
                    <h3>{doubt.title}</h3>
                    <div className="doubt-meta">
                      <span className={`badge ${doubt.isResolved ? 'badge-success' : 'badge-warning'}`}>
                        {doubt.isResolved ? 'Resolved' : 'Open'}
                      </span>
                      <span className="text-muted text-sm">
                        {doubt.answerCount} answers · {doubt.views} views
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted">You haven't posted any doubts yet.</p>
          )}
        </div>

        {/* Platform Stats */}
        {stats && (
          <div className="dashboard-section">
            <h2>Platform Statistics</h2>
            <div className="platform-stats">
              <div className="platform-stat">
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="platform-stat">
                <div className="stat-value">{stats.totalDoubts}</div>
                <div className="stat-label">Total Doubts</div>
              </div>
              <div className="platform-stat">
                <div className="stat-value">{stats.resolvedDoubts}</div>
                <div className="stat-label">Resolved</div>
              </div>
              <div className="platform-stat">
                <div className="stat-value">{stats.resolutionRate}</div>
                <div className="stat-label">Resolution Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
