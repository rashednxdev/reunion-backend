import mongoose from 'mongoose';

const designationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    short: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.Designation || mongoose.model('Designation', designationSchema);
