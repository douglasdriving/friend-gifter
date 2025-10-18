export type ItemCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';

export interface ItemPhoto {
  id: string;
  itemId: string;
  filename: string;
  order: number;
  createdAt: Date;
}

export interface Item {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: string;
  condition: ItemCondition;
  isGifted: boolean;
  createdAt: Date;
  updatedAt: Date;
  photos?: ItemPhoto[];
  user?: {
    id: string;
    username: string;
    name: string;
  };
}

export interface CreateItemDto {
  title: string;
  description?: string;
  category: string;
  condition: ItemCondition;
}

export interface UpdateItemDto {
  title?: string;
  description?: string;
  category?: string;
  condition?: ItemCondition;
  isGifted?: boolean;
}
