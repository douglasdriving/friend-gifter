import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { authService } from './services/authService';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ItemsPage from './pages/ItemsPage';
import MyItemsPage from './pages/MyItemsPage';
import ItemDetailPage from './pages/ItemDetailPage';
// FEATURE HIDDEN: Wishes feature temporarily disabled for focused development
// May be re-enabled as a future feature
// import WishesPage from './pages/WishesPage';
// import MyWishesPage from './pages/MyWishesPage';
// import WishDetailPage from './pages/WishDetailPage';
import FriendsPage from './pages/FriendsPage';
import ProtectedRoute from './components/ProtectedRoute';
import BackendLoadingScreen from './components/BackendLoadingScreen';

function App() {
  const { isAuthenticated, token, setAuth, clearAuth } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isBackendReady, setIsBackendReady] = useState(false);
  const location = useLocation();
  const isOnLandingPage = location.pathname === '/';

  // Auto-login: Validate stored token and check backend health on app mount
  useEffect(() => {
    const initialize = async () => {
      // Validate token if exists
      if (token && !isAuthenticated) {
        try {
          // Verify token is still valid by fetching current user
          const user = await authService.getCurrentUser();
          setAuth(user, token);
        } catch (error) {
          // Token is invalid, clear auth
          clearAuth();
        }
      }
      setIsInitializing(false);

      // Start checking backend health in background
      // This will warm up the backend even if user is on landing page
      checkBackendHealth();
    };

    const checkBackendHealth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          setIsBackendReady(true);
        }
      } catch (error) {
        // Backend not ready, BackendLoadingScreen will handle polling
      }
    };

    initialize();
  }, []);

  // Show loading screen while validating token
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Show backend loading screen on all routes except landing page
  if (!isBackendReady && !isOnLandingPage) {
    return (
      <BackendLoadingScreen onBackendReady={() => setIsBackendReady(true)} />
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/items" replace /> : <LandingPage />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/items" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/items" replace /> : <RegisterPage />}
      />

      {/* Protected routes */}
      <Route
        path="/items"
        element={
          <ProtectedRoute>
            <ItemsPage />
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
      {/* FEATURE HIDDEN: Wishes routes temporarily disabled for focused development */}
      {/* May be re-enabled as a future feature */}
      {/* <Route
        path="/wishes"
        element={
          <ProtectedRoute>
            <WishesPage />
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
      /> */}
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
