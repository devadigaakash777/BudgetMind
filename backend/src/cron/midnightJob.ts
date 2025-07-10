import cron from 'node-cron';
import { runDailyMidnightJob } from './runDailyMidnightJob.js';

let isRunning = false;

cron.schedule('10 0 * * *', async () => {
  if (isRunning) {
    console.warn('Skipping cron: job already running');
    return;
  }
  isRunning = true;

  try {
    console.log(`⏱️ Cron job running at ${new Date().toLocaleTimeString()}`);
    await runDailyMidnightJob();
    console.log('Daily job completed.');
  } catch (err) {
    console.error('Job failed:', err);
  } finally {
    isRunning = false;
  }
});
