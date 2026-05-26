import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SupplierServices } from './supplier.service';

const getSuppliers  = catchAsync(async (req, res) => { const { data, meta } = await SupplierServices.getSuppliers(req.user!.shopId!, req.query); sendResponse(res, { statusCode: 200, success: true, message: 'Suppliers retrieved', meta, data }); });
const getSupplier   = catchAsync(async (req, res) => { const data = await SupplierServices.getSupplier(req.user!.shopId!, req.params.id); sendResponse(res, { statusCode: 200, success: true, message: 'Supplier retrieved', data }); });
const createSupplier= catchAsync(async (req, res) => { const data = await SupplierServices.createSupplier(req.user!.shopId!, req.body); sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Supplier created', data }); });
const updateSupplier= catchAsync(async (req, res) => { const data = await SupplierServices.updateSupplier(req.user!.shopId!, req.params.id, req.body); sendResponse(res, { statusCode: 200, success: true, message: 'Supplier updated', data }); });
const deleteSupplier= catchAsync(async (req, res) => { await SupplierServices.deleteSupplier(req.user!.shopId!, req.params.id); sendResponse(res, { statusCode: 200, success: true, message: 'Supplier deleted', data: null }); });
export const SupplierControllers = { getSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier };
