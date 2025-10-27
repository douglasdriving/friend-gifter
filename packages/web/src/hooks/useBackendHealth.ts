import { useState, useEffect, useCallback } from 'react';

export function useBackendHealth() {
  const [isBackendReady, setIsBackendReady] = useState<boolean | null>(null);

  const checkBackendHealth = useCallback(async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        setIsBackendReady(true);
        return true;
      }
      setIsBackendReady(false);
      return false;
    } catch (error) {
      setIsBackendReady(false);
      return false;
    }
  }, []);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth();
  }, [checkBackendHealth]);

  return {
    isBackendReady,
    checkBackendHealth,
  };
}
