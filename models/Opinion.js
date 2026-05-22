import mongoose from 'mongoose';

const opinionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    officeName: {
      type: String,
      trim: true,
    },
    opinion: {
      type: String,
      required: [true, 'Opinion is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Opinion = mongoose.model('Opinion', opinionSchema);
export default Opinion;
