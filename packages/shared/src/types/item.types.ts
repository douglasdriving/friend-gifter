export enum ItemCondition {
  LIKE_NEW = 'LIKE_NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
}

export enum ItemStatus {
  AVAILABLE = 'AVAILABLE',
  GIFTED = 'GIFTED',
}

export interface ItemPhoto {
  id: string;
  filename: string;
  url: string;
  order: number;
  createdAt: Date;
}

export interface Item {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  condition: ItemCondition | null;
  status: ItemStatus;
  createdAt: Date;
  giftedAt: Date | null;
  photos: ItemPhoto[];
}

export interface ItemWithOwner extends Item {
  owner: {
    id: string;
    username: string;
    name: string;
  };
}

export interface CreateItemDto {
  title: string;
  description: string;
  condition?: ItemCondition;
}

export interface UpdateItemDto {
  title?: string;
  description?: string;
  condition?: ItemCondition;
}
