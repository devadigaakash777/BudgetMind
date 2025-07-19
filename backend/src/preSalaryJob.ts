import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { triggerPreSalaryActions } from './runDailyMidnightJob.js';

dotenv.config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

const run = async () => {
  await connectToDB();

  try {
    console.log(`🕒 Pre-salary job started at ${new Date().toLocaleTimeString()}`);
    await triggerPreSalaryActions();
    console.log('✅ Pre-salary job completed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Pre-salary job failed:', err);
    process.exit(1);
  }
};

run();
