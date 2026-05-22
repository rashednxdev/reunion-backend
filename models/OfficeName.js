import mongoose from 'mongoose';

const officeNameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    short: { type: String, required: true, trim: true },
    officeTypeKey: {
      type: String,
      required: true,
      enum: ['CAFO', 'DCA', 'DAFO', 'UAO'],
    },
    divisionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Division',
      required: false,
    },
    districtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
    },
    upazilaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Upazila',
    },
  },
  { timestamps: true }
);

const OfficeName = mongoose.model('OfficeName', officeNameSchema);
export default OfficeName;
