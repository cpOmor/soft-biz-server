import { Router } from 'express';
import auth from '../../middlewares/auth';
import { DashboardControllers } from './dashboard.controller';
import { USER_ROLE } from '../Auth/auth.utils';
const router = Router();
router.get('/analytics', auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin), DashboardControllers.getAnalytics);
export const DashboardRoutes = router;
