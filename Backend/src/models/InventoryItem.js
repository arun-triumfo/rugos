import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    sku: { type: String, required: true },
    product: String,
    indiaAvailable: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 },
    packed: { type: Number, default: 0 },
    inTransit: { type: Number, default: 0 },
    usa: { type: Number, default: 0 },
    fba: { type: Number, default: 0 },
    damaged: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 0 },
    bin: String,
    usaBin: String,
    standardCost: Number,
  },
  { timestamps: true }
);

inventorySchema.index({ tenantId: 1, sku: 1 }, { unique: true });

inventorySchema.methods.toClient = function toClient() {
  const o = this.toObject();
  return {
    ...o,
    id: o.sku,
    _id: o._id.toString(),
    tenantId: o.tenantId?.toString?.() || o.tenantId,
  };
};

export const InventoryItem = mongoose.model('InventoryItem', inventorySchema);
