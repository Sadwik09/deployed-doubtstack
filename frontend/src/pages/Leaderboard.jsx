import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { leaderboardService } from '../services/user.service';
import { FaTrophy, FaMedal, FaAward, FaStar } from 'react-icons/fa';
import './Leaderboard.css';

const Leaderboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await leaderboardService.getLeaderboard({ period });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (position) => {
    switch (position) {
      case 0:
        return <FaTrophy color="#FFD700" size={24} />;
      case 1:
        return <FaMedal color="#C0C0C0" size={24} />;
      case 2:
        return <FaMedal color="#CD7F32" size={24} />;
      default:
        return <span className="rank-number">{position + 1}</span>;
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <div className="container">
        <div className="page-header">
          <h1>🏆 Leaderboard</h1>
          <p className="text-muted">Top contributors in our community</p>
        </div>

        {/* Period Filter */}
        <div className="period-filter">
          <button
            onClick={() => setPeriod('all')}
            className={`btn ${period === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            All Time
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`btn ${period === 'monthly' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`btn ${period === 'weekly' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            This Week
          </button>
        </div>

        <div className="leaderboard-grid">
          {/* Top Users by Reputation */}
          <div className="leaderboard-section card">
            <h2>
              <FaTrophy color="#f59e0b" /> Top by Reputation
            </h2>
            <div className="leaderboard-list">
              {data?.topUsers?.map((user, index) => (
                <Link to={`/profile/${user._id}`} key={user._id} className="leaderboard-item">
                  <div className="rank-icon">{getMedalIcon(index)}</div>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-meta">
                      {user.role === 'faculty' && (
                        <span className="badge badge-primary">Faculty</span>
                      )}
                      <span className="text-muted">{user.department}</span>
                    </div>
                  </div>
                  <div className="user-score">
                    <div className="score-value">{user.reputation}</div>
                    <div className="score-label">points</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="leaderboard-section card">
            <h2>
              <FaStar color="#10b981" /> Most Active
            </h2>
            <div className="leaderboard-list">
              {data?.topContributors?.map((user, index) => (
                <Link to={`/profile/${user._id}`} key={user._id} className="leaderboard-item">
                  <div className="rank-icon">{getMedalIcon(index)}</div>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-meta">
                      <span className="text-muted">{user.department}</span>
                    </div>
                  </div>
                  <div className="user-score">
                    <div className="score-value">{user.totalActivity}</div>
                    <div className="score-label">activities</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Answerers */}
          <div className="leaderboard-section card">
            <h2>
              <FaAward color="#ef4444" /> Top Answerers
            </h2>
            <div className="leaderboard-list">
              {data?.topAnswerers?.map((item, index) => (
                <Link to={`/profile/${item._id}`} key={item._id} className="leaderboard-item">
                  <div className="rank-icon">{getMedalIcon(index)}</div>
                  <div className="user-info">
                    <div className="user-name">{item.name}</div>
                    <div className="user-meta">
                      <span className="text-muted">{item.answerCount} answers</span>
                      <span>·</span>
                      <span className="text-muted">{item.upvotes} upvotes</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Faculty Verified */}
          {data?.facultyVerified?.length > 0 && (
            <div className="leaderboard-section card">
              <h2>
                ✓ Faculty Verified
              </h2>
              <div className="leaderboard-list">
                {data.facultyVerified.map((user, index) => (
                  <Link to={`/profile/${user._id}`} key={user._id} className="leaderboard-item">
                    <div className="rank-icon">{index + 1}</div>
                    <div className="user-info">
                      <div className="user-name">{user.name}</div>
                      <div className="user-meta">
                        <span className="badge badge-success">✓ Verified</span>
                        <span className="text-muted">{user.department}</span>
                      </div>
                    </div>
                    <div className="user-score">
                      <div className="score-value">{user.reputation}</div>
                      <div className="score-label">points</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
