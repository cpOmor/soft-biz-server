import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CustomerServices } from './customer.service';

const getCustomers = catchAsync(async (req, res) => {
  const { data, meta } = await CustomerServices.getCustomers(
    req.user!.shopId!,
    req.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customers retrieved',
    meta,
    data,
  });
});
const getCustomer = catchAsync(async (req, res) => {
  const data = await CustomerServices.getCustomer(
    req.user!.shopId!,
    req.params.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer retrieved',
    data,
  });
});
const createCustomer = catchAsync(async (req, res) => {
  console.log(req.user)
  const data = await CustomerServices.createCustomer(
    req.user!.shopId!,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Customer created',
    data,
  });
});
const updateCustomer = catchAsync(async (req, res) => {
  const data = await CustomerServices.updateCustomer(
    req.user!.shopId!,
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer updated',
    data,
  });
});
const deleteCustomer = catchAsync(async (req, res) => {
  await CustomerServices.deleteCustomer(req.user!.shopId!, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer deleted',
    data: null,
  });
});
const getStatement = catchAsync(async (req, res) => {
  const data = await CustomerServices.getStatement(
    req.user!.shopId!,
    req.params.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Statement retrieved',
    data,
  });
});

export const CustomerControllers = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getStatement,
};
