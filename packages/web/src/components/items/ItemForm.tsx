import { useState, FormEvent } from 'react';
import type { CreateItemDto, ItemCondition } from '@friend-gifting/shared';

interface ItemFormProps {
  onSubmit: (data: CreateItemDto, files: File[]) => Promise<void>;
  onCancel: () => void;
}

export default function ItemForm({ onSubmit, onCancel }: ItemFormProps) {
  const [formData, setFormData] = useState<CreateItemDto>({
    title: '',
    description: '',
    category: '',
    condition: 'GOOD',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData, selectedFiles);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateItemDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const file = files[0]; // Only take first file

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(`${file.name} is not an image file`);
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name} is too large. Maximum size is 5MB`);
      return;
    }

    setSelectedFiles([file]);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews([reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setSelectedFiles([]);
    setPreviews([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Photo Upload - First field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photo (Optional)
        </label>

        {/* Selected File Preview */}
        {selectedFiles.length > 0 ? (
          <div className="mb-3">
            <div className="relative inline-block">
              <img
                src={previews[0]}
                alt="Preview"
                className="w-full max-w-xs h-48 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
              >
                ×
              </button>
            </div>
          </div>
        ) : (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload-form"
            />
            <label
              htmlFor="photo-upload-form"
              className="btn btn-secondary cursor-pointer inline-block text-sm"
            >
              Choose Photo
            </label>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Accepted formats: JPEG, PNG, WebP. Max size: 5MB.
        </p>
      </div>

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
