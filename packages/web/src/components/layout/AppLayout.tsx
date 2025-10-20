import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface AppLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

export default function AppLayout({ children, showBackButton = false }: AppLayoutProps) {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Back/Home button */}
            <div className="flex items-center gap-3">
              {showBackButton ? (
                <button
                  onClick={() => navigate(-1)}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  <span>←</span>
                  <span className="hidden sm:inline">Back</span>
                </button>
              ) : (
                <Link to="/items" className="text-xl font-bold text-primary-600 hover:text-primary-700">
                  Friend Gifting
                </Link>
              )}
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        {!showBackButton && (
          <div className="border-t border-gray-200">
            <div className="container mx-auto px-4">
              <nav className="flex gap-1 overflow-x-auto">
                <Link
                  to="/items"
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    location.pathname === '/items' || location.pathname.startsWith('/items/')
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Items
                </Link>
                <Link
                  to="/my-items"
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    isActive('/my-items')
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  My Items
                </Link>
                {/* FEATURE HIDDEN: Wishes navigation temporarily disabled for focused development */}
                {/* May be re-enabled as a future feature */}
                {/* <Link
                  to="/wishes"
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    isActive('/wishes') || isActive('/my-wishes')
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Wishes
                </Link> */}
                <Link
                  to="/friends"
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    isActive('/friends')
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Friends
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
