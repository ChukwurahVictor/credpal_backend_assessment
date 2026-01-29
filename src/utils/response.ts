import { Response } from 'express';

export interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T,
  statusCode: number = 200
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 500
): void => {
  const response: ErrorResponse = {
    success: false,
    error,
  };
  res.status(statusCode).json(response);
};

export const sendValidationError = (
  res: Response,
  errors: { msg: string; path: string }[]
): void => {
  const response: ErrorResponse = {
    success: false,
    error: errors.map(e => `${e.path}: ${e.msg}`).join(', '),
  };
  res.status(400).json(response);
};
