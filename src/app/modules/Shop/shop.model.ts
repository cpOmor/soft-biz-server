import { Schema, model } from 'mongoose';

const shopSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name:    { type: String, required: true, trim: true },
    slug:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    logo:    { type: String, default: '' },
    address: { type: String, default: '' },
    phone:   { type: String, default: '' },
    email:   { type: String, default: '' },
    currency:        { type: String, default: 'BDT' },
    invoiceStyle:    { type: String, enum: ['minimal','classic','modern'], default: 'minimal' },
    subscriptionPlan:{ type: String, enum: ['free','basic','premium'], default: 'free' },
    planExpiresAt:   { type: Date, default: null },
  },
  { timestamps: true },
);

export const Shop = model('Shop', shopSchema);
