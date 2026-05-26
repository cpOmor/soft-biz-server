import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TaskServices } from './task.service';

const getTasks    = catchAsync(async (req, res) => { const data = await TaskServices.getTasks(req.user!.shopId!, req.query); sendResponse(res, { statusCode: 200, success: true, message: 'Tasks retrieved', data }); });
const createTask  = catchAsync(async (req, res) => { const data = await TaskServices.createTask(req.user!.shopId!, req.body); sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Task created', data }); });
const updateTask  = catchAsync(async (req, res) => { const data = await TaskServices.updateTask(req.user!.shopId!, req.params.id, req.body); sendResponse(res, { statusCode: 200, success: true, message: 'Task updated', data }); });
const deleteTask  = catchAsync(async (req, res) => { await TaskServices.deleteTask(req.user!.shopId!, req.params.id); sendResponse(res, { statusCode: 200, success: true, message: 'Task deleted', data: null }); });
export const TaskControllers = { getTasks, createTask, updateTask, deleteTask };
