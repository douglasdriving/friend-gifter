import api from '../lib/api';
import type { Item, CreateItemDto, UpdateItemDto } from '@friend-gifting/shared';

export const itemsService = {
  async getFeed(): Promise<Item[]> {
    const response = await api.get<Item[]>('/items/feed');
    return response.data;
  },

  async getMyItems(): Promise<Item[]> {
    const response = await api.get<Item[]>('/items/my-items');
    return response.data;
  },

  async getById(id: string): Promise<Item> {
    const response = await api.get<Item>(`/items/${id}`);
    return response.data;
  },

  async create(data: CreateItemDto): Promise<Item> {
    const response = await api.post<Item>('/items', data);
    return response.data;
  },

  async update(id: string, data: UpdateItemDto): Promise<Item> {
    const response = await api.put<Item>(`/items/${id}`, data);
    return response.data;
  },

  async markAsGifted(id: string): Promise<Item> {
    const response = await api.post<Item>(`/items/${id}/gifted`);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/items/${id}`);
  },
};
