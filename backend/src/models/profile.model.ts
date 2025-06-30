import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  phone?: string;
  jobTitle?: string;
  address?: {
    city: string;
    state: string;
    country: string;
    timezone: string;
  }[];
  isProfileComplete?: boolean;
  isSalaryPaid?: boolean;
  hasSalary?: boolean;
  salary?: {
    amount: number;
    date: number;
  };
}

const profileSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
  phone: { type: String },
  jobTitle: { type: String },
  address: [
    {
      city: String,
      state: String,
      country: { type: String, default: "India" },
      timezone: { type: String, default: "GMT+5:30" },
    }
  ],
  isProfileComplete: { type: Boolean, default: false },
  isSalaryPaid: { type: Boolean, default: true },
  hasSalary: { type: Boolean, default: true },
  salary: {
    amount: { type: Number, default: 0 },
    date: { type: Number, default: 1 }
  }
});

export default mongoose.model<IProfile>('Profile', profileSchema);
