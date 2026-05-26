import { Router } from 'express';
import auth from '../../middlewares/auth';
import { SubscriptionControllers } from './subscription.controller';
const router = Router();
router.get('/plans',     SubscriptionControllers.getPlans);                      // public
router.get('/my',        auth('user','admin'), SubscriptionControllers.getMySubscription);
router.post('/subscribe',auth('user','admin'), SubscriptionControllers.subscribe);
export const SubscriptionRoutes = router;
