import { Router } from 'express';
import AuthController from './auth.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import { registerValidation } from './validations/auth.validation';
import AuthService from './auth.service';

const router = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

router.post('/register', ValidationMiddleware(registerValidation), authController.register);
router.post('/login', authController.login);

export default router;
