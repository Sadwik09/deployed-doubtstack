import { useEffect, useState } from "react";
import {
  FaAward,
  FaCheckCircle,
  FaQuestionCircle,
  FaTrophy,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { userService } from "../services/user.service";
import "./Profile.css";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [doubts, setDoubts] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("doubts");

  useEffect(() => {
    if (!id) {
      toast.error("Invalid user ID");
      navigate("/");
      return;
    }

    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      // Fetch profile data with individual error handling
      let profileData = null;
      let doubtsData = [];
      let answersData = [];

      try {
        const profileRes = await userService.getUserProfile(id);
        profileData = profileRes.data?.user || null;
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error(
          "Failed to load profile: " +
            (error.response?.data?.message || error.message)
        );
        navigate("/");
        return;
      }

      if (!profileData) {
        toast.error("User not found");
        navigate("/");
        return;
      }

      // Fetch doubts and answers in parallel with error handling
      try {
        const [doubtsRes, answersRes] = await Promise.allSettled([
          userService.getUserDoubts(id, { limit: 10 }),
          userService.getUserAnswers(id, { limit: 10 }),
        ]);

        // Handle doubts result
        if (doubtsRes.status === "fulfilled") {
          // Fix: Access the correct data structure
          doubtsData = doubtsRes.value.data?.doubts || [];
        } else {
          console.error("Error fetching doubts:", doubtsRes.reason);
          toast.warn("Failed to load user doubts");
        }

        // Handle answers result
        if (answersRes.status === "fulfilled") {
          // Fix: Access the correct data structure
          answersData = answersRes.value.data?.answers || [];
        } else {
          console.error("Error fetching answers:", answersRes.reason);
          toast.warn("Failed to load user answers");
        }
      } catch (error) {
        console.error("Error fetching user content:", error);
      }

      // Update state
      setUser(profileData);
      setDoubts(doubtsData);
      setAnswers(answersData);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="container"
        style={{ padding: "3rem 0", textAlign: "center" }}
      >
        <div className="spinner" style={{ margin: "0 auto" }}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="container"
        style={{ padding: "3rem 0", textAlign: "center" }}
      >
        <p>User not found</p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header card">
          <div className="profile-avatar">
            {user.profilePhoto ? (
              <img src={user.profilePhoto} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="profile-info">
            <h1>{user.name}</h1>
            <p className="profile-role">
              {user.role === "student"
                ? "🎓 Student"
                : user.role === "faculty"
                ? "👨‍🏫 Faculty"
                : "👑 Admin"}
              {" · "}
              {user.department}
              {user.branch && ` · ${user.branch}`}
              {user.semester && ` · Semester ${user.semester}`}
            </p>
            {user.bio && <p className="profile-bio">{user.bio}</p>}

            {/* Badges */}
            {user.badges && user.badges.length > 0 && (
              <div className="user-badges">
                {user.badges.map((badge, index) => (
                  <span key={index} className="badge badge-primary">
                    {badge.icon} {badge.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="profile-reputation">
            <div className="reputation-score">
              <FaTrophy size={32} color="#f59e0b" />
              <div>
                <div className="reputation-value">{user.reputation}</div>
                <div className="reputation-label">Reputation</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="profile-stats">
          <div className="stat-item">
            <FaQuestionCircle size={24} color="#4f46e5" />
            <div>
              <div className="stat-number">
                {user.stats?.questionsAsked || 0}
              </div>
              <div className="stat-text">Questions</div>
            </div>
          </div>

          <div className="stat-item">
            <FaCheckCircle size={24} color="#10b981" />
            <div>
              <div className="stat-number">{user.stats?.answersGiven || 0}</div>
              <div className="stat-text">Answers</div>
            </div>
          </div>

          <div className="stat-item">
            <FaAward size={24} color="#f59e0b" />
            <div>
              <div className="stat-number">{user.stats?.bestAnswers || 0}</div>
              <div className="stat-text">Best Answers</div>
            </div>
          </div>

          <div className="stat-item">
            <FaTrophy size={24} color="#ef4444" />
            <div>
              <div className="stat-number">{user.stats?.helpfulVotes || 0}</div>
              <div className="stat-text">Helpful Votes</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "doubts" ? "active" : ""}`}
            onClick={() => setActiveTab("doubts")}
          >
            Doubts ({doubts?.length || 0})
          </button>
          <button
            className={`tab-btn ${activeTab === "answers" ? "active" : ""}`}
            onClick={() => setActiveTab("answers")}
          >
            Answers ({answers?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "doubts" ? (
            <div className="doubts-list">
              {doubts && doubts.length > 0 ? (
                doubts.map((doubt) => (
                  <Link
                    to={`/doubts/${doubt._id}`}
                    key={doubt._id}
                    className="doubt-item card"
                  >
                    <h3>{doubt.title}</h3>
                    <div className="item-meta">
                      <span
                        className={`badge ${
                          doubt.isResolved ? "badge-success" : "badge-warning"
                        }`}
                      >
                        {doubt.isResolved ? "Resolved" : "Open"}
                      </span>
                      <span className="text-muted">
                        {doubt.answerCount} answers
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-muted">No doubts posted yet</p>
              )}
            </div>
          ) : (
            <div className="answers-list">
              {answers && answers.length > 0 ? (
                answers.map((answer) => (
                  <Link
                    to={`/doubts/${answer.doubt?._id}`}
                    key={answer._id}
                    className="answer-item card"
                  >
                    <h4>
                      Answer to: {answer.doubt?.title || "Unknown question"}
                    </h4>
                    <p>
                      {answer.content?.substring(0, 150) || "No content"}...
                    </p>
                    <div className="item-meta">
                      {answer.isAccepted && (
                        <span className="badge badge-success">✓ Accepted</span>
                      )}
                      <span className="text-muted">
                        {answer.upvotes?.length || 0} upvotes
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-muted">No answers posted yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
