import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { createTestUser, createFriendship, createTestItem, getAuthHeader } from './helpers';
import { generateToken } from '../utils/jwt';

describe('Items API', () => {
  let user1Token: string;
  let user1Id: string;
  let user2Id: string;

  beforeEach(async () => {
    const user1 = await createTestUser({ username: 'user1' });
    const user2 = await createTestUser({ username: 'user2' });
    user1Id = user1.id;
    user2Id = user2.id;
    user1Token = generateToken({ userId: user1.id });
  });

  describe('POST /api/v1/items', () => {
    it('should create a new item', async () => {
      const response = await request(app)
        .post('/api/v1/items')
        .set(getAuthHeader(user1Token))
        .send({
          title: 'Test Book',
          description: 'A great book',
          category: 'Books',
          condition: 'GOOD',
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: 'Test Book',
        description: 'A great book',
        category: 'Books',
        condition: 'GOOD',
        userId: user1Id,
        isGifted: false,
      });
    });

    it('should reject creation without auth', async () => {
      const response = await request(app).post('/api/v1/items').send({
        title: 'Test Book',
        category: 'Books',
        condition: 'GOOD',
      });

      expect(response.status).toBe(401);
    });

    it('should reject creation with invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/items')
        .set(getAuthHeader(user1Token))
        .send({
          title: '',
          condition: 'INVALID',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/items', () => {
    it('should return items from friends only', async () => {
      await createFriendship(user1Id, user2Id);
      await createTestItem(user2Id, { title: 'Friend Item' });
      await createTestItem(user1Id, { title: 'My Item' });

      const response = await request(app)
        .get('/api/v1/items')
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Friend Item');
      expect(response.body[0].user).toBeDefined();
    });

    it('should not return gifted items', async () => {
      await createFriendship(user1Id, user2Id);
      await createTestItem(user2Id, { title: 'Available Item', isGifted: false });
      await createTestItem(user2Id, { title: 'Gifted Item', isGifted: true });

      const response = await request(app)
        .get('/api/v1/items')
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Available Item');
    });

    it('should return empty array if no friends', async () => {
      const response = await request(app)
        .get('/api/v1/items')
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/v1/items/my-items', () => {
    it('should return user own items', async () => {
      await createTestItem(user1Id, { title: 'My Item 1' });
      await createTestItem(user1Id, { title: 'My Item 2' });
      await createTestItem(user2Id, { title: 'Other Item' });

      const response = await request(app)
        .get('/api/v1/items/my-items')
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body.every((item: any) => item.userId === user1Id)).toBe(true);
    });
  });

  describe('GET /api/v1/items/:id', () => {
    it('should return item details for owner', async () => {
      const item = await createTestItem(user1Id, { title: 'My Item' });

      const response = await request(app)
        .get(`/api/v1/items/${item.id}`)
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('My Item');
    });

    it('should return item details for friend', async () => {
      await createFriendship(user1Id, user2Id);
      const item = await createTestItem(user2Id, { title: 'Friend Item' });

      const response = await request(app)
        .get(`/api/v1/items/${item.id}`)
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Friend Item');
    });

    it('should reject access for non-friend', async () => {
      const item = await createTestItem(user2Id, { title: 'Private Item' });

      const response = await request(app)
        .get(`/api/v1/items/${item.id}`)
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .get('/api/v1/items/nonexistent-id')
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/v1/items/:id', () => {
    it('should update own item', async () => {
      const item = await createTestItem(user1Id, { title: 'Original Title' });

      const response = await request(app)
        .put(`/api/v1/items/${item.id}`)
        .set(getAuthHeader(user1Token))
        .send({
          title: 'Updated Title',
          condition: 'LIKE_NEW',
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
      expect(response.body.condition).toBe('LIKE_NEW');
    });

    it('should reject update of other user item', async () => {
      const item = await createTestItem(user2Id, { title: 'Other Item' });

      const response = await request(app)
        .put(`/api/v1/items/${item.id}`)
        .set(getAuthHeader(user1Token))
        .send({
          title: 'Hacked Title',
        });

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/v1/items/:id/gifted', () => {
    it('should mark item as gifted', async () => {
      const item = await createTestItem(user1Id, { isGifted: false });

      const response = await request(app)
        .post(`/api/v1/items/${item.id}/gifted`)
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(200);
      expect(response.body.isGifted).toBe(true);
    });

    it('should reject marking other user item as gifted', async () => {
      const item = await createTestItem(user2Id);

      const response = await request(app)
        .post(`/api/v1/items/${item.id}/gifted`)
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/v1/items/:id', () => {
    it('should delete own item', async () => {
      const item = await createTestItem(user1Id);

      const response = await request(app)
        .delete(`/api/v1/items/${item.id}`)
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(200);

      const checkResponse = await request(app)
        .get(`/api/v1/items/${item.id}`)
        .set(getAuthHeader(user1Token));

      expect(checkResponse.status).toBe(404);
    });

    it('should reject delete of other user item', async () => {
      const item = await createTestItem(user2Id);

      const response = await request(app)
        .delete(`/api/v1/items/${item.id}`)
        .set(getAuthHeader(user1Token));

      expect(response.status).toBe(403);
    });
  });
});
