import mongoose from 'mongoose';

const stockLedgerSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    key: String,
    date: { type: Date, default: Date.now },
    sku: { type: String, required: true },
    type: String,
    reference: String,
    from: String,
    to: String,
    qtyIn: { type: Number, default: 0 },
    qtyOut: { type: Number, default: 0 },
    balance: Number,
    user: String,
    notes: String,
  },
  { timestamps: true }
);

export const StockLedger = mongoose.model('StockLedger', stockLedgerSchema);
