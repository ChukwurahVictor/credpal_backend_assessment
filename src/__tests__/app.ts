import express, { Application } from 'express';
import authRoutes from '../routes/auth';
import todoRoutes from '../routes/todos';

export const createTestApp = (): Application => {
  const app: Application = express();
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  app.use('/api/auth', authRoutes);
  app.use('/api/todos', todoRoutes);
  
  return app;
};
