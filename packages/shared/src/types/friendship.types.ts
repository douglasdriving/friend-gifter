export enum FriendshipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
}

export interface Friendship {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: Date;
  acceptedAt: Date | null;
}

export interface FriendWithCounts {
  id: string;
  username: string;
  name: string;
  itemCount: number;
  wishCount: number;
  friendsSince: Date;
}

export interface PendingFriendRequest {
  id: string;
  requester?: {
    id: string;
    username: string;
    name: string;
  };
  addressee?: {
    id: string;
    username: string;
    name: string;
  };
  createdAt: Date;
}

export interface FriendRequestsResponse {
  received: PendingFriendRequest[];
  sent: PendingFriendRequest[];
}

export type RelationshipStatus =
  | 'none'
  | 'friends'
  | 'pending_sent'
  | 'pending_received';

export interface UserSearchResult {
  id: string;
  username: string;
  name: string;
  email: string;
  relationshipStatus: RelationshipStatus;
}

export interface CreateFriendRequestDto {
  addresseeId: string;
}
