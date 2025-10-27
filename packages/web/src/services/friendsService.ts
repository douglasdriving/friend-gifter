import api from '../lib/api';
import type { Friendship, User } from '@friend-gifting/shared';

export const friendsService = {
  async searchUsers(query: string): Promise<User[]> {
    const response = await api.get<User[]>(`/friends/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  async getFriends(): Promise<Friendship[]> {
    const response = await api.get<Friendship[]>('/friends');
    return response.data;
  },

  async getPendingRequests(): Promise<Friendship[]> {
    const response = await api.get<Friendship[]>('/friends/requests/pending');
    return response.data;
  },

  async getSentRequests(): Promise<Friendship[]> {
    const response = await api.get<Friendship[]>('/friends/requests/sent');
    return response.data;
  },

  async sendRequest(addresseeId: string): Promise<Friendship> {
    const response = await api.post<Friendship>('/friends/requests', { addresseeId });
    return response.data;
  },

  async acceptRequest(friendshipId: string): Promise<Friendship> {
    const response = await api.post<Friendship>(`/friends/requests/${friendshipId}/accept`);
    return response.data;
  },

  async declineRequest(friendshipId: string): Promise<void> {
    await api.delete(`/friends/requests/${friendshipId}`);
  },

  async removeFriend(friendshipId: string): Promise<void> {
    await api.delete(`/friends/${friendshipId}`);
  },

  async getSuggestions(): Promise<User[]> {
    const response = await api.get<User[]>('/friends/suggestions');
    return response.data;
  },
};
