import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useItemsStore } from '../stores/itemsStore';
import { itemsService } from '../services/itemsService';
import ItemCard from '../components/items/ItemCard';
import AppLayout from '../components/layout/AppLayout';

export default function ItemsPage() {
  const { items, setItems, setLoading, setError } = useItemsStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemsService.getAll();
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
    <AppLayout >
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <Link to="/my-items" className="btn btn-primary">
            My Items
          </Link>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn btn-secondary text-sm"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
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
      </div>
    </AppLayout>
  );
}
