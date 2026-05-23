import mongoose from 'mongoose';

const singleChanceConfigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: 'Single Chance Games',
    },
    time: {
      type: String,
      required: true,
      default: '02:30 PM - 04:00 PM',
    },
    policy: {
      type: String,
      required: true,
      default: '1. Only registered and approved members can book and participate.\n2. Each member can book only once per game.\n3. Ticket verification is required at the venue.',
    },
    games: {
      type: [String],
      required: true,
      default: ['Hari Bhanga', 'Drop a ball in a basket'],
    },
  },
  {
    timestamps: true,
  }
);

const SingleChanceConfig = mongoose.model('SingleChanceConfig', singleChanceConfigSchema);
export default SingleChanceConfig;
