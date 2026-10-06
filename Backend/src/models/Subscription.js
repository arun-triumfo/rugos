import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, sparse: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending Activation', 'Active', 'Suspended', 'Cancelled'],
      default: 'Pending Activation',
    },
    paymentRef: { type: String, default: '' },
    startedAt: { type: Date, default: null },
    renewsAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
