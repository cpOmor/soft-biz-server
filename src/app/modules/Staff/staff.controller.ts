import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StaffServices } from './staff.service';

const getStaff      = catchAsync(async (req, res) => { const { data, meta } = await StaffServices.getStaff(req.user!.shopId!, req.query); sendResponse(res, { statusCode: 200, success: true, message: 'Staff retrieved', meta, data }); });
const getStaffMember= catchAsync(async (req, res) => { const data = await StaffServices.getStaffMember(req.user!.shopId!, req.params.id); sendResponse(res, { statusCode: 200, success: true, message: 'Staff member retrieved', data }); });
const createStaff   = catchAsync(async (req, res) => { const data = await StaffServices.createStaff(req.user!.shopId!, req.body); sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Staff created', data }); });
const updateStaff   = catchAsync(async (req, res) => { const data = await StaffServices.updateStaff(req.user!.shopId!, req.params.id, req.body); sendResponse(res, { statusCode: 200, success: true, message: 'Staff updated', data }); });
const updateStaffPermissions = catchAsync(async (req, res) => { const data = await StaffServices.updateStaffPermissions(req.user!.shopId!, req.params.id, req.body); sendResponse(res, { statusCode: 200, success: true, message: 'Permissions updated', data }); });
const deleteStaff   = catchAsync(async (req, res) => { await StaffServices.deleteStaff(req.user!.shopId!, req.params.id); sendResponse(res, { statusCode: 200, success: true, message: 'Staff deleted', data: null }); });
export const StaffControllers = { getStaff, getStaffMember, createStaff, updateStaff, updateStaffPermissions, deleteStaff };
