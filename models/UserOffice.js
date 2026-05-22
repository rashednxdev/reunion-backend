import mongoose from 'mongoose';

const userOfficeSchema = new mongoose.Schema(
  {
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    officeType: {
      type: String,
      required: true,
      trim: true,
    },
    officeName: {
      type: String,
      required: true,
      trim: true,
    },
    division: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    upazila: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Add index on officeName and officeType for easy sorting/reporting
userOfficeSchema.index({ officeName: 1 });
userOfficeSchema.index({ officeType: 1 });

const UserOffice = mongoose.models.UserOffice || mongoose.model('UserOffice', userOfficeSchema);
export default UserOffice;
