import { Schema, model } from 'mongoose';

const invoiceItemSchema = new Schema({
  productId:   { type: String, default: null },
  description: { type: String, required: true },
  qty:         { type: Number, required: true },
  price:       { type: Number, required: true },
  total:       { type: Number, required: true },
}, { _id: false });

const invoiceSchema = new Schema(
  {
    shopId:          { type: String, required: true, index: true },
    invoiceId:       { type: String, default: '' },
    customerId:      { type: String, default: null },
    customerName:    { type: String, default: '' },
    customerPhone:   { type: String, default: '' },
    courierTracking: { type: String, default: '' },
    items:           { type: [invoiceItemSchema], default: [] },
    subtotal:        { type: Number, default: 0 },
    discount:        { type: Number, default: 0 },
    discountType:    { type: String, enum: ['flat','percent'], default: 'flat' },
    vat:             { type: Number, default: 0 },
    vatType:         { type: String, enum: ['flat','percent'], default: 'flat' },
    total:           { type: Number, default: 0 },
    paid:            { type: Number, default: 0 },
    due:             { type: Number, default: 0 },
    status:          { type: String, enum: ['draft','paid','partial','due','cancelled'], default: 'due' },
    notes:           { type: String, default: '' },
    createdBy:       { type: String, default: '' },
  },
  { timestamps: true },
);

export const Invoice = model('Invoice', invoiceSchema);
