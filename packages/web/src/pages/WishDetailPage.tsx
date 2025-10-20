import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWishesStore } from '../stores/wishesStore';
import { useAuthStore } from '../stores/authStore';
import { wishesService } from '../services/wishesService';
import AppLayout from '../components/layout/AppLayout';

export default function WishDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { selectedWish, setSelectedWish, updateWish, removeWish } = useWishesStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadWish(id);
    }
  }, [id]);

  const loadWish = async (wishId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await wishesService.getById(wishId);
      setSelectedWish(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load wish');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsFulfilled = async () => {
    if (!id) return;
    try {
      const updated = await wishesService.markAsFulfilled(id);
      updateWish(id, updated);
      setSelectedWish(updated);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to mark as fulfilled');
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this wish?')) return;
    try {
      await wishesService.delete(id);
      removeWish(id);
      navigate('/my-wishes');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete wish');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error || !selectedWish) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card text-center">
          <p className="text-red-600 mb-4">{error || 'Wish not found'}</p>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOwner = selectedWish.userId === user?.id;
  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-700',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800',
  };

  return (
    <AppLayout showBackButton>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="card">
          {/* Icon */}
          <div className="w-full h-64 bg-primary-50 rounded-lg mb-6 flex items-center justify-center">
            <span className="text-6xl">⭐</span>
          </div>

          <h1 className="text-3xl font-bold mb-4">{selectedWish.title}</h1>

          {selectedWish.description && (
            <p className="text-gray-700 mb-6">{selectedWish.description}</p>
          )}

          <div className="flex gap-3 mb-6 flex-wrap">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded">
              {selectedWish.category}
            </span>
            <span className={`px-3 py-1 rounded ${priorityColors[selectedWish.priority]}`}>
              {selectedWish.priority} Priority
            </span>
            {selectedWish.isFulfilled && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
                ✓ Fulfilled
              </span>
            )}
          </div>

          {selectedWish.user && (
            <div className="border-t border-gray-200 pt-4 mb-6">
              <p className="text-sm text-gray-500">Wished by</p>
              <p className="font-medium">{selectedWish.user.name}</p>
              <p className="text-sm text-gray-500">@{selectedWish.user.username}</p>
            </div>
          )}

          {isOwner && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              {!selectedWish.isFulfilled && (
                <button onClick={handleMarkAsFulfilled} className="btn btn-primary flex-1">
                  Mark as Fulfilled
                </button>
              )}
              <button onClick={handleDelete} className="btn btn-secondary flex-1">
                Delete Wish
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
