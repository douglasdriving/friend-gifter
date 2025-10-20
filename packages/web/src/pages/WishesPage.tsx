import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishesStore } from '../stores/wishesStore';
import { wishesService } from '../services/wishesService';
import WishCard from '../components/wishes/WishCard';
import AppLayout from '../components/layout/AppLayout';

export default function WishesPage() {
  const { wishes, setWishes, setLoading, setError } = useWishesStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadWishes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await wishesService.getAll();
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
    <AppLayout >
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <Link to="/my-wishes" className="btn btn-primary">
            My Wishes
          </Link>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn btn-secondary text-sm"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
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
      </div>
    </AppLayout>
  );
}
