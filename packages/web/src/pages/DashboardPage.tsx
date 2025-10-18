import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

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
            <button className="btn btn-primary w-full">Add Item</button>
          </div>

          {/* Wishes Section */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">My Wishes</h2>
            <p className="text-gray-600 mb-4">Items you're looking for</p>
            <button className="btn btn-primary w-full">Add Wish</button>
          </div>

          {/* Friends Section */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Friends</h2>
            <p className="text-gray-600 mb-4">Manage your connections</p>
            <button className="btn btn-primary w-full">Find Friends</button>
          </div>
        </div>

        {/* Feed placeholder */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Activity Feed</h2>
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">
              Your activity feed will appear here once you connect with friends!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
