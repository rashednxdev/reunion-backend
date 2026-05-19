import mongoose from 'mongoose';

const prizeSchema = new mongoose.Schema({
  position: { type: Number, required: true },  // 1 = 1st prize, 2 = 2nd, etc.
  label: { type: String, required: true, trim: true }, // "Champion", "Runner-Up", etc.
  winnerSerial: { type: Number, default: null },
  winnerName: { type: String, default: null },
}, { _id: true });

const rangeSchema = new mongoose.Schema({
  from: { type: Number, required: true },
  to: { type: Number, required: true },
}, { _id: true });

const drawConfigSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Grand Draw 2026', trim: true },
    ranges: [rangeSchema],   // e.g. [{from:1001, to:1050}, {from:1100, to:1120}]
    prizes: [prizeSchema],   // e.g. [{position:1, label:'Champion'}, ...]
    isLocked: { type: Boolean, default: false }, // once draw starts, lock config
  },
  { timestamps: true }
);

const DrawConfig = mongoose.model('DrawConfig', drawConfigSchema);
export default DrawConfig;
