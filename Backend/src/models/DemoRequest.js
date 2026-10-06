import mongoose from 'mongoose';

const demoRequestSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '', trim: true },
    message: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export const DemoRequest = mongoose.model('DemoRequest', demoRequestSchema);
