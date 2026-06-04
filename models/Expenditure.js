import mongoose from 'mongoose';

const expenditureSchema = new mongoose.Schema(
  {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExpenditureType',
      required: [true, 'Expenditure type is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be non-negative'],
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Expenditure = mongoose.model('Expenditure', expenditureSchema);
export default Expenditure;
