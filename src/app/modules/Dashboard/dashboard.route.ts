import { Router } from 'express';
import auth from '../../middlewares/auth';
import { DashboardControllers } from './dashboard.controller';
const router = Router();
router.get('/analytics', auth('user','admin'), DashboardControllers.getAnalytics);
export const DashboardRoutes = router;
