import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { createTestUser, getAuthHeader } from './helpers';
import { generateToken } from '../utils/jwt';
import prisma from '../utils/prisma';

describe('Friends API', () => {
  let user1Token: string;
  let user2Token: string;
  let user1Id: string;
  let user2Id: string;

  beforeEach(async () => {
    const user1 = await createTestUser({ username: 'user1' });
    const user2 = await createTestUser({ username: 'user2' });
    user1Id = user1.id;
    user2Id = user2.id;
    user1Token = generateToken({ userId: user1.id });
    user2Token = generateToken({ userId: user2.id });
  });

  describe('GET /api/v1/friends/search', () => {
    it('should search for users by query', async () => {
      await createTestUser({ username: 'alice', name: 'Alice Smith' });
      await createTestUser({ username: 'bob', name: 'Bob Johnson' });

      const response = await request(app)
        .get('/api/v1/friends/search')
        .query({ q: 'alice' })
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].username).toBe('alice');
    });

    it('should not return current user in search', async () => {
      const response = await request(app)
        .get('/api/v1/friends/search')
        .query({ q: 'user1' })
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/v1/friends/search')
        .query({ q: 'alice' });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/friends/request', () => {
    it('should send friend request', async () => {
      const response = await request(app)
        .post('/api/v1/friends/request')
        .set(getAuthHeader(user1Token))
        .send({ addresseeId: user2Id });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        requesterId: user1Id,
        addresseeId: user2Id,
        status: 'PENDING',
      });
    });

    it('should reject duplicate friend request', async () => {
      await request(app)
        .post('/api/v1/friends/request')
        .set(getAuthHeader(user1Token))
        .send({ addresseeId: user2Id });

      const response = await request(app)
        .post('/api/v1/friends/request')
        .set(getAuthHeader(user1Token))
        .send({ addresseeId: user2Id });

      expect(response.status).toBe(400);
    });

    it('should reject friend request to self', async () => {
      const response = await request(app)
        .post('/api/v1/friends/request')
        .set(getAuthHeader(user1Token))
        .send({ addresseeId: user1Id });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/friends/requests', () => {
    it('should get pending friend requests', async () => {
      await request(app)
        .post('/api/v1/friends/request')
        .set(getAuthHeader(user1Token))
        .send({ addresseeId: user2Id });

      const response = await request(app)
        .get('/api/v1/friends/requests')
        .set(getAuthHeader(user2Token));

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].requester.username).toBe('user1');
      expect(response.body[0].status).toBe('PENDING');
    });

    it('should return empty array if no requests', async () => {
      const response = await request(app)
        .get('/api/v1/friends/requests')
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('POST /api/v1/friends/accept/:id', () => {
    it('should accept friend request', async () => {
      const createResponse = await request(app)
        .post('/api/v1/friends/request')
        .set(getAuthHeader(user1Token))
        .send({ addresseeId: user2Id });

      const friendshipId = createResponse.body.id;

      const response = await request(app)
        .post(`/api/v1/friends/accept/${friendshipId}`)
        .set(getAuthHeader(user2Token));

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ACCEPTED');
    });

    it('should reject accept by non-addressee', async () => {
      const createResponse = await request(app)
        .post('/api/v1/friends/request')
        .set(getAuthHeader(user1Token))
        .send({ addresseeId: user2Id });

      const friendshipId = createResponse.body.id;

      const response = await request(app)
        .post(`/api/v1/friends/accept/${friendshipId}`)
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/v1/friends/decline/:id', () => {
    it('should decline friend request', async () => {
      const createResponse = await request(app)
        .post('/api/v1/friends/request')
        .set(getAuthHeader(user1Token))
        .send({ addresseeId: user2Id });

      const friendshipId = createResponse.body.id;

      const response = await request(app)
        .post(`/api/v1/friends/decline/${friendshipId}`)
        .set(getAuthHeader(user2Token));

      expect(response.status).toBe(200);

      // Verify friendship is deleted
      const friendship = await prisma.friendship.findUnique({
        where: { id: friendshipId },
      });
      expect(friendship).toBeNull();
    });
  });

  describe('GET /api/v1/friends', () => {
    it('should get list of friends', async () => {
      const createResponse = await request(app)
        .post('/api/v1/friends/request')
        .set(getAuthHeader(user1Token))
        .send({ addresseeId: user2Id });

      await request(app)
        .post(`/api/v1/friends/accept/${createResponse.body.id}`)
        .set(getAuthHeader(user2Token));

      const response = await request(app)
        .get('/api/v1/friends')
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].username).toBe('user2');
    });

    it('should return empty array if no friends', async () => {
      const response = await request(app)
        .get('/api/v1/friends')
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('DELETE /api/v1/friends/:friendId', () => {
    it('should remove friend', async () => {
      const createResponse = await request(app)
        .post('/api/v1/friends/request')
        .set(getAuthHeader(user1Token))
        .send({ addresseeId: user2Id });

      await request(app)
        .post(`/api/v1/friends/accept/${createResponse.body.id}`)
        .set(getAuthHeader(user2Token));

      const response = await request(app)
        .delete(`/api/v1/friends/${user2Id}`)
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(200);

      // Verify friendship is deleted
      const friendsResponse = await request(app)
        .get('/api/v1/friends')
        .set(getAuthHeader(user1Token));

      expect(friendsResponse.body).toHaveLength(0);
    });
  });
});
