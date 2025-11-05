import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "./store/authStore";

// Layout
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import CreateDoubt from "./pages/doubts/CreateDoubt";
import DoubtDetail from "./pages/doubts/DoubtDetail";
import DoubtList from "./pages/doubts/DoubtList";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main
          className="main-content"
          style={{ minHeight: "calc(100vh - 140px)", paddingTop: "70px" }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/doubts" element={<DoubtList />} />
            <Route
              path="/doubts/create"
              element={
                <ProtectedRoute>
                  <CreateDoubt />
                </ProtectedRoute>
              }
            />
            <Route path="/doubts/:id" element={<DoubtDetail />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
