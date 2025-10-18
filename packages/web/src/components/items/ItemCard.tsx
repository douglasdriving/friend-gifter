import { Link } from 'react-router-dom';
import type { Item } from '@friend-gifting/shared';

interface ItemCardProps {
  item: Item & { user?: { id: string; username: string; name: string } };
  showOwner?: boolean;
}

export default function ItemCard({ item, showOwner = true }: ItemCardProps) {
  const conditionColors = {
    NEW: 'bg-green-100 text-green-800',
    LIKE_NEW: 'bg-blue-100 text-blue-800',
    GOOD: 'bg-yellow-100 text-yellow-800',
    FAIR: 'bg-orange-100 text-orange-800',
    POOR: 'bg-red-100 text-red-800',
  };

  return (
    <Link to={`/items/${item.id}`} className="card hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
          {item.photos && item.photos.length > 0 ? (
            <img
              src={`/uploads/${item.photos[0].filename}`}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl">📦</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 truncate">{item.title}</h3>
          {item.description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
          )}

          <div className="flex gap-2 flex-wrap">
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
              {item.category}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${conditionColors[item.condition]}`}>
              {item.condition.replace('_', ' ')}
            </span>
          </div>

          {showOwner && item.user && (
            <p className="text-sm text-gray-500 mt-2">by {item.user.name}</p>
          )}
        </div>
      </div>

      {item.isGifted && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <span className="text-sm text-green-600 font-medium">✓ Gifted</span>
        </div>
      )}
    </Link>
  );
}
