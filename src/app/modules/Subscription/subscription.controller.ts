import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SubscriptionServices } from './subscription.service';

const getPlans        = catchAsync(async (_req, res) => { const data = SubscriptionServices.getPlans(); sendResponse(res, { statusCode: 200, success: true, message: 'Plans retrieved', data }); });
const subscribe       = catchAsync(async (req, res) => { const data = await SubscriptionServices.subscribe(req.user!.shopId!, req.body.plan); sendResponse(res, { statusCode: 200, success: true, message: 'Subscribed', data }); });
const getMySubscription = catchAsync(async (req, res) => { const data = await SubscriptionServices.getMySubscription(req.user!.shopId!); sendResponse(res, { statusCode: 200, success: true, message: 'Subscription retrieved', data }); });
export const SubscriptionControllers = { getPlans, subscribe, getMySubscription };
