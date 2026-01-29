import express, { Router } from 'express';
import * as todoController from '../controllers/todo.controller';
import * as todoValidator from '../validators/todo.validator';
import auth from '../middleware/auth';

const router: Router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/todos
// @desc    Get all todos for logged in user
// @access  Private
router.get('/', todoController.getAllTodos);

// @route   GET /api/todos/:id
// @desc    Get single todo by ID
// @access  Private
router.get('/:id', todoController.getTodoById);

// @route   POST /api/todos
// @desc    Create a new todo
// @access  Private
router.post('/', todoValidator.createTodoValidation, todoController.createTodo);

// @route   PUT /api/todos/:id
// @desc    Update a todo
// @access  Private
router.put('/:id', todoValidator.updateTodoValidation, todoController.updateTodo);

// @route   DELETE /api/todos/:id
// @desc    Delete a todo
// @access  Private
router.delete('/:id', todoController.deleteTodo);

export default router;
