import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import todoRoutes from './routes/todos';
import { sendSuccess, sendError } from './utils/response';

dotenv.config();

connectDB();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Root route
app.get('/', (_req: Request, res: Response) => {
  sendSuccess(res, 'Simple CRUD API with Express and MongoDB.', {
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (requires token)',
      },
      todos: {
        getAll: 'GET /api/todos (requires token)',
        getOne: 'GET /api/todos/:id (requires token)',
        create: 'POST /api/todos (requires token)',
        update: 'PUT /api/todos/:id (requires token)',
        delete: 'DELETE /api/todos/:id (requires token)',
      },
    },
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  sendError(res, 'Something went wrong!', 500);
});

// 404 handler
app.use((_req: Request, res: Response) => {
  sendError(res, 'Route not found', 404);
});

const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
