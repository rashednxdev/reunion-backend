import mongoose from 'mongoose';

const officeTypeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    short: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.OfficeType || mongoose.model('OfficeType', officeTypeSchema);
