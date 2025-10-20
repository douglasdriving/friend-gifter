import { Link } from 'react-router-dom';
import { useBackendHealth } from '../hooks/useBackendHealth';

export default function LandingPage() {
  // Trigger backend health check on landing page load
  useBackendHealth();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <article className="prose prose-lg prose-gray mx-auto">
          <h1 className="text-4xl font-normal mb-6 text-gray-900">
            Giving and Receiving
          </h1>

          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            Share, give, and receive items among friends without transactional exchange.
          </p>

          <div className="flex gap-3 mb-12 not-prose">
            <Link
              to="/register"
              className="px-5 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-5 py-2 text-sm bg-white text-gray-900 border-2 border-gray-900 rounded hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
          </div>

          <h2 className="text-2xl font-normal mt-12 mb-4 text-gray-900">
            What is this?
          </h2>

          <p className="text-base leading-relaxed text-gray-700 mb-4">
            The world is full of unused products sitting in storages with untapped potential. At the same time, we are always looking for things, and end up buying new items, even when there are perfectly good ones lying around that could be used instead.
          </p>

          <p className="text-base leading-relaxed text-gray-700 mb-4">
            To help loosen our dependency on money, break free of the cycle of buying, and move towards a circular sustainable society, this app allows us to freely gift and share items among the people we trust, without any need for financial incentives. It does so by making it easy to display what we own but do not use, and browse items that might be of interest to us that our friends have.
          </p>

          <p className="text-base leading-relaxed text-gray-700 mb-8">
            Giving and receiving can be a great source of meaning, connecting us through our items and giving them a personal legacy. I hope this app can help you bring value to your unused products again.
          </p>

          <p className="text-base leading-relaxed text-gray-700 mb-12">
            /Douglas
          </p>

          <h2 className="text-2xl font-normal mt-12 mb-4 text-gray-900">
            Project
          </h2>

          <p className="text-base leading-relaxed text-gray-700 mb-12">
            This is a free, open-source app for web. It is in very early development. If you want to check out the source code, make contributions, or add feedback, please visit{' '}
            <a
              href="https://github.com/douglasdriving/friend-gifter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline hover:text-gray-600"
            >
              https://github.com/douglasdriving/friend-gifter
            </a>
          </p>
        </article>
      </div>
    </div>
  );
}
