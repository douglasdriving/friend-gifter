import { useState, FormEvent } from 'react';
import type { CreateItemDto, ItemCondition } from '@friend-gifting/shared';

interface ItemFormProps {
  onSubmit: (data: CreateItemDto) => Promise<void>;
  onCancel: () => void;
}

export default function ItemForm({ onSubmit, onCancel }: ItemFormProps) {
  const [formData, setFormData] = useState<CreateItemDto>({
    title: '',
    description: '',
    category: '',
    condition: 'GOOD',
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

  const handleChange = (field: keyof CreateItemDto, value: string) => {
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
        <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
          Condition *
        </label>
        <select
          id="condition"
          className="input"
          value={formData.condition}
          onChange={(e) => handleChange('condition', e.target.value as ItemCondition)}
          required
        >
          <option value="NEW">New</option>
          <option value="LIKE_NEW">Like New</option>
          <option value="GOOD">Good</option>
          <option value="FAIR">Fair</option>
          <option value="POOR">Poor</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="btn btn-primary flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Item'}
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
