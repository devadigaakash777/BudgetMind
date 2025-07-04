import mongoose, { Document, Schema } from 'mongoose';

export type AmountStatus = 'above' | 'below' | 'equal';

export interface IDailyExpense extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  date: string;
  details: string;
  balance: number;
  amountStatus: AmountStatus;
  amountDifference: number;
}

const DailyExpenseSchema = new Schema<IDailyExpense>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    default: '',
  },
  balance: {
    type: Number,
    required: true,
  },
  amountStatus: {
    type: String,
    enum: ['above', 'below', 'equal'],
    required: true,
  },
  amountDifference: {
    type: Number,
    required: true,
  },
});

const DailyExpense = mongoose.model<IDailyExpense>('DailyExpense', DailyExpenseSchema);
export default DailyExpense;
