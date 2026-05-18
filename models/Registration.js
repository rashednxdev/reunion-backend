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
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      trim: true,
    },
    officeType: {
      type: String,
      required: [true, 'Office type is required'],
      trim: true,
    },
    division: {
      type: String,
      required: [true, 'Division is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    upazila: {
      type: String,
      required: [true, 'Upazila is required'],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      unique: true, // We will enforce unique mobile numbers per registration
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    tshirtSize: {
      type: String,
      trim: true,
    },
    members: [
      {
        name: String,
        gender: String,
        relation: String,
        ageGroup: String,
      }
    ],
    totalFee: {
      type: Number,
      required: true,
      default: 1200,
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    amountPaid: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      trim: true,
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
