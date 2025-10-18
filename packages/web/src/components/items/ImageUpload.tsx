import { useState, useRef } from 'react';
import type { ItemPhoto } from '@friend-gifting/shared';

interface ImageUploadProps {
  itemId?: string;
  existingPhotos?: ItemPhoto[];
  onUpload?: (photos: ItemPhoto[]) => void;
  onDelete?: (photoId: string) => void;
  maxPhotos?: number;
}

export default function ImageUpload({
  itemId,
  existingPhotos = [],
  onUpload,
  onDelete,
  maxPhotos = 5,
}: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalPhotos = existingPhotos.length + selectedFiles.length + files.length;

    if (totalPhotos > maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    // Validate file types
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveSelected = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!itemId || selectedFiles.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('photos', file);
      });

      const response = await fetch(`/api/v1/items/${itemId}/photos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const photos: ItemPhoto[] = await response.json();
      setSelectedFiles([]);
      setPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUpload?.(photos);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Delete this photo?')) return;

    try {
      const response = await fetch(`/api/v1/items/${itemId}/photos/${photoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      onDelete?.(photoId);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete photo');
    }
  };

  const canAddMore = existingPhotos.length + selectedFiles.length < maxPhotos;

  return (
    <div className="space-y-4">
      {/* Existing Photos */}
      {existingPhotos.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Current Photos</h3>
          <div className="grid grid-cols-3 gap-3">
            {existingPhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.filename.startsWith('http') ? photo.filename : `/uploads/${photo.filename}`}
                  alt="Item photo"
                  className="w-full h-32 object-cover rounded-lg"
                />
                {onDelete && (
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Files Preview */}
      {previews.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Selected ({selectedFiles.length})
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemoveSelected(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Input */}
      {canAddMore && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="btn btn-secondary cursor-pointer inline-block"
          >
            Choose Photos ({existingPhotos.length + selectedFiles.length}/{maxPhotos})
          </label>
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && itemId && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="btn btn-primary"
        >
          {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Photo${selectedFiles.length > 1 ? 's' : ''}`}
        </button>
      )}

      <p className="text-xs text-gray-500">
        Maximum {maxPhotos} photos. Accepted formats: JPEG, PNG, WebP. Max size: 5MB each.
      </p>
    </div>
  );
}
