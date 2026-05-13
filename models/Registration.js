import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    employeeId: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District/Posting is required'],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    attendance: {
      type: String,
      enum: ['yes', 'maybe', 'no'],
      default: 'yes',
    },
    message: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
