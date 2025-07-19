import cron from 'node-cron';
import { runDailyMidnightJob, triggerPreSalaryActions } from './runDailyMidnightJob.js';

// Ensure environment variables are loaded
import dotenv from 'dotenv';
dotenv.config();

let isRunning = false;

// Daily midnight cron (00:10 AM)
cron.schedule('10 0 * * *', async () => {
  if (isRunning) {
    console.warn('Skipping cron: job already running');
    return;
  }
  isRunning = true;

  try {
    console.log(`Cron job running at ${new Date().toLocaleTimeString()}`);
    await runDailyMidnightJob();
    console.log('Daily job completed.');
  } catch (err) {
    console.error('Daily job failed:', err);
  } finally {
    isRunning = false;
  }
});

// Pre-salary cron (11:40 PM)
cron.schedule('40 23 * * *', async () => {
  if (isRunning) {
    console.warn('⏳ Skipping pre-salary cron: job already running');
    return;
  }
  isRunning = true;

  try {
    console.log(`🕒 Pre-salary cron running at ${new Date().toLocaleTimeString()}`);
    await triggerPreSalaryActions();
    console.log('✅ Pre-salary tasks completed.');
  } catch (err) {
    console.error('❌ Pre-salary job failed:', err);
  } finally {
    isRunning = false;
  }
});

// 🟢 Keep process alive
console.log('🚀 Cron worker started...');
