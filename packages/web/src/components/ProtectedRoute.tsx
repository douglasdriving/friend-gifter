import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useBackendHealth } from '../hooks/useBackendHealth';
import BackendLoadingScreen from './BackendLoadingScreen';
import { useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const { isBackendReady } = useBackendHealth();
  const [backendReady, setBackendReady] = useState(false);

  // Show loading screen while backend is waking up
  if (isBackendReady === false && !backendReady) {
    return (
      <BackendLoadingScreen
        onBackendReady={() => setBackendReady(true)}
      />
    );
  }

  // Check authentication after backend is ready
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
