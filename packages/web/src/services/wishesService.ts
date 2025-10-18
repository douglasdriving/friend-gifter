import api from '../lib/api';
import type { Wish, CreateWishDto, UpdateWishDto } from '@friend-gifting/shared';

export const wishesService = {
  async getFeed(): Promise<Wish[]> {
    const response = await api.get<Wish[]>('/wishes/feed');
    return response.data;
  },

  async getMyWishes(): Promise<Wish[]> {
    const response = await api.get<Wish[]>('/wishes/my-wishes');
    return response.data;
  },

  async getById(id: string): Promise<Wish> {
    const response = await api.get<Wish>(`/wishes/${id}`);
    return response.data;
  },

  async create(data: CreateWishDto): Promise<Wish> {
    const response = await api.post<Wish>('/wishes', data);
    return response.data;
  },

  async update(id: string, data: UpdateWishDto): Promise<Wish> {
    const response = await api.put<Wish>(`/wishes/${id}`, data);
    return response.data;
  },

  async markAsFulfilled(id: string): Promise<Wish> {
    const response = await api.post<Wish>(`/wishes/${id}/fulfilled`);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/wishes/${id}`);
  },
};
