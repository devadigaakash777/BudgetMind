import mongoose, { Schema, Document } from 'mongoose';

// --- Expense Interface ---
export interface IExpense extends Document {
  userId: string;
  billName: string;
  status: 'pending' | 'paid' | 'expired';
  dueDate: number;
  isPaid: boolean;
  amount: number;
  isPermanent: boolean;
  isFunded: boolean;
  durationInMonths: number;
  amountToFund: number;
}

// --- Summary Interface (BudgetState format) ---
export interface IBudgetSummary extends Document {
  userId: string;
  MonthlyBudget: {
    amount: number;
    amountFunded: number;
  };
  DailyBudget: {
    amount: number;
    setAmount: number;
    min: number;
    max: number;
  };
  FixedExpenses: {
    rowsPerPage: number;
    totalSavedAmount: number;
  };
}

// --- Expense Schema ---
const ExpenseSchema = new Schema<IExpense>({
  userId: { type: String, required: true },
  billName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'paid', 'expired'], default: 'pending' },
  dueDate: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  amount: { type: Number, required: true },
  isPermanent: { type: Boolean, default: false },
  isFunded: { type: Boolean, default: false },
  durationInMonths: { type: Number, default: 1 },
  amountToFund: { type: Number, required: true }
});

// --- Summary Schema (nested FixedExpenses) ---
const BudgetSummarySchema = new Schema<IBudgetSummary>({
  userId: { type: String, required: true, unique: true },
  MonthlyBudget: {
    amount: { type: Number, default: 0 },
    amountFunded: { type: Number, default: 0 }
  },
  DailyBudget: {
    amount: { type: Number, default: 0 },
    setAmount: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  FixedExpenses: {
    rowsPerPage: { type: Number, default: 3 },
    totalSavedAmount: { type: Number, default: 0 }
  }
});

// --- Model Exports ---
export const FixedExpense = mongoose.model<IExpense>('FixedExpense', ExpenseSchema);
export const BudgetSummary = mongoose.model<IBudgetSummary>('BudgetSummary', BudgetSummarySchema);
