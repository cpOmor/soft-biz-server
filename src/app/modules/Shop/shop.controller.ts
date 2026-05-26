import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ShopServices } from './shop.service';

const getMyShop = catchAsync(async (req, res) => {
  const result = await ShopServices.getMyShop(req.user!.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Shop retrieved', data: result });
});

const createShop = catchAsync(async (req, res) => {
  const result = await ShopServices.createShop(req.user!.id, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Shop created', data: result });
});

const updateMyShop = catchAsync(async (req, res) => {
  const result = await ShopServices.updateMyShop(req.user!.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Shop updated', data: result });
});

export const ShopControllers = { getMyShop, createShop, updateMyShop };
