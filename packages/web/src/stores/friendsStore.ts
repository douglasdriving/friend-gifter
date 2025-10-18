import { create } from 'zustand';
import type { Friendship, User } from '@friend-gifting/shared';

interface FriendsState {
  friends: Friendship[];
  pendingRequests: Friendship[];
  sentRequests: Friendship[];
  searchResults: User[];
  isLoading: boolean;
  error: string | null;
  setFriends: (friends: Friendship[]) => void;
  setPendingRequests: (requests: Friendship[]) => void;
  setSentRequests: (requests: Friendship[]) => void;
  setSearchResults: (users: User[]) => void;
  addFriend: (friendship: Friendship) => void;
  removeFriend: (friendshipId: string) => void;
  removeRequest: (friendshipId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFriendsStore = create<FriendsState>((set) => ({
  friends: [],
  pendingRequests: [],
  sentRequests: [],
  searchResults: [],
  isLoading: false,
  error: null,

  setFriends: (friends) => set({ friends }),
  setPendingRequests: (requests) => set({ pendingRequests: requests }),
  setSentRequests: (requests) => set({ sentRequests: requests }),
  setSearchResults: (users) => set({ searchResults: users }),

  addFriend: (friendship) =>
    set((state) => ({
      friends: [...state.friends, friendship],
    })),

  removeFriend: (friendshipId) =>
    set((state) => ({
      friends: state.friends.filter((f) => f.id !== friendshipId),
    })),

  removeRequest: (friendshipId) =>
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((r) => r.id !== friendshipId),
      sentRequests: state.sentRequests.filter((r) => r.id !== friendshipId),
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
