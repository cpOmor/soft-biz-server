import { Staff } from './staff.model';

const getStaff = async (shopId: string, query: any) => {
  const filter: Record<string, unknown> = { shopId };
  if (query.search) filter.name = { $regex: query.search, $options: 'i' };
  if (query.role)   filter.role = query.role;
  const page = Number(query.page) || 1, limit = Number(query.limit) || 50;
  const [data, total] = await Promise.all([
    Staff.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Staff.countDocuments(filter),
  ]);
  return { data, meta: { page, limit, total, totalPage: Math.ceil(total / limit) } };
};
const getStaffMember       = (shopId: string, id: string) => Staff.findOne({ _id: id, shopId });
const createStaff          = (shopId: string, data: any) => Staff.create({ ...data, shopId });
const updateStaff          = (shopId: string, id: string, data: any) => Staff.findOneAndUpdate({ _id: id, shopId }, data, { new: true });
const updateStaffPermissions = (shopId: string, id: string, perms: any) =>
  Staff.findOneAndUpdate({ _id: id, shopId }, { permissions: perms }, { new: true });
const deleteStaff          = (shopId: string, id: string) => Staff.findOneAndDelete({ _id: id, shopId });
export const StaffServices = { getStaff, getStaffMember, createStaff, updateStaff, updateStaffPermissions, deleteStaff };
