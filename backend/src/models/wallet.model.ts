import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWallet extends Document {
  userId: Types.ObjectId;  // 👈 link wallet to a user
  MainWallet: { balance: number };
  TemporaryWallet: { balance: number };
  SteadyWallet: {
    balance: number;
    month: number;
    date: number;
    monthlyAmount: number;
  };
  DailyBuffer: { balance: number };
  TotalWealth: { amount: number };
  PendingPayments: { amount: number };
  threshold: number;
}

const WalletSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One wallet per user
  },
  MainWallet: {
    balance: { type: Number, default: 0 },
  },
  TemporaryWallet: {
    balance: { type: Number, default: 0 },
  },
  SteadyWallet: {
    balance: { type: Number, default: 0 },
    month: { type: Number, default: 1 },
    date: { type: Number, default: 1 },
    monthlyAmount: { type: Number, default: 0 },
  },
  DailyBuffer: {
    balance: { type: Number, default: 0 },
  },
  TotalWealth: {
    amount: { type: Number, default: 0 },
  },
  PendingPayments: {
    amount: { type: Number, default: 0 },
  },
  threshold: { type: Number, default: 0 },
});

export const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);
