import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItemsStore } from '../stores/itemsStore';
import { useAuthStore } from '../stores/authStore';
import { itemsService } from '../services/itemsService';
import AppLayout from '../components/layout/AppLayout';

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { selectedItem, setSelectedItem, updateItem, removeItem } = useItemsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadItem(id);
    }
  }, [id]);

  const loadItem = async (itemId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await itemsService.getById(itemId);
      setSelectedItem(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsGifted = async () => {
    if (!id) return;
    try {
      const updated = await itemsService.markAsGifted(id);
      updateItem(id, updated);
      setSelectedItem(updated);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to mark as gifted');
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this item?')) return;
    try {
      await itemsService.delete(id);
      removeItem(id);
      navigate('/my-items');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error || !selectedItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card text-center">
          <p className="text-red-600 mb-4">{error || 'Item not found'}</p>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOwner = selectedItem.userId === user?.id;

  return (
    <AppLayout showBackButton>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="card">
          {/* Photos */}
          {selectedItem.photos && selectedItem.photos.length > 0 ? (
            <div className="w-full h-96 bg-gray-100 rounded-lg mb-6 overflow-hidden">
              <img
                src={selectedItem.photos[0].filename.startsWith('http') ? selectedItem.photos[0].filename : `/uploads/${selectedItem.photos[0].filename}`}
                alt={selectedItem.title}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
              <span className="text-6xl">📦</span>
            </div>
          )}

          {/* Photo thumbnails if more than one */}
          {selectedItem.photos && selectedItem.photos.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mb-6">
              {selectedItem.photos.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.filename.startsWith('http') ? photo.filename : `/uploads/${photo.filename}`}
                  alt="Item photo"
                  className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                />
              ))}
            </div>
          )}

          <h1 className="text-3xl font-bold mb-4">{selectedItem.title}</h1>

          {selectedItem.description && (
            <p className="text-gray-700 mb-6">{selectedItem.description}</p>
          )}

          <div className="flex gap-3 mb-6 flex-wrap">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded">
              {selectedItem.category}
            </span>
            {selectedItem.isGifted && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
                ✓ Gifted
              </span>
            )}
          </div>

          {selectedItem.user && (
            <div className="border-t border-gray-200 pt-4 mb-6">
              <p className="text-sm text-gray-500">Offered by</p>
              <p className="font-medium">{selectedItem.user.name}</p>
              <p className="text-sm text-gray-500">@{selectedItem.user.username}</p>
            </div>
          )}

          {isOwner && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              {!selectedItem.isGifted && (
                <button onClick={handleMarkAsGifted} className="btn btn-primary flex-1">
                  Mark as Gifted
                </button>
              )}
              <button onClick={handleDelete} className="btn btn-secondary flex-1">
                Delete Item
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
