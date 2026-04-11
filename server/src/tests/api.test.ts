import request from 'supertest';
import app from '../app';
import db, { initDb } from '../config/db';
import { userModel } from '../models/userModel';
import bcrypt from 'bcryptjs';

describe('RARE Wellness API Endpoints', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // Initialize Database
    initDb();

    // Clear existing data (simplified for tests)
    db.exec('DELETE FROM users');
    db.exec('DELETE FROM products');
    db.exec('DELETE FROM services');
    db.exec('DELETE FROM bookings');
    db.exec('DELETE FROM wishlist');

    // Create a test user
    const password = await bcrypt.hash('password123', 10);
    const user = userModel.create({
      name: 'Test User',
      email: 'test@rare.com',
      password: password,
      role: 'user',
      membership: 'Classic',
      points: 0
    });
    userId = user.id;

    // Login to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@rare.com',
        password: 'password123'
      });
    token = res.body.token;
  });

  describe('Auth Endpoints', () => {
    it('should login and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@rare.com',
          password: 'password123'
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@rare.com',
          password: 'wrongpassword'
        });
      expect(res.status).toBe(401);
    });
  });

  describe('Product Endpoints', () => {
    it('should fetch products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('ProtectedRoute Endpoints', () => {
    it('should return 401 if not authenticated', async () => {
      const res = await request(app).get('/api/bookings');
      expect(res.status).toBe(401);
    });

    it('should fetch bookings if authenticated', async () => {
      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should add to wishlist if authenticated', async () => {
      // First create a product to add to wishlist
      db.prepare(`
        INSERT INTO products (id, brand, name, price)
        VALUES (11, 'Test Brand', 'Test Product', 99)
      `).run();

      const res = await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: 11 });
      expect(res.status).toBe(201);
    });
  });
});
