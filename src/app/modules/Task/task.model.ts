import { Schema, model } from 'mongoose';
const taskSchema = new Schema(
  {
    shopId:       { type: String, required: true, index: true },
    title:        { type: String, required: true, trim: true },
    description:  { type: String, default: '' },
    customerId:   { type: String, default: null },
    customerName: { type: String, default: '' },
    assignedTo:   { type: String, default: '' },
    priority:     { type: String, enum: ['low','medium','high'], default: 'medium' },
    status:       { type: String, enum: ['pending','in_progress','completed','overdue'], default: 'pending' },
    deadline:     { type: Date, default: null },
  },
  { timestamps: true },
);
export const Task = model('Task', taskSchema);
