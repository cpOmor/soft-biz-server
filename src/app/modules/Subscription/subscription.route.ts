import { Router } from 'express';
import auth from '../../middlewares/auth';
import { SubscriptionControllers } from './subscription.controller';
import { USER_ROLE } from '../Auth/auth.utils';
const router = Router();
router.get('/plans',     SubscriptionControllers.getPlans);                      // public
router.get('/my',        auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin), SubscriptionControllers.getMySubscription);
router.post('/subscribe',auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin), SubscriptionControllers.subscribe);
export const SubscriptionRoutes = router;
