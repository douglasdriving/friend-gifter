import { Link } from 'react-router-dom';
import type { Wish } from '@friend-gifting/shared';

interface WishCardProps {
  wish: Wish & { user?: { id: string; username: string; name: string } };
  showOwner?: boolean;
}

export default function WishCard({ wish, showOwner = true }: WishCardProps) {
  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-700',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800',
  };

  return (
    <Link to={`/wishes/${wish.id}`} className="card hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Icon */}
        <div className="w-24 h-24 bg-primary-50 rounded-lg flex-shrink-0 flex items-center justify-center">
          <span className="text-4xl">⭐</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 truncate">{wish.title}</h3>
          {wish.description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{wish.description}</p>
          )}

          <div className="flex gap-2 flex-wrap">
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
              {wish.category}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${priorityColors[wish.priority]}`}>
              {wish.priority}
            </span>
          </div>

          {showOwner && wish.user && (
            <p className="text-sm text-gray-500 mt-2">by {wish.user.name}</p>
          )}
        </div>
      </div>

      {wish.isFulfilled && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <span className="text-sm text-green-600 font-medium">✓ Fulfilled</span>
        </div>
      )}
    </Link>
  );
}
