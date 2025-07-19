import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { runDailyMidnightJob } from './runDailyMidnightJob.js';

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
    console.log(`🚀 Daily midnight job started at ${new Date().toLocaleTimeString()}`);
    await runDailyMidnightJob();
    console.log('✅ Daily midnight job completed.');
    process.exit(0); // clean exit
  } catch (err) {
    console.error('❌ Daily midnight job failed:', err);
    process.exit(1);
  }
};

run();
