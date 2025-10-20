import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
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

function App() {
  const { isAuthenticated } = useAuthStore();

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
