import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ROLES = [
  'Management',
  'India Warehouse',
  'USA Warehouse',
  'Accounts',
  'Sales',
  'Logistics',
  'Auditor',
  'Super Admin',
  'Platform Superadmin',
];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, default: 'Super Admin' },
    isPlatformAdmin: { type: Boolean, default: false },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', default: null },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    isPlatformAdmin: this.isPlatformAdmin,
    tenantId: this.tenantId ? this.tenantId.toString() : null,
    status: this.status,
    lastLogin: this.lastLogin,
  };
};

export const User = mongoose.model('User', userSchema);
export { ROLES };
