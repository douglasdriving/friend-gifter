import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';
import { createTestUser } from './helpers';

describe('Auth API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          name: 'New User',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toMatchObject({
        username: 'newuser',
        email: 'newuser@example.com',
        name: 'New User',
      });
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject registration with existing username', async () => {
      await createTestUser({ username: 'existinguser' });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'existinguser',
          email: 'different@example.com',
          name: 'Different User',
          password: 'password123',
        });

      expect(response.status).toBe(400);
    });

    it('should reject registration with existing email', async () => {
      await createTestUser({ email: 'existing@example.com' });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'differentuser',
          email: 'existing@example.com',
          name: 'Different User',
          password: 'password123',
        });

      expect(response.status).toBe(400);
    });

    it('should reject registration with invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: '',
          email: 'invalid-email',
          password: '123',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      await createTestUser({
        username: 'loginuser',
        password: 'password123',
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'loginuser',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('username', 'loginuser');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject login with wrong password', async () => {
      await createTestUser({
        username: 'loginuser2',
        password: 'password123',
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'loginuser2',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });

    it('should reject login with non-existent user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123',
        });

      expect(response.status).toBe(401);
    });
  });
});
