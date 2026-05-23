import mongoose from 'mongoose';

const officeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    short: { type: String, required: true },
    officeTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'OfficeType', required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Office || mongoose.model('Office', officeSchema);
