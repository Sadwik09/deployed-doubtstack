import { Link } from 'react-router-dom';
import { FaQuestionCircle, FaTrophy, FaUsers, FaRocket } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to DoubtStack 🚀</h1>
            <p className="hero-subtitle">
              Your campus community for asking doubts, sharing knowledge, and collaborative learning
            </p>
            <div className="hero-buttons">
              <Link to="/doubts" className="btn btn-primary btn-lg">
                Browse Doubts
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why DoubtStack?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaQuestionCircle size={40} />
              </div>
              <h3>Ask & Answer</h3>
              <p>Post your academic doubts and get answers from peers and faculty</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaTrophy size={40} />
              </div>
              <h3>Earn Reputation</h3>
              <p>Build your reputation by helping others and contributing quality content</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers size={40} />
              </div>
              <h3>Community Driven</h3>
              <p>Connect with students from your department and across campus</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaRocket size={40} />
              </div>
              <h3>Smart Features</h3>
              <p>Tags, filters, notifications, and more to enhance your learning</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of students collaborating and learning together</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
