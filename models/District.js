import mongoose from 'mongoose';

const districtSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    short: { type: String, required: true },
    divisionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Division',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.District || mongoose.model('District', districtSchema);
