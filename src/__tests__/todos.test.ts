import request from 'supertest';
import { Application } from 'express';
import { connectTestDB, closeTestDB, clearTestDB } from './setup';
import { createTestApp } from './app';
import Todo from '../models/Todo';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

let app: Application;
let token: string;
let userId: string;

describe('Todo Routes', () => {
  beforeAll(async () => {
    await connectTestDB();
    app = createTestApp();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    // Create a test user and get token
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    token = res.body.data.token;
    userId = res.body.data.user.id;
  });

  describe('POST /api/todos', () => {
    it('should create a new todo with standardized response', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Todo',
          description: 'Test description',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Todo created successfully');
      expect(res.body.data.title).toBe('Test Todo');
      expect(res.body.data.completed).toBe(false);
    });

    it('should fail without title', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test description',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('title');
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({
          title: 'Test Todo',
          description: 'Test description',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/todos', () => {
    beforeEach(async () => {
      await Todo.create([
        { title: 'Todo 1', description: 'Desc 1', user: userId },
        { title: 'Todo 2', description: 'Desc 2', user: userId },
      ]);
    });

    it('should get all todos for user with standardized response', async () => {
      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Todos retrieved successfully');
      expect(res.body.data).toHaveLength(2);
    });

    it('should not get todos from other users', async () => {
      // Create another user
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@example.com',
        password: 'password123',
      });
      
      await Todo.create({
        title: 'Other Todo',
        description: 'Other desc',
        user: otherUser._id,
      });

      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2); // Only original user's todos
    });
  });

  describe('GET /api/todos/:id', () => {
    let todoId: string;

    beforeEach(async () => {
      const todo = await Todo.create({
        title: 'Test Todo',
        description: 'Test description',
        user: userId,
      });
      todoId = todo._id.toString();
    });

    it('should get a single todo', async () => {
      const res = await request(app)
        .get(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Todo');
    });

    it('should return 404 for non-existent todo', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .get(`/api/todos/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/todos/:id', () => {
    let todoId: string;

    beforeEach(async () => {
      const todo = await Todo.create({
        title: 'Test Todo',
        description: 'Test description',
        user: userId,
      });
      todoId = todo._id.toString();
    });

    it('should update a todo', async () => {
      const res = await request(app)
        .put(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          description: 'Updated description',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Todo updated successfully');
      expect(res.body.data.title).toBe('Updated Title');
    });

    it('should toggle completed status', async () => {
      const res = await request(app)
        .put(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ completed: true });

      expect(res.status).toBe(200);
      expect(res.body.data.completed).toBe(true);
    });

    it('should not update another user\'s todo', async () => {
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@example.com',
        password: 'password123',
      });
      
      const otherTodo = await Todo.create({
        title: 'Other Todo',
        description: 'Other desc',
        user: otherUser._id,
      });

      const res = await request(app)
        .put(`/api/todos/${otherTodo._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Hacked' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    let todoId: string;

    beforeEach(async () => {
      const todo = await Todo.create({
        title: 'Test Todo',
        description: 'Test description',
        user: userId,
      });
      todoId = todo._id.toString();
    });

    it('should delete a todo', async () => {
      const res = await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Todo removed successfully');

      // Verify deletion
      const todo = await Todo.findById(todoId);
      expect(todo).toBeNull();
    });

    it('should not delete another user\'s todo', async () => {
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@example.com',
        password: 'password123',
      });
      
      const otherTodo = await Todo.create({
        title: 'Other Todo',
        description: 'Other desc',
        user: otherUser._id,
      });

      const res = await request(app)
        .delete(`/api/todos/${otherTodo._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
