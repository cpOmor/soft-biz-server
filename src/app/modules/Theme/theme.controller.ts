import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ThemeServices } from './theme.service';

const getThemes = catchAsync(async (_req, res) => {
  const result = await ThemeServices.listThemes();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Themes retrieved',
    data: result,
  });
});

const createTheme = catchAsync(async (req, res) => {
  const result = await ThemeServices.createTheme(req.user!.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Theme created',
    data: result,
  });
});

const updateTheme = catchAsync(async (req, res) => {
  const result = await ThemeServices.updateTheme(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Theme updated',
    data: result,
  });
});

const deleteTheme = catchAsync(async (req, res) => {
  await ThemeServices.deleteTheme(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Theme deleted',
    data: null,
  });
});

const setMyShopTheme = catchAsync(async (req, res) => {
  const result = await ThemeServices.setMyShopTheme(req.user!.id, req.body.themeId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop theme updated',
    data: result,
  });
});

export const ThemeControllers = {
  getThemes,
  createTheme,
  updateTheme,
  deleteTheme,
  setMyShopTheme,
};
