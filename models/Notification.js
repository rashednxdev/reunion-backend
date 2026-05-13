import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    recipientCount: {
      type: Number,
      default: 0,
    },
    sentBy: {
      type: String,
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
