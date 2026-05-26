import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { InvoiceServices } from './invoice.service';

const getInvoices = catchAsync(async (req, res) => {
  const { data, meta } = await InvoiceServices.getInvoices(req.user!.shopId!, req.query);
  sendResponse(res, { statusCode: 200, success: true, message: 'Invoices retrieved', meta, data });
});
const getInvoice = catchAsync(async (req, res) => {
  const data = await InvoiceServices.getInvoice(req.user!.shopId!, req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: 'Invoice retrieved', data });
});
const createInvoice = catchAsync(async (req, res) => {
  const data = await InvoiceServices.createInvoice(req.user!.shopId!, req.user!.id, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Invoice created', data });
});
const updateInvoice = catchAsync(async (req, res) => {
  const data = await InvoiceServices.updateInvoice(req.user!.shopId!, req.params.id, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: 'Invoice updated', data });
});
const deleteInvoice = catchAsync(async (req, res) => {
  await InvoiceServices.deleteInvoice(req.user!.shopId!, req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: 'Invoice deleted', data: null });
});
const duplicateInvoice = catchAsync(async (req, res) => {
  const data = await InvoiceServices.duplicateInvoice(req.user!.shopId!, req.params.id);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Invoice duplicated', data });
});
const verifyInvoice = catchAsync(async (req, res) => {
  const data = await InvoiceServices.verifyInvoice(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: 'Invoice verified', data });
});

export const InvoiceControllers = { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice, duplicateInvoice, verifyInvoice };
