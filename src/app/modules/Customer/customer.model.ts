import { Schema, model } from 'mongoose';
const customerSchema = new Schema(
  {
    shopId:        { type: String, required: true, index: true },
    userId:        { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    customerId:    { type: String, default: '' },
    address:       { type: String, default: '' },
    notes:         { type: String, default: '' },
    totalPurchase: { type: Number, default: 0 },
    totalPaid:     { type: Number, default: 0 },
    totalDue:      { type: Number, default: 0 },
  },
  { timestamps: true },
);
export const Customer = model('Customer', customerSchema);
