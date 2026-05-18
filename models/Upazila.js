import mongoose from 'mongoose';

const upazilaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    short: { type: String, required: true },
    districtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Upazila || mongoose.model('Upazila', upazilaSchema);
