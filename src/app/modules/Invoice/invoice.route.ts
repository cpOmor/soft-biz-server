import { Router } from 'express';
import auth from '../../middlewares/auth';
import { InvoiceControllers } from './invoice.controller';
import { USER_ROLE } from '../Auth/auth.utils';
const router = Router();
router.get('/verify/:id',          InvoiceControllers.verifyInvoice); // public
router.get('/',                    auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin), InvoiceControllers.getInvoices);
router.get('/:id',                 auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin), InvoiceControllers.getInvoice);
router.post('/',                   auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin), InvoiceControllers.createInvoice);
router.post('/:id/duplicate',      auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin), InvoiceControllers.duplicateInvoice);
router.patch('/:id',               auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin), InvoiceControllers.updateInvoice);
router.delete('/:id',              auth(USER_ROLE.shop_owner,  USER_ROLE.super_admin), InvoiceControllers.deleteInvoice);
export const InvoiceRoutes = router;
