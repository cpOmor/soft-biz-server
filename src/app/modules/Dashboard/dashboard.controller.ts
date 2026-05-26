import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardServices } from './dashboard.service';

const getAnalytics = catchAsync(async (req, res) => {
  const data = await DashboardServices.getAnalytics(req.user!.shopId!, req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: 'Analytics retrieved', data });
});

export const DashboardControllers = { getAnalytics };
