import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(userId) {
    if (!userId) return;

    // Disconnect existing connection
    if (this.socket) {
      this.socket.disconnect();
    }

    // Create new connection
    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Register user
    this.socket.emit("register", userId);

    // Listen for notifications
    this.socket.on("notification", (notification) => {
      console.log("Received notification:", notification);

      // Trigger all registered listeners
      const notificationListeners = this.listeners.get("notification") || [];
      notificationListeners.forEach((callback) => {
        try {
          callback(notification);
        } catch (error) {
          console.error("Error in notification listener:", error);
        }
      });
    });

    // Connection events
    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket.id);
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Register a listener for notifications
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remove a listener
  off(event, callback) {
    const listeners = this.listeners.get(event) || [];
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }
}

// Export singleton instance
export default new SocketService();
