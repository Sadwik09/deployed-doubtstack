import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doubtService } from '../../services/doubt.service';
import { answerService } from '../../services/answer.service';
import { useAuthStore } from '../../store/authStore';
import { 
  FaThumbsUp, 
  FaThumbsDown, 
  FaCheck, 
  FaBookmark,
  FaClock,
  FaEye,
  FaComments
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import './DoubtDetail.css';

const DoubtDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [doubt, setDoubt] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDoubt();
  }, [id]);

  const fetchDoubt = async () => {
    try {
      const response = await doubtService.getDoubtById(id);
      setDoubt(response.data.doubt);
      setAnswers(response.data.answers || []);
    } catch (error) {
      toast.error('Failed to load doubt');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteDoubt = async (voteType) => {
    if (!isAuthenticated) {
      toast.warning('Please login to vote');
      return;
    }

    try {
      await doubtService.voteDoubt(id, voteType);
      fetchDoubt();
      toast.success('Vote recorded');
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const handleVoteAnswer = async (answerId, voteType) => {
    if (!isAuthenticated) {
      toast.warning('Please login to vote');
      return;
    }

    try {
      await answerService.voteAnswer(answerId, voteType);
      fetchDoubt();
      toast.success('Vote recorded');
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.warning('Please login to answer');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', answerContent);
      
      await answerService.createAnswer(id, formData);
      setAnswerContent('');
      fetchDoubt();
      toast.success('Answer posted successfully');
    } catch (error) {
      toast.error('Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    try {
      await answerService.acceptAnswer(answerId);
      fetchDoubt();
      toast.success('Answer marked as best answer');
    } catch (error) {
      toast.error('Failed to accept answer');
    }
  };

  const handleResolve = async () => {
    try {
      await doubtService.resolveDoubt(id);
      fetchDoubt();
      toast.success('Doubt marked as resolved');
    } catch (error) {
      toast.error('Failed to resolve doubt');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
      </div>
    );
  }

  if (!doubt) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <p>Doubt not found</p>
      </div>
    );
  }

  const isAuthor = user?.id === doubt.author._id;

  return (
    <div className="doubt-detail-page">
      <div className="container">
        {/* Doubt Section */}
        <div className="doubt-container card">
          <div className="doubt-header-detail">
            <div className="doubt-badges">
              {doubt.isUrgent && <span className="badge badge-danger">🔥 Urgent</span>}
              <span className={`badge ${doubt.isResolved ? 'badge-success' : 'badge-warning'}`}>
                {doubt.isResolved ? '✓ Resolved' : 'Open'}
              </span>
            </div>
            <h1>{doubt.title}</h1>
            
            <div className="doubt-meta-info">
              <div className="author-info">
                <span className="author-name">{doubt.author.name}</span>
                <span className="text-muted">·</span>
                <span className="text-muted">{doubt.department}</span>
                <span className="text-muted">·</span>
                <span className="text-muted">
                  <FaClock /> {formatDistanceToNow(new Date(doubt.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="doubt-stats-info">
                <span><FaEye /> {doubt.views} views</span>
                <span><FaComments /> {doubt.answerCount} answers</span>
              </div>
            </div>
          </div>

          <div className="doubt-content">
            <p>{doubt.description}</p>
            
            {doubt.tags && doubt.tags.length > 0 && (
              <div className="tags-container">
                {doubt.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}

            {doubt.attachments && doubt.attachments.length > 0 && (
              <div className="attachments">
                <h4>Attachments:</h4>
                {doubt.attachments.map((file, index) => (
                  <a key={index} href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="attachment-link">
                    📎 {file.fileName}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="doubt-actions">
            <div className="vote-buttons">
              <button
                onClick={() => handleVoteDoubt('upvote')}
                className="vote-btn"
                disabled={!isAuthenticated}
              >
                <FaThumbsUp /> {doubt.upvotes?.length || 0}
              </button>
              <button
                onClick={() => handleVoteDoubt('downvote')}
                className="vote-btn"
                disabled={!isAuthenticated}
              >
                <FaThumbsDown /> {doubt.downvotes?.length || 0}
              </button>
            </div>
            
            {isAuthor && !doubt.isResolved && (
              <button onClick={handleResolve} className="btn btn-success btn-sm">
                <FaCheck /> Mark as Resolved
              </button>
            )}
          </div>
        </div>

        {/* Answers Section */}
        <div className="answers-section">
          <h2>{answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}</h2>
          
          {answers.map(answer => (
            <div key={answer._id} className={`answer-card card ${answer.isAccepted ? 'accepted-answer' : ''}`}>
              {answer.isAccepted && (
                <div className="accepted-badge">
                  <FaCheck /> Best Answer
                </div>
              )}
              
              <div className="answer-header">
                <div className="author-info">
                  <span className="author-name">{answer.author.name}</span>
                  {answer.author.role === 'faculty' && (
                    <span className="badge badge-primary">Faculty</span>
                  )}
                  <span className="text-muted">
                    {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div className="answer-content">
                <p>{answer.content}</p>
              </div>

              <div className="answer-actions">
                <div className="vote-buttons">
                  <button
                    onClick={() => handleVoteAnswer(answer._id, 'upvote')}
                    className="vote-btn"
                    disabled={!isAuthenticated}
                  >
                    <FaThumbsUp /> {answer.upvotes?.length || 0}
                  </button>
                  <button
                    onClick={() => handleVoteAnswer(answer._id, 'downvote')}
                    className="vote-btn"
                    disabled={!isAuthenticated}
                  >
                    <FaThumbsDown /> {answer.downvotes?.length || 0}
                  </button>
                </div>
                
                {isAuthor && !answer.isAccepted && !doubt.isResolved && (
                  <button
                    onClick={() => handleAcceptAnswer(answer._id)}
                    className="btn btn-success btn-sm"
                  >
                    Accept Answer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Answer Form */}
        {isAuthenticated ? (
          <div className="answer-form card">
            <h3>Your Answer</h3>
            <form onSubmit={handleSubmitAnswer}>
              <textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Write your answer here..."
                className="form-control"
                rows="6"
                required
              />
              <button
                type="submit"
                className="btn btn-primary mt-3"
                disabled={submitting}
              >
                {submitting ? 'Posting...' : 'Post Answer'}
              </button>
            </form>
          </div>
        ) : (
          <div className="card text-center">
            <p>Please <a href="/login">login</a> to post an answer</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoubtDetail;
