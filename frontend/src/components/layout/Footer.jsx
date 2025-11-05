import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🚀 DoubtStack</h3>
            <p>Your campus community for academic collaboration</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/doubts">Browse Doubts</Link></li>
              <li><Link to="/leaderboard">Leaderboard</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Community</h4>
            <ul>
              <li><Link to="/guidelines">Guidelines</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 DoubtStack. Built with ❤️ for students.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
