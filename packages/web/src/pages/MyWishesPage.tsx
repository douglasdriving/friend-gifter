import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishesStore } from '../stores/wishesStore';
import { wishesService } from '../services/wishesService';
import WishCard from '../components/wishes/WishCard';
import WishForm from '../components/wishes/WishForm';
import AppLayout from '../components/layout/AppLayout';
import type { CreateWishDto } from '@friend-gifting/shared';

export default function MyWishesPage() {
  const { myWishes, setMyWishes, addWish, setLoading, setError } = useWishesStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadMyWishes();
  }, []);

  const loadMyWishes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await wishesService.getMyWishes();
      setMyWishes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load your wishes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWish = async (data: CreateWishDto) => {
    try {
      const newWish = await wishesService.create(data);
      addWish(newWish);
      setShowForm(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create wish');
      throw err;
    }
  };

  return (
    <AppLayout >
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Link to="/wishes" className="btn btn-secondary">
            Back to Wishes
          </Link>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ Add Wish'}
          </button>
        </div>
        {showForm && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Wish</h2>
            <WishForm onSubmit={handleCreateWish} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {myWishes.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg mb-2">You haven't added any wishes yet</p>
            <p className="text-gray-400 text-sm mb-4">
              Let friends know what you're looking for
            </p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Add Your First Wish
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myWishes.map((wish) => (
              <WishCard key={wish.id} wish={wish} showOwner={false} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
