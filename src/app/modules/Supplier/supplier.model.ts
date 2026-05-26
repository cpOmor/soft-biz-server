import { Schema, model } from 'mongoose';
const supplierSchema = new Schema(
  {
    shopId:   { type: String, required: true, index: true },
    name:     { type: String, required: true, trim: true },
    phone:    { type: String, default: '' },
    email:    { type: String, default: '' },
    address:  { type: String, default: '' },
    totalDue: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export const Supplier = model('Supplier', supplierSchema);
