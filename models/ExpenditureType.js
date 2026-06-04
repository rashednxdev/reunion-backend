import mongoose from 'mongoose';

const expenditureTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Expenditure type name is required'],
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const ExpenditureType = mongoose.model('ExpenditureType', expenditureTypeSchema);
export default ExpenditureType;
