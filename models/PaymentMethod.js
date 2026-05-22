import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    number: { type: String, required: true },
    instructions: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.PaymentMethod || mongoose.model('PaymentMethod', paymentMethodSchema);
