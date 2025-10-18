import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ItemsFeedPage from './pages/ItemsFeedPage';
import MyItemsPage from './pages/MyItemsPage';
import ItemDetailPage from './pages/ItemDetailPage';
import WishesFeedPage from './pages/WishesFeedPage';
import MyWishesPage from './pages/MyWishesPage';
import WishDetailPage from './pages/WishDetailPage';
import FriendsPage from './pages/FriendsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/items"
        element={
          <ProtectedRoute>
            <ItemsFeedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-items"
        element={
          <ProtectedRoute>
            <MyItemsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/items/:id"
        element={
          <ProtectedRoute>
            <ItemDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishes"
        element={
          <ProtectedRoute>
            <WishesFeedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-wishes"
        element={
          <ProtectedRoute>
            <MyWishesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishes/:id"
        element={
          <ProtectedRoute>
            <WishDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <FriendsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
