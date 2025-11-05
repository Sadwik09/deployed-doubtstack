import { useEffect, useState } from "react";
import {
  FaBell,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { notificationService } from "../../services/notification.service";
import socket from "../../services/socket";
import { useAuthStore } from "../../store/authStore";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Fetch initial unread count
      fetchUnreadCount();

      // Set up socket listener for new notifications
      socket.on("notification", handleNewNotification);

      // Cleanup listener on unmount
      return () => {
        socket.off("notification", handleNewNotification);
      };
    }
  }, [isAuthenticated, user?.id]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getNotifications({
        isRead: false,
      });
      setUnreadCount(response.data.notifications.length);
    } catch (error) {
      console.error("Failed to fetch unread notifications:", error);
    }
  };

  const handleNewNotification = (notification) => {
    // Increment unread count when new notification arrives
    setUnreadCount((prev) => prev + 1);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <FaQuestionCircle className="logo-icon" />
          DoubtStack
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/doubts" className="nav-link">
                Doubts
              </Link>
              <Link to="/leaderboard" className="nav-link">
                Leaderboard
              </Link>
              <Link to="/doubts/create" className="btn btn-primary btn-sm">
                Post Doubt
              </Link>
              <div className="navbar-user">
                <Link to="/notifications" className="notification-bell">
                  <FaBell className="icon-btn" title="Notifications" />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </Link>
                {user?.id ? (
                  <Link to={`/profile/${user.id}`} className="user-avatar">
                    {user?.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} />
                    ) : (
                      <FaUserCircle size={32} />
                    )}
                  </Link>
                ) : (
                  <div className="user-avatar">
                    <FaUserCircle size={32} />
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
