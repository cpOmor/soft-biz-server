import { Schema, model } from 'mongoose';

const permissionsSchema = new Schema({
  invoice:   { view: Boolean, create: Boolean, edit: Boolean, delete: Boolean },
  inventory: { view: Boolean, create: Boolean, edit: Boolean, delete: Boolean },
  customers: { view: Boolean, create: Boolean, edit: Boolean },
  reports:   { view: Boolean },
  settings:  { view: Boolean, edit: Boolean },
}, { _id: false });

const staffSchema = new Schema(
  {
    shopId:    { type: String, required: true, index: true },
    userId:    { type: String, default: '' },
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, trim: true },
    phone:     { type: String, default: '' },
    role:      { type: String, default: 'STAFF' },
    isActive:  { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    permissions: {
      type: permissionsSchema,
      default: () => ({
        invoice:   { view: true,  create: false, edit: false, delete: false },
        inventory: { view: true,  create: false, edit: false, delete: false },
        customers: { view: true,  create: false, edit: false },
        reports:   { view: false },
        settings:  { view: false, edit: false },
      }),
    },
  },
  { timestamps: true },
);

export const Staff = model('Staff', staffSchema);
