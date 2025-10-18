import { useState, FormEvent } from 'react';
import type { CreateWishDto, WishPriority } from '@friend-gifting/shared';

interface WishFormProps {
  onSubmit: (data: CreateWishDto) => Promise<void>;
  onCancel: () => void;
}

export default function WishForm({ onSubmit, onCancel }: WishFormProps) {
  const [formData, setFormData] = useState<CreateWishDto>({
    title: '',
    description: '',
    category: '',
    priority: 'MEDIUM',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateWishDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          id="title"
          type="text"
          className="input"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          maxLength={100}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          className="input"
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          maxLength={500}
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <input
          id="category"
          type="text"
          className="input"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          required
          maxLength={50}
          placeholder="e.g., Books, Electronics, Clothing"
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Priority *
        </label>
        <select
          id="priority"
          className="input"
          value={formData.priority}
          onChange={(e) => handleChange('priority', e.target.value as WishPriority)}
          required
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="btn btn-primary flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Wish'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
