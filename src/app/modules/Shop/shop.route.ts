import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ShopControllers } from './shop.controller';
import { USER_ROLE } from '../Auth/auth.utils';

const router = Router();
router.get('/my', auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin), ShopControllers.getMyShop);
router.post('/',  auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin), ShopControllers.createShop);
router.patch('/my',auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin), ShopControllers.updateMyShop);
export const ShopRoutes = router;
