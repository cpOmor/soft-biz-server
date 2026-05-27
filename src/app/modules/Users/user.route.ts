import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.utils';

const router = express.Router();

// Create a new user
// This route is typically used for admin to create users
// or for user registration
router.post('/sign-up', UserControllers.createUser);
 
// Get all users
router.get(
  '/students',
  auth(USER_ROLE.super_admin, USER_ROLE.shop_owner),
  UserControllers.getUsers,
);

export const userRoutes = router;
