import { useEffect, useState } from 'react';
import { useFriendsStore } from '../stores/friendsStore';
import { friendsService } from '../services/friendsService';
import AppLayout from '../components/layout/AppLayout';

export default function FriendsPage() {
  const {
    friends,
    pendingRequests,
    sentRequests,
    searchResults,
    setFriends,
    setPendingRequests,
    setSentRequests,
    setSearchResults,
    addFriend,
    removeFriend,
    removeRequest,
    setLoading,
  } = useFriendsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'search' | 'requests'>('friends');
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'search') {
      loadSuggestions();
    }
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [friendsList, pending, sent] = await Promise.all([
        friendsService.getFriends(),
        friendsService.getPendingRequests(),
        friendsService.getSentRequests(),
      ]);
      setFriends(friendsList);
      setPendingRequests(pending);
      setSentRequests(sent);
    } catch (err: any) {
      console.error('Failed to load friends data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    try {
      const suggestionsList = await friendsService.getSuggestions();
      setSuggestions(suggestionsList);
    } catch (err: any) {
      console.error('Failed to load suggestions:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const results = await friendsService.searchUsers(searchQuery);
      setSearchResults(results);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Search failed');
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      await friendsService.sendRequest(userId);
      alert('Friend request sent!');
      // Remove from suggestions list
      setSuggestions(suggestions.filter(s => s.id !== userId));
      // Remove from search results if present
      setSearchResults(searchResults.filter(s => s.id !== userId));
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send request');
    }
  };

  const handleAcceptRequest = async (friendshipId: string) => {
    try {
      const friendship = await friendsService.acceptRequest(friendshipId);
      removeRequest(friendshipId);
      addFriend(friendship);
      alert('Friend request accepted!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleDeclineRequest = async (friendshipId: string) => {
    try {
      await friendsService.declineRequest(friendshipId);
      removeRequest(friendshipId);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to decline request');
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    if (!confirm('Remove this friend?')) return;
    try {
      await friendsService.removeFriend(friendshipId);
      removeFriend(friendshipId);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove friend');
    }
  };

  return (
    <AppLayout >
      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('friends')}
              className={`py-3 px-4 border-b-2 font-medium ${
                activeTab === 'friends'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Friends ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`py-3 px-4 border-b-2 font-medium ${
                activeTab === 'search'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Add Friends
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-3 px-4 border-b-2 font-medium ${
                activeTab === 'requests'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Requests ({pendingRequests.length + sentRequests.length})
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div>
            {friends.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500 text-lg mb-2">No friends yet</p>
                <p className="text-gray-400 text-sm mb-4">
                  Search for users to connect with
                </p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="btn btn-primary"
                >
                  Find Friends
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {friends.map((friendship: any) => (
                  <div key={friendship.id} className="card flex justify-between items-center">
                    <div>
                      <p className="font-medium">{friendship.friend.name}</p>
                      <p className="text-sm text-gray-500">@{friendship.friend.username}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFriend(friendship.id)}
                      className="btn btn-secondary text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Friends Tab (formerly Search) */}
        {activeTab === 'search' && (
          <div>
            {/* Suggestions Section */}
            {suggestions.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Suggested Friends</h2>
                <div className="space-y-3">
                  {suggestions.map((user) => (
                    <div key={user.id} className="card flex justify-between items-center">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                      <button
                        onClick={() => handleSendRequest(user.id)}
                        className="btn btn-primary text-sm"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Section */}
            <div className="card mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Search by name or username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} className="btn btn-primary">
                  Search
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((user) => (
                  <div key={user.id} className="card flex justify-between items-center">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                    <button
                      onClick={() => handleSendRequest(user.id)}
                      className="btn btn-primary text-sm"
                    >
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="card text-center py-8">
                <p className="text-gray-500">No results found</p>
              </div>
            ) : null}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Pending (Received) Requests */}
            {pendingRequests.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Received Requests</h2>
                <div className="space-y-3">
                  {pendingRequests.map((request: any) => (
                    <div key={request.id} className="card flex justify-between items-center">
                      <div>
                        <p className="font-medium">{request.requester.name}</p>
                        <p className="text-sm text-gray-500">@{request.requester.username}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="btn btn-primary text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(request.id)}
                          className="btn btn-secondary text-sm"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sent Requests */}
            {sentRequests.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Sent Requests</h2>
                <div className="space-y-3">
                  {sentRequests.map((request: any) => (
                    <div key={request.id} className="card flex justify-between items-center">
                      <div>
                        <p className="font-medium">{request.addressee.name}</p>
                        <p className="text-sm text-gray-500">@{request.addressee.username}</p>
                        <p className="text-xs text-gray-400 mt-1">Pending...</p>
                      </div>
                      <button
                        onClick={() => handleDeclineRequest(request.id)}
                        className="btn btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pendingRequests.length === 0 && sentRequests.length === 0 && (
              <div className="card text-center py-12">
                <p className="text-gray-500">No pending requests</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
