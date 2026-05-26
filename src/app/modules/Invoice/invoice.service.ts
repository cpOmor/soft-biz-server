import { Invoice } from './invoice.model';
import { Customer } from '../Customer/customer.model';

const getInvoices = async (shopId: string, query: any) => {
  const filter: Record<string, unknown> = { shopId };
  if (query.status)    filter.status = query.status;
  if (query.search)    filter.$or = [
    { invoiceId:    { $regex: query.search, $options: 'i' } },
    { customerName: { $regex: query.search, $options: 'i' } },
  ];
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) (filter.createdAt as any).$gte = new Date(query.startDate);
    if (query.endDate)   (filter.createdAt as any).$lte = new Date(query.endDate);
  }
  const page = Number(query.page) || 1, limit = Number(query.limit) || 20;
  const [data, total] = await Promise.all([
    Invoice.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Invoice.countDocuments(filter),
  ]);
  return { data, meta: { page, limit, total, totalPage: Math.ceil(total / limit) } };
};

const getInvoice = (shopId: string, id: string) => Invoice.findOne({ _id: id, shopId });

const createInvoice = async (shopId: string, userId: string, data: any) => {
  const count = await Invoice.countDocuments({ shopId });
  const invoiceId = 'INV-' + String(count + 1).padStart(4, '0');
  const invoice   = await Invoice.create({ ...data, shopId, invoiceId, createdBy: userId });

  // update customer balances
  if (data.customerId) {
    await Customer.findByIdAndUpdate(data.customerId, {
      $inc: {
        totalPurchase: invoice.total,
        totalPaid:     invoice.paid,
        totalDue:      invoice.due,
      },
    });
  }
  return invoice;
};

const updateInvoice = (shopId: string, id: string, data: any) =>
  Invoice.findOneAndUpdate({ _id: id, shopId }, data, { new: true });

const deleteInvoice = (shopId: string, id: string) =>
  Invoice.findOneAndDelete({ _id: id, shopId });

const duplicateInvoice = async (shopId: string, id: string) => {
  const src = await Invoice.findOne({ _id: id, shopId }).lean();
  if (!src) return null;
  const count = await Invoice.countDocuments({ shopId });
  const invoiceId = 'INV-' + String(count + 1).padStart(4, '0');
  const { _id, ...rest } = src as any;
  return Invoice.create({ ...rest, invoiceId, status: 'draft', paid: 0, due: rest.total });
};

const verifyInvoice = (id: string) => Invoice.findById(id);

export const InvoiceServices = { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice, duplicateInvoice, verifyInvoice };
