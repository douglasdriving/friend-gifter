export type WishPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Wish {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: string;
  priority: WishPriority;
  isFulfilled: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    username: string;
    name: string;
  };
}

export interface CreateWishDto {
  title: string;
  description?: string;
  category: string;
  priority: WishPriority;
}

export interface UpdateWishDto {
  title?: string;
  description?: string;
  category?: string;
  priority?: WishPriority;
  isFulfilled?: boolean;
}
