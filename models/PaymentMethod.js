import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { 
      type: String, 
      enum: ['Mobile Banking', 'Bank Account'], 
      default: 'Mobile Banking' 
    },
    number: { type: String, default: '' }, // For wallet number in Mobile Banking
    bankName: { type: String, default: '' },
    accountName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    routingNumber: { type: String, default: '' },
    instructions: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.PaymentMethod || mongoose.model('PaymentMethod', paymentMethodSchema);
