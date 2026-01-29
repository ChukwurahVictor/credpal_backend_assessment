import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import * as todoService from '../services/todo.service';
import { ServiceError } from '../services/auth.service';
import { sendSuccess, sendError, sendValidationError } from '../utils/response';

export const getAllTodos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const todos = await todoService.getAllTodos(req.user!._id.toString());
    sendSuccess(res, 'Todos retrieved successfully', todos);
  } catch (error) {
    if ((error as ServiceError).status) {
      const serviceError = error as ServiceError;
      sendError(res, serviceError.message, serviceError.status);
      return;
    }
    console.error(error);
    sendError(res, 'Server error', 500);
  }
};

export const getTodoById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const todo = await todoService.getTodoById(req.params.id, req.user!._id.toString());
    sendSuccess(res, 'Todo retrieved successfully', todo);
  } catch (error) {
    if ((error as ServiceError).status) {
      const serviceError = error as ServiceError;
      sendError(res, serviceError.message, serviceError.status);
      return;
    }
    console.error(error);
    sendError(res, 'Server error', 500);
  }
};

export const createTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array() as { msg: string; path: string }[]);
      return;
    }

    const { title, description } = req.body;
    const todo = await todoService.createTodo({ title, description }, req.user!._id.toString());
    sendSuccess(res, 'Todo created successfully', todo, 201);
  } catch (error) {
    if ((error as ServiceError).status) {
      const serviceError = error as ServiceError;
      sendError(res, serviceError.message, serviceError.status);
      return;
    }
    console.error(error);
    sendError(res, 'Server error', 500);
  }
};

export const updateTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array() as { msg: string; path: string }[]);
      return;
    }

    const { title, description, completed } = req.body;
    const todo = await todoService.updateTodo(
      req.params.id,
      { title, description, completed },
      req.user!._id.toString()
    );
    sendSuccess(res, 'Todo updated successfully', todo);
  } catch (error) {
    if ((error as ServiceError).status) {
      const serviceError = error as ServiceError;
      sendError(res, serviceError.message, serviceError.status);
      return;
    }
    console.error(error);
    sendError(res, 'Server error', 500);
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await todoService.deleteTodo(req.params.id, req.user!._id.toString());
    sendSuccess(res, 'Todo removed successfully', null);
  } catch (error) {
    if ((error as ServiceError).status) {
      const serviceError = error as ServiceError;
      sendError(res, serviceError.message, serviceError.status);
      return;
    }
    console.error(error);
    sendError(res, 'Server error', 500);
  }
};
