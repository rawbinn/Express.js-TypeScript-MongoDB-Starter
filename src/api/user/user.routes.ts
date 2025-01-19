import { Router } from 'express';
import UserController from './user.controller';
import authMiddleware from '../../middleware/auth.middleware';
import UserService from './user.service';

const router = Router();

const userServices = new UserService();
const userController = new UserController(userServices);

router.get('/', authMiddleware, userController.getUsers);

export default router;
