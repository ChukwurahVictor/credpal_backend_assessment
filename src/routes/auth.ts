import express, { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import * as authValidator from '../validators/auth.validator';
import auth from '../middleware/auth';

const router: Router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authValidator.registerValidation, authController.register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authValidator.loginValidation, authController.login);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', auth, authController.getMe);

export default router;
