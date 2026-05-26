import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ShopControllers } from './shop.controller';

const router = Router();
router.get('/my',  auth('user', 'admin'), ShopControllers.getMyShop);
router.post('/',   auth('user', 'admin'), ShopControllers.createShop);
router.patch('/my',auth('user', 'admin'), ShopControllers.updateMyShop);
export const ShopRoutes = router;
