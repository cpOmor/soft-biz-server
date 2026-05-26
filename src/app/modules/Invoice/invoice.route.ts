import { Router } from 'express';
import auth from '../../middlewares/auth';
import { InvoiceControllers } from './invoice.controller';
const router = Router();
router.get('/verify/:id',          InvoiceControllers.verifyInvoice); // public
router.get('/',                    auth('user','admin'), InvoiceControllers.getInvoices);
router.get('/:id',                 auth('user','admin'), InvoiceControllers.getInvoice);
router.post('/',                   auth('user','admin'), InvoiceControllers.createInvoice);
router.post('/:id/duplicate',      auth('user','admin'), InvoiceControllers.duplicateInvoice);
router.patch('/:id',               auth('user','admin'), InvoiceControllers.updateInvoice);
router.delete('/:id',              auth('user','admin'), InvoiceControllers.deleteInvoice);
export const InvoiceRoutes = router;
