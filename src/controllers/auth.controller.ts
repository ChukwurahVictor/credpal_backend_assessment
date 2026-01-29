import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import * as authService from '../services/auth.service';
import { ServiceError } from '../services/auth.service';
import { sendSuccess, sendError, sendValidationError } from '../utils/response';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array() as { msg: string; path: string }[]);
      return;
    }

    const { name, email, password } = req.body;
    const result = await authService.registerUser(name, email, password);
    sendSuccess(res, 'User registered successfully', result, 201);
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

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array() as { msg: string; path: string }[]);
      return;
    }

    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    sendSuccess(res, 'Login successful', result);
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

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await authService.getCurrentUser(req.user!._id.toString());
    sendSuccess(res, 'User retrieved successfully', result);
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
