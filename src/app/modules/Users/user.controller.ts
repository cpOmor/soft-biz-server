/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';



// Create a new user
const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `${req?.body?.email} Check your email and use the 6-digit code.`,
    data: result,
  });
});
 

// Get all users
const getUsers = catchAsync(async (req: any, res) => {
  const result = await UserServices.getUsers(req as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All users have been successfully loaded.',
    data: result.transformedUsers,
    meta: result.meta,
    exportData: result.exportData,
  });
});


export const UserControllers = {
  getUsers,
  createUser,
};
