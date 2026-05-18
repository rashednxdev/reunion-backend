import mongoose from 'mongoose';

const divisionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    short: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Division || mongoose.model('Division', divisionSchema);
