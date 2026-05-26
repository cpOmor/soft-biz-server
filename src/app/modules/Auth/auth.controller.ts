/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken, user, shop } = result;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: { accessToken, user, shop },
  });
});

const logoutUser = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;

  let decoded;
  try {
    decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
  } catch (error) {
    res.status(401).json({
      message: 'Unauthorized: Invalid or expired token',
    });
    return;
  }

  await AuthServices.logoutUser(req as any, decoded as any);
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged out successfully!',
    data: null,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const result = await AuthServices.refreshToken(req as any, res as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result.accessToken,
  });
});

const forgerPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgerPassword(req.body.email as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Verification code has been sent!`,
    data: result,
  });
});

const verification = catchAsync(async (req, res) => {
  const result = await AuthServices.verification(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'You are verified!',
    data: result,
  });
});

const setNewPassword = catchAsync(async (req, res) => {
  const validation = await req.cookies.validation;


  const result = await AuthServices.setNewPassword(
    validation,
    req.body.password,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password has been changed!',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthServices.changePassword(req as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password has been changed!',
    data: result,
  });
});

// Create a new user
const verificationCodeReSend = catchAsync(async (req, res) => {
  const result = await AuthServices.verificationCodeReSend(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${req?.body?.email} Check your email and use the 6-digit code.`,
    data: result,
  });
});

const verificationForgetPassword = catchAsync(async (req, res) => {
  
  const { validation } = await AuthServices.verificationForgetPassword(
    req.body,
  );

  res.cookie('validation', validation, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 1000 * 60 * 5,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Verified!',
    data: validation,
  });
});



// Get a single user
const getMe = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  console.log("refreshToken", refreshToken)

  if (!refreshToken) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'No authentication token found.',
      data: null,
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      config.jwt_refresh_secret as string,
    ) as JwtPayload;
  } catch (error) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Invalid or expired token.',
      data: null,
    });
  }

  const userId = decoded?.id;
  const result = await AuthServices.getMe(userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My information loaded.',
    data: result,
  });
});


// Update an existing user
const updateMe = catchAsync(async (req, res) => {
  const result = await AuthServices.updateMe(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been successfully updated.',
    data: result,
  });
});



// Delete a user
const deleteMe = catchAsync(async (req, res) => {
  const result = await AuthServices.deleteMe(req?.user?.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been successfully deleted.',
    data: result,
  });
});

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthServices.registerUser(req.body);
  const { refreshToken, accessToken, user, shop } = result;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully!',
    data: { accessToken, user, shop },
  });
});

export const AuthControllers = {
  loginUser,
  registerUser,
  logoutUser,
  refreshToken,
  verification,
  forgerPassword,
  changePassword,
  setNewPassword,
  verificationForgetPassword,
  verificationCodeReSend,
  getMe,
  updateMe,
  deleteMe,
};
