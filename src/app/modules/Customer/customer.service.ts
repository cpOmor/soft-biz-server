import { Customer } from './customer.model';

const getCustomers = async (shopId: string, query: any) => {
  const filter: Record<string, unknown> = { shopId };
  if (query.search) filter.name = { $regex: query.search, $options: 'i' };
  const page  = Number(query.page)  || 1;
  const limit = Number(query.limit) || 50;
  const skip  = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Customer.countDocuments(filter),
  ]);
  return { data, meta: { page, limit, total, totalPage: Math.ceil(total / limit) } };
};

const getCustomer = async (shopId: string, id: string) => Customer.findOne({ _id: id, shopId });

const createCustomer = async (shopId: string, data: any) => {
  const count = await Customer.countDocuments({ shopId });
  const customerId = 'CUS-' + String(count + 1).padStart(4, '0');
  return Customer.create({ ...data, shopId, customerId });
};

const updateCustomer = async (shopId: string, id: string, data: any) =>
  Customer.findOneAndUpdate({ _id: id, shopId }, data, { new: true });

const deleteCustomer = async (shopId: string, id: string) =>
  Customer.findOneAndDelete({ _id: id, shopId });

const getStatement = async (shopId: string, id: string) => Customer.findOne({ _id: id, shopId });

export const CustomerServices = { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer, getStatement };
