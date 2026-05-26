import { Schema, model } from 'mongoose';
const customerSchema = new Schema(
  {
    shopId:        { type: String, required: true, index: true },
    customerId:    { type: String, default: '' },
    name:          { type: String, required: true, trim: true },
    phone:         { type: String, default: '' },
    email:         { type: String, default: '' },
    address:       { type: String, default: '' },
    notes:         { type: String, default: '' },
    totalPurchase: { type: Number, default: 0 },
    totalPaid:     { type: Number, default: 0 },
    totalDue:      { type: Number, default: 0 },
  },
  { timestamps: true },
);
export const Customer = model('Customer', customerSchema);
