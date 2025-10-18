import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Friend Gifting</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Share what you have, discover what your friends wish for, and make meaningful
            connections through giving.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="btn btn-primary bg-white text-primary-700 hover:bg-gray-100"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="btn btn-outline border-white text-white hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="card text-center">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold mb-2">Share Items</h3>
            <p className="text-gray-600">
              Post items you have and would like to give away to friends.
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold mb-2">Make Wishes</h3>
            <p className="text-gray-600">
              Create a wishlist of items you're looking for from friends.
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2">Connect</h3>
            <p className="text-gray-600">
              Build your network and help each other find what you need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
