import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema(
  {
    id: String,
    at: Date,
    title: String,
    user: String,
    status: { type: String, enum: ['done', 'pending', 'locked'], default: 'locked' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    orderNumber: { type: String, required: true },
    marketplace: String,
    marketplaceOrderId: String,
    date: Date,
    customer: String,
    customerEmail: String,
    country: String,
    shipTo: { type: mongoose.Schema.Types.Mixed },
    sku: String,
    marketplaceSku: String,
    product: String,
    qty: { type: Number, default: 1 },
    sellingPrice: Number,
    currency: { type: String, default: 'INR' },
    fulfilmentLocation: String,
    fulfilmentType: String,
    fulfilmentPath: String,
    allocationChecks: { type: mongoose.Schema.Types.Mixed },
    inventoryStatus: String,
    shipmentStatus: String,
    paymentStatus: String,
    profit: Number,
    margin: Number,
    totalCost: Number,
    status: { type: String, default: 'Imported' },
    warehouse: String,
    bin: String,
    demoWorkflow: { type: Boolean, default: false },
    workflowStep: { type: Number, default: 1 },
    courier: { type: mongoose.Schema.Types.Mixed },
    awb: String,
    qrReference: String,
    labelGenerated: { type: Boolean, default: false },
    labelPrinted: { type: Boolean, default: false },
    packingProof: String,
    usaReceiptConfirmed: { type: Boolean, default: false },
    usaReceipt: { type: mongoose.Schema.Types.Mixed },
    weighing: { type: mongoose.Schema.Types.Mixed },
    mtoId: String,
    mtoReady: { type: Boolean, default: true },
    costs: { type: mongoose.Schema.Types.Mixed },
    estimatedCosts: { type: mongoose.Schema.Types.Mixed },
    actualCostsReady: { type: Boolean, default: false },
    timeline: [timelineSchema],
    auditLog: [{ type: mongoose.Schema.Types.Mixed }],
  },
  { timestamps: true }
);

orderSchema.index({ tenantId: 1, key: 1 }, { unique: true });

orderSchema.methods.toClient = function toClient() {
  const o = this.toObject({ virtuals: false });
  return {
    ...o,
    id: o.key,
    _id: o._id.toString(),
    tenantId: o.tenantId?.toString?.() || o.tenantId,
    date: o.date,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
};

export const Order = mongoose.model('Order', orderSchema);
