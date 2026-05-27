import { Schema, model } from 'mongoose';

const themeSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, lowercase: true },
    label: { type: String, required: true, trim: true },
    vars: {
      type: Map,
      of: String,
      required: true,
      default: {},
    },
    system: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true },
);

export const Theme = model('Theme', themeSchema);
