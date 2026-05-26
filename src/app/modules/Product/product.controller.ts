import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductServices } from './product.service';

const getProducts = catchAsync(async (req, res) => {
  const { data, meta } = await ProductServices.getProducts(req.user!.shopId!, req.query as any);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Products retrieved', meta, data });
});
const getProduct = catchAsync(async (req, res) => {
  const data = await ProductServices.getProduct(req.user!.shopId!, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Product retrieved', data });
});
const createProduct = catchAsync(async (req, res) => {
  const data = await ProductServices.createProduct(req.user!.shopId!, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Product created', data });
});
const updateProduct = catchAsync(async (req, res) => {
  const data = await ProductServices.updateProduct(req.user!.shopId!, req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Product updated', data });
});
const deleteProduct = catchAsync(async (req, res) => {
  await ProductServices.deleteProduct(req.user!.shopId!, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Product deleted', data: null });
});

export const ProductControllers = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
