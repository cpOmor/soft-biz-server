import { Product } from './product.model';

const getProducts = async (shopId: string, query: { page?: number; limit?: number; search?: string; category?: string }) => {
  const filter: Record<string, unknown> = { shopId };
  if (query.search) filter.name = { $regex: query.search, $options: 'i' };
  if (query.category) filter.category = query.category;
  const page  = Number(query.page)  || 1;
  const limit = Number(query.limit) || 50;
  const skip  = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);
  return { data, meta: { page, limit, total, totalPage: Math.ceil(total / limit) } };
};

const getProduct = async (shopId: string, id: string) => Product.findOne({ _id: id, shopId });

const createProduct = async (shopId: string, data: Record<string, unknown>) => {
  const count = await Product.countDocuments({ shopId });
  const code  = 'PRD-' + String(count + 1).padStart(4, '0');
  return Product.create({ ...data, shopId, code });
};

const updateProduct = async (shopId: string, id: string, data: Record<string, unknown>) =>
  Product.findOneAndUpdate({ _id: id, shopId }, data, { new: true });

const deleteProduct = async (shopId: string, id: string) =>
  Product.findOneAndDelete({ _id: id, shopId });

export const ProductServices = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
