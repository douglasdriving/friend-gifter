export enum WishPriority {
  NEED_NOW = 'NEED_NOW',
  WOULD_LIKE = 'WOULD_LIKE',
  SOMEDAY = 'SOMEDAY',
}

export enum WishStatus {
  OPEN = 'OPEN',
  FULFILLED = 'FULFILLED',
}

export interface Wish {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: WishPriority;
  status: WishStatus;
  createdAt: Date;
  fulfilledAt: Date | null;
}

export interface WishWithUser extends Wish {
  user: {
    id: string;
    username: string;
    name: string;
  };
}

export interface CreateWishDto {
  title: string;
  description: string;
  priority: WishPriority;
}

export interface UpdateWishDto {
  title?: string;
  description?: string;
  priority?: WishPriority;
}
