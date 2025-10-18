import { useAuthStore } from '../stores/authStore';
import { useNavigate, Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">Friend Gifting</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}!</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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
      </main>
    </div>
  );
}
