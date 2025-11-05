import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { doubtService } from '../../services/doubt.service';
import { FaFilter, FaSearch } from 'react-icons/fa';
import './DoubtList.css';

const DoubtList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    subject: searchParams.get('subject') || '',
    department: searchParams.get('department') || '',
    isResolved: searchParams.get('isResolved') || '',
    sort: searchParams.get('sort') || '-createdAt'
  });

  useEffect(() => {
    fetchDoubts();
  }, [searchParams]);

  const fetchDoubts = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams);
      const response = await doubtService.getDoubts(params);
      setDoubts(response.data.doubts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching doubts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = {};
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) params[k] = newFilters[k];
    });
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', filters.search);
  };

  return (
    <div className="doubt-list-page">
      <div className="container">
        <div className="page-header">
          <h1>Browse Doubts</h1>
          <Link to="/doubts/create" className="btn btn-primary">
            Post Doubt
          </Link>
        </div>

        {/* Filters */}
        <div className="filters-section card">
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              placeholder="Search doubts..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="form-control"
            />
            <button type="submit" className="btn btn-primary">
              <FaSearch /> Search
            </button>
          </form>

          <div className="filters">
            <select
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              className="form-control"
            >
              <option value="">All Subjects</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Algorithms">Algorithms</option>
              <option value="Database">Database</option>
              <option value="Operating System">Operating System</option>
              <option value="Networks">Networks</option>
            </select>

            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="form-control"
            >
              <option value="">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="EEE">EEE</option>
            </select>

            <select
              value={filters.isResolved}
              onChange={(e) => handleFilterChange('isResolved', e.target.value)}
              className="form-control"
            >
              <option value="">All Status</option>
              <option value="false">Open</option>
              <option value="true">Resolved</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="form-control"
            >
              <option value="-createdAt">Latest</option>
              <option value="createdAt">Oldest</option>
              <option value="-views">Most Viewed</option>
              <option value="-answerCount">Most Answers</option>
            </select>
          </div>
        </div>

        {/* Doubts List */}
        {loading ? (
          <div className="text-center" style={{ padding: '3rem' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : doubts.length > 0 ? (
          <div className="doubts-container">
            {doubts.map(doubt => (
              <Link to={`/doubts/${doubt._id}`} key={doubt._id} className="doubt-card">
                <div className="doubt-header">
                  <h3>{doubt.title}</h3>
                  {doubt.isUrgent && (
                    <span className="badge badge-danger">Urgent</span>
                  )}
                  <span className={`badge ${doubt.isResolved ? 'badge-success' : 'badge-warning'}`}>
                    {doubt.isResolved ? '✓ Resolved' : 'Open'}
                  </span>
                </div>

                <p className="doubt-description">
                  {doubt.description.substring(0, 150)}...
                </p>

                <div className="doubt-tags">
                  {doubt.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>

                <div className="doubt-footer">
                  <div className="doubt-author">
                    <span>{doubt.author?.name}</span>
                    <span className="text-muted">·</span>
                    <span className="text-muted">{doubt.department}</span>
                  </div>
                  <div className="doubt-stats">
                    <span>{doubt.answerCount} answers</span>
                    <span>·</span>
                    <span>{doubt.views} views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center" style={{ padding: '3rem' }}>
            <p className="text-muted">No doubts found</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handleFilterChange('page', page)}
                className={`btn ${pagination.page === page ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoubtList;
