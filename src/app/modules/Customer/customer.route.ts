import { Router } from 'express';
import auth from '../../middlewares/auth';
import { CustomerControllers } from './customer.controller';
import { USER_ROLE } from '../Auth/auth.utils';
const router = Router();
router.get('/', auth(USER_ROLE.shop_owner, USER_ROLE.super_admin), CustomerControllers.getCustomers);
router.get('/:id',auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin), CustomerControllers.getCustomer);
router.get(
  '/:id/statement',
 auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin),
  CustomerControllers.getStatement,
);
router.post('/',auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin), CustomerControllers.createCustomer);
router.patch('/:id',auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin), CustomerControllers.updateCustomer);
router.delete(
  '/:id',
 auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin),
  CustomerControllers.deleteCustomer,
);
export const CustomerRoutes = router;
