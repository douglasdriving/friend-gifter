import { useEffect, useState } from 'react';
import { useItemsStore } from '../stores/itemsStore';
import { itemsService } from '../services/itemsService';
import ItemCard from '../components/items/ItemCard';
import ItemForm from '../components/items/ItemForm';
import AppLayout from '../components/layout/AppLayout';
import type { CreateItemDto } from '@friend-gifting/shared';

export default function MyItemsPage() {
  const { myItems, setMyItems, addItem, setLoading, setError } = useItemsStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadMyItems();
  }, []);

  const loadMyItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemsService.getMyItems();
      setMyItems(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load your items');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (data: CreateItemDto, files: File[]) => {
    try {
      // First create the item
      const newItem = await itemsService.create(data);

      // Then upload photos if any
      if (files.length > 0) {
        await itemsService.uploadPhotos(newItem.id, files);
        // Reload the item to get the updated photo data
        const updatedItem = await itemsService.getById(newItem.id);
        addItem(updatedItem);
      } else {
        addItem(newItem);
      }

      setShowForm(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create item');
      throw err;
    }
  };

  return (
    <AppLayout >
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-start items-center mb-6">
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ Add Item'}
          </button>
        </div>
        {showForm && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Item</h2>
            <ItemForm onSubmit={handleCreateItem} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {myItems.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg mb-2">You haven't added any items yet</p>
            <p className="text-gray-400 text-sm mb-4">
              Share items you'd like to give away to friends
            </p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myItems.map((item) => (
              <ItemCard key={item.id} item={item} showOwner={false} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
