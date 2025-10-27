import { useEffect, useState } from 'react';

interface BackendLoadingScreenProps {
  onBackendReady: () => void;
}

export default function BackendLoadingScreen({ onBackendReady }: BackendLoadingScreenProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const startTime = Date.now();

    // Update timer every second
    const timerInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // Check backend health every 2 seconds
    const checkBackend = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
        const response = await fetch(`${apiUrl}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000), // 5s timeout
        });

        if (response.ok) {
          clearInterval(timerInterval);
          clearInterval(checkInterval);
          onBackendReady();
        }
      } catch (error) {
        // Backend not ready yet, will retry
      }
    };

    // Initial check
    checkBackend();

    // Check every 2 seconds
    const checkInterval = setInterval(checkBackend, 2000);

    return () => {
      clearInterval(timerInterval);
      clearInterval(checkInterval);
    };
  }, [onBackendReady]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="mb-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>

        <h2 className="text-2xl font-normal mb-4 text-gray-900">
          Waking up the server...
        </h2>

        <p className="text-base text-gray-700 mb-6 leading-relaxed">
          The backend is hosted on a free server that sleeps when not in use.
          It usually takes about 60 seconds to wake up. Thank you for your patience!
        </p>

        <div className="text-lg text-gray-600">
          <span className="font-medium">{elapsedTime}s</span> elapsed
        </div>

        {elapsedTime > 60 && (
          <p className="text-sm text-gray-500 mt-4">
            Taking longer than expected... The server should wake up soon.
          </p>
        )}
      </div>
    </div>
  );
}
