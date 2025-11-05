import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { FaBell, FaCheck, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { notificationService } from "../services/notification.service";
import socket from "../services/socket";
import { useAuthStore } from "../store/authStore";
import "./Notifications.css";

const Notifications = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read

  // Function to fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter === "all" ? {} : { isRead: filter === "read" };
      const response = await notificationService.getNotifications(params);
      setNotifications(response.data.notifications);
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Handle new notification from socket
  const handleNewNotification = useCallback((notification) => {
    setNotifications((prev) => {
      // Check if notification already exists
      const exists = prev.some((n) => n._id === notification._id);
      if (exists) return prev;

      // Add new notification to the beginning of the list
      return [notification, ...prev];
    });

    // Show toast notification
    toast.info(notification.message, {
      onClick: () => {
        if (notification.doubt?._id) {
          window.location.href = `/doubts/${notification.doubt._id}`;
        }
      },
    });
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Register socket listener
    socket.on("notification", handleNewNotification);

    // Cleanup
    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, [fetchNotifications, handleNewNotification]);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(
        notifications.map((n) =>
          n._id === id ? { ...n, isRead: true, readAt: new Date() } : n
        )
      );
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(
        notifications.map((n) => ({ ...n, isRead: true, readAt: new Date() }))
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter((n) => n._id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  if (loading) {
    return (
      <div
        className="container"
        style={{ padding: "3rem 0", textAlign: "center" }}
      >
        <div className="spinner" style={{ margin: "0 auto" }}></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="container">
        <div className="page-header">
          <h1>
            <FaBell /> Notifications
          </h1>
          <div className="header-actions">
            <button
              onClick={markAllAsRead}
              className="btn btn-secondary btn-sm"
              disabled={notifications.length === 0}
            >
              <FaCheck /> Mark All as Read
            </button>
          </div>
        </div>

        <div className="filter-tabs">
          <button
            className={`tab-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`tab-btn ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread
          </button>
          <button
            className={`tab-btn ${filter === "read" ? "active" : ""}`}
            onClick={() => setFilter("read")}
          >
            Read
          </button>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <FaBell size={48} color="#ccc" />
              <h3>No notifications</h3>
              <p>You're all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item ${
                  !notification.isRead ? "unread" : ""
                }`}
              >
                <div className="notification-content">
                  <div className="notification-avatar">
                    {notification.sender?.profilePhoto ? (
                      <img
                        src={notification.sender.profilePhoto}
                        alt={notification.sender.name}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {notification.sender?.name?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </div>
                    )}
                  </div>
                  <div className="notification-details">
                    <p className="notification-message">
                      {notification.message}
                      {notification.doubt && (
                        <Link
                          to={`/doubts/${notification.doubt._id}`}
                          className="notification-link"
                        >
                          "{notification.doubt.title}"
                        </Link>
                      )}
                    </p>
                    <p className="notification-time">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <div className="notification-actions">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="btn btn-secondary btn-sm"
                      title="Mark as read"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="btn btn-danger btn-sm"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
