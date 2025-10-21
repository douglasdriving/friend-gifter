import { useEffect, useState } from 'react';
import { useItemsStore } from '../stores/itemsStore';
import { itemsService } from '../services/itemsService';
import ItemCard from '../components/items/ItemCard';
import ItemForm from '../components/items/ItemForm';
import Modal from '../components/ui/Modal';
import AppLayout from '../components/layout/AppLayout';
import type { CreateItemDto } from '@friend-gifting/shared';

export default function MyItemsPage() {
  const { myItems, setMyItems, addItem, setLoading, setError } = useItemsStore();
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

      // Show success message
      setShowSuccess(true);

      // Close modal after a brief delay
      setTimeout(() => {
        setShowModal(false);
        setShowSuccess(false);
      }, 1500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create item');
      throw err;
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-start items-center mb-6">
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + Add Item
          </button>
        </div>

        {myItems.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg mb-2">You haven't added any items yet</p>
            <p className="text-gray-400 text-sm mb-4">
              Share items you'd like to give away to friends
            </p>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
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

      {/* Create Item Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Item">
        {showSuccess ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✓</div>
            <p className="text-xl text-green-600 font-semibold">Item created successfully!</p>
          </div>
        ) : (
          <ItemForm onSubmit={handleCreateItem} onCancel={() => setShowModal(false)} />
        )}
      </Modal>
    </AppLayout>
  );
}
