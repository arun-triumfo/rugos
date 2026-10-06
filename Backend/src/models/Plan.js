import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    monthlyPrice: { type: Number, required: true },
    yearlyPrice: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    popular: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    features: [{ type: String }],
    usersAllowed: { type: Number, default: 3 },
  },
  { timestamps: true }
);

export const Plan = mongoose.model('Plan', planSchema);
