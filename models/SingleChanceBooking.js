import mongoose from 'mongoose';

const singleChanceBookingSchema = new mongoose.Schema(
  {
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
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
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    ticketId: {
      type: String,
      required: true,
      trim: true,
    },
    gameName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent booking the same game twice for the same registration
singleChanceBookingSchema.index({ registrationId: 1, gameName: 1 }, { unique: true });

const SingleChanceBooking = mongoose.model('SingleChanceBooking', singleChanceBookingSchema);
export default SingleChanceBooking;
