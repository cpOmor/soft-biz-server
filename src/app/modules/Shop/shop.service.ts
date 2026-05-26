import httpStatus from 'http-status';
import { Shop } from './shop.model';
import AppError from '../../errors/AppError';

const getMyShop = async (userId: string) => {
  const shop = await Shop.findOne({ ownerId: userId });
  if (!shop) throw new AppError(httpStatus.NOT_FOUND, 'Shop not found', []);
  return shop;
};

const createShop = async (userId: string, data: { name: string; currency?: string }) => {
  const exists = await Shop.findOne({ ownerId: userId });
  if (exists) throw new AppError(httpStatus.CONFLICT, 'Shop already exists', []);
  const slug = data.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  return Shop.create({ ownerId: userId, name: data.name, slug, currency: data.currency || 'BDT' });
};

const updateMyShop = async (userId: string, data: Partial<{ name: string; address: string; phone: string; email: string; currency: string; logo: string; invoiceStyle: string }>) => {
  const shop = await Shop.findOneAndUpdate({ ownerId: userId }, data, { new: true });
  if (!shop) throw new AppError(httpStatus.NOT_FOUND, 'Shop not found', []);
  return shop;
};

export const ShopServices = { getMyShop, createShop, updateMyShop };
