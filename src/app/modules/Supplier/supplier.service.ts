import { Supplier } from './supplier.model';

const getSuppliers = async (shopId: string, query: any) => {
  const filter: Record<string, unknown> = { shopId };
  if (query.search) filter.name = { $regex: query.search, $options: 'i' };
  const page = Number(query.page) || 1, limit = Number(query.limit) || 50;
  const [data, total] = await Promise.all([
    Supplier.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Supplier.countDocuments(filter),
  ]);
  return { data, meta: { page, limit, total, totalPage: Math.ceil(total / limit) } };
};
const getSupplier   = (shopId: string, id: string) => Supplier.findOne({ _id: id, shopId });
const createSupplier= (shopId: string, data: any) => Supplier.create({ ...data, shopId });
const updateSupplier= (shopId: string, id: string, data: any) => Supplier.findOneAndUpdate({ _id: id, shopId }, data, { new: true });
const deleteSupplier= (shopId: string, id: string) => Supplier.findOneAndDelete({ _id: id, shopId });
export const SupplierServices = { getSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier };
