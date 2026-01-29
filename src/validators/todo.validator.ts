import { body, ValidationChain } from 'express-validator';

export const createTodoValidation: ValidationChain[] = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

export const updateTodoValidation: ValidationChain[] = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
];
