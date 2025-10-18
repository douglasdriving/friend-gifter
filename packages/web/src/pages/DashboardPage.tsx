import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import AppLayout from '../components/layout/AppLayout';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}! 👋</h2>
          <p className="text-gray-600 mt-1">What would you like to do today?</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Items Section */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">My Items</h2>
            <p className="text-gray-600 mb-4">Items you're giving away</p>
            <div className="space-y-2">
              <Link to="/my-items" className="btn btn-primary w-full block text-center">
                Manage Items
              </Link>
              <Link to="/items" className="btn btn-outline w-full block text-center">
                Browse Feed
              </Link>
            </div>
          </div>

          {/* Wishes Section */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">My Wishes</h2>
            <p className="text-gray-600 mb-4">Items you're looking for</p>
            <div className="space-y-2">
              <Link to="/my-wishes" className="btn btn-primary w-full block text-center">
                Manage Wishes
              </Link>
              <Link to="/wishes" className="btn btn-outline w-full block text-center">
                Browse Feed
              </Link>
            </div>
          </div>

          {/* Friends Section */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Friends</h2>
            <p className="text-gray-600 mb-4">Manage your connections</p>
            <Link to="/friends" className="btn btn-primary w-full block text-center">
              Manage Friends
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
          <div className="card">
            <p className="text-gray-700 mb-4">
              Get started by adding items you want to give away or browse what your friends are offering!
            </p>
            <div className="flex gap-3">
              <Link to="/my-items" className="btn btn-primary">
                Add My First Item
              </Link>
              <Link to="/items" className="btn btn-secondary">
                Browse Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
