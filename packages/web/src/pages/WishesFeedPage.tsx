import { useEffect, useState } from 'react';
import { useWishesStore } from '../stores/wishesStore';
import { wishesService } from '../services/wishesService';
import WishCard from '../components/wishes/WishCard';

export default function WishesFeedPage() {
  const { wishes, setWishes, setLoading, setError } = useWishesStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadWishes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await wishesService.getFeed();
      setWishes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load wishes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishes();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadWishes();
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">Wishes Feed</h1>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn btn-secondary text-sm"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {wishes.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg mb-2">No wishes available</p>
            <p className="text-gray-400 text-sm">
              Connect with friends to see what they're looking for!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {wishes.map((wish) => (
              <WishCard key={wish.id} wish={wish} showOwner={true} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
