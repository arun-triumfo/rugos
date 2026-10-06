import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, sparse: true },
    companyName: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    businessMode: { type: String, enum: ['export', 'import'], default: null },
    status: {
      type: String,
      enum: ['Pending Approval', 'Active', 'Suspended'],
      default: 'Pending Approval',
    },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    usersAllowed: { type: Number, default: 3 },
    activatedAt: { type: Date, default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Tenant = mongoose.model('Tenant', tenantSchema);
