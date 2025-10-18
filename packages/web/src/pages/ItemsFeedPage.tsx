import { useEffect, useState } from 'react';
import { useItemsStore } from '../stores/itemsStore';
import { itemsService } from '../services/itemsService';
import ItemCard from '../components/items/ItemCard';

export default function ItemsFeedPage() {
  const { items, setItems, setLoading, setError } = useItemsStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemsService.getFeed();
      setItems(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadItems();
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">Items Feed</h1>
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
        {items.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg mb-2">No items available</p>
            <p className="text-gray-400 text-sm">
              Connect with friends to see their items!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} showOwner={true} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
