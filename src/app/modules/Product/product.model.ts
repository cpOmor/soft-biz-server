import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    shopId:       { type: String, required: true, index: true },
    code:         { type: String, default: '' },
    name:         { type: String, required: true, trim: true },
    description:  { type: String, default: '' },
    image:        { type: String, default: '' },
    category:     { type: String, default: '' },
    purchasePrice:{ type: Number, default: 0 },
    sellingPrice: { type: Number, required: true },
    discount:     { type: Number, default: 0 },
    discountType: { type: String, enum: ['flat','percent'], default: 'flat' },
    unit:         { type: String, default: 'pcs' },
    stock:        { type: Number, default: 0 },
    lowStockAlert:{ type: Number, default: 5 },
    barcode:      { type: String, default: '' },
    supplierId:   { type: String, default: null },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Product = model('Product', productSchema);
