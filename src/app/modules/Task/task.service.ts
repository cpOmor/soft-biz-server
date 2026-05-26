import { Task } from './task.model';

const getTasks = async (shopId: string, query: any) => {
  const filter: Record<string, unknown> = { shopId };
  if (query.status)   filter.status   = query.status;
  if (query.priority) filter.priority = query.priority;
  const data = await Task.find(filter).sort({ createdAt: -1 });
  return data;
};
const createTask = (shopId: string, data: any) => Task.create({ ...data, shopId });
const updateTask = (shopId: string, id: string, data: any) => Task.findOneAndUpdate({ _id: id, shopId }, data, { new: true });
const deleteTask = (shopId: string, id: string) => Task.findOneAndDelete({ _id: id, shopId });
export const TaskServices = { getTasks, createTask, updateTask, deleteTask };
