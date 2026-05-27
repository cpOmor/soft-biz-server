/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import { Customer } from './customer.model';
import { Profile, User } from '../Auth/auth.model';
import { generateUniqueCode } from '../../utils/generateUniqueCode';

// ─── helpers ──────────────────────────────────────────────────────────────────
const formatCustomer = (c: any) => {
  const user    = c.userId;
  const profile = user?.profileId;
  return {
    _id:           String(c._id),
    customerId:    c.customerId,
    userId:        String(user?._id ?? ''),
    name:          profile?.fullName  ?? '',
    phone:         profile?.phone     ?? '',
    email:         profile?.email     ?? user?.email ?? '',
    address:       c.address  ?? '',
    notes:         c.notes    ?? '',
    totalPurchase: c.totalPurchase,
    totalPaid:     c.totalPaid,
    totalDue:      c.totalDue,
    createdAt:     c.createdAt,
  };
};

const populateOpts = {
  path: 'userId',
  select: 'profileId email',
  populate: { path: 'profileId', select: 'fullName phone email' },
};

// ─── getCustomers ─────────────────────────────────────────────────────────────
const getCustomers = async (shopId: string, query: any) => {
  const search = (query.search as string) || '';
  const page   = Number(query.page)  || 1;
  const limit  = Number(query.limit) || 20;
  const skip   = (page - 1) * limit;

  // resolve matching userIds (with optional search across profile fields)
  let userIds: any[];
  if (search) {
    const profiles = await Profile.find({
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { phone:    { $regex: search, $options: 'i' } },
        { email:    { $regex: search, $options: 'i' } },
      ],
    }).select('_id');
    const users = await User.find({
      shopId,
      role: 'customer',
      profileId: { $in: profiles.map((p) => p._id) },
    }).select('_id');
    userIds = users.map((u) => u._id);
  } else {
    const users = await User.find({ shopId, role: 'customer' }).select('_id');
    userIds = users.map((u) => u._id);
  }

  const total = userIds.length;

  const customers = await Customer.find({ shopId, userId: { $in: userIds } })
    .populate(populateOpts)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    data: customers.map(formatCustomer),
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
  };
};

// ─── getCustomer ─────────────────────────────────────────────────────────────
const getCustomer = async (shopId: string, id: string) => {
  const c = await Customer.findOne({ _id: id, shopId }).populate(populateOpts);
  return c ? formatCustomer(c) : null;
};

// ─── createCustomer ──────────────────────────────────────────────────────────
const createCustomer = async (shopId: string, data: any) => {
  const { name, phone, email, password, address, notes } = data;

  const count      = await Customer.countDocuments({ shopId });
  const customerId = 'CUS-' + String(count + 1).padStart(4, '0');

  const resolvedEmail = email || `${customerId.toLowerCase()}@shop.local`;

  const profile = await Profile.create({
    fullName: name,
    phone:    phone || '',
    email:    resolvedEmail,
    image:    '',
  });

  const rawPassword    = password || generateUniqueCode(8);
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const user = await User.create({
    profileId:        profile._id,
    email:            resolvedEmail,
    userName:         resolvedEmail,
    role:             'customer',
    password:         hashedPassword,
    shopId,
    status:           'in-progress',
    rememberPassword: false,
  });

  const customer = await Customer.create({
    shopId,
    userId:    user._id,
    customerId,
    address:   address || '',
    notes:     notes   || '',
    totalPurchase: 0,
    totalPaid:     0,
    totalDue:      0,
  });

  return {
    _id:           String(customer._id),
    customerId,
    userId:        String(user._id),
    name,
    phone:         phone    || '',
    email:         resolvedEmail,
    address:       address  || '',
    notes:         notes    || '',
    totalPurchase: 0,
    totalPaid:     0,
    totalDue:      0,
    createdAt:     (customer as any).createdAt,
  };
};

// ─── updateCustomer ───────────────────────────────────────────────────────────
const updateCustomer = async (shopId: string, id: string, data: any) => {
  const customer: any = await Customer.findOne({ _id: id, shopId });
  if (!customer) return null;

  const { name, phone, email, address, notes } = data;

  const user: any = await User.findById(customer.userId);
  if (user) {
    const profileUpdate: any = {};
    if (name)  profileUpdate.fullName = name;
    if (phone) profileUpdate.phone    = phone;
    if (email) profileUpdate.email    = email;
    if (Object.keys(profileUpdate).length)
      await Profile.findByIdAndUpdate(user.profileId, profileUpdate);
  }

  const updated: any = await Customer.findOneAndUpdate(
    { _id: id, shopId },
    { ...(address !== undefined && { address }), ...(notes !== undefined && { notes }) },
    { new: true },
  ).populate(populateOpts);

  return updated ? formatCustomer(updated) : null;
};

// ─── deleteCustomer ───────────────────────────────────────────────────────────
const deleteCustomer = async (shopId: string, id: string) => {
  const customer: any = await Customer.findOne({ _id: id, shopId });
  if (!customer) return null;

  const user: any = await User.findById(customer.userId);
  if (user) {
    await Profile.findByIdAndDelete(user.profileId);
    await User.findByIdAndDelete(customer.userId);
  }

  return Customer.findOneAndDelete({ _id: id, shopId });
};

// ─── getStatement ─────────────────────────────────────────────────────────────
const getStatement = async (shopId: string, id: string) =>
  getCustomer(shopId, id);

export const CustomerServices = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getStatement,
};
