import Profile from '../models/profile.model.js';
import { Wallet } from '../models/wallet.model.js';
import { finalizeSalary } from '../services/profile.service.js';
import mongoose from 'mongoose';

export const runDailyMidnightJob = async () => {
  const today = new Date().getDate();

  // Fetch all profiles with linked wallets
  const profiles = await Profile.find({ hasSalary: true }).lean();
  const wallets = await Wallet.find().lean();

  for (const profile of profiles) {
    const userId = profile.userId.toString();
    const wallet = wallets.find(w => w.userId.toString() === userId);
    if (!wallet) continue;

    // 1. Wallet Top-Up Logic with Progressive Fallback
    const mainBal = wallet.MainWallet.balance;
    const tempBal = wallet.TemporaryWallet.balance;
    const threshold = wallet.threshold;

    if (mainBal < threshold) {
      const needed = threshold - mainBal;

      // Fallback percentages (100%, 50%, 10%, 5%, 1%)
      const fallbackPercents = [1, 0.5, 0.1, 0.05, 0.01]; // in order of attempt

      for (const percent of fallbackPercents) {
        const attemptAmount = needed * percent;

        if (tempBal >= attemptAmount) {
          await Wallet.updateOne(
            { userId: profile.userId },
            {
              $inc: {
                'MainWallet.balance': attemptAmount,
                'TemporaryWallet.balance': -attemptAmount
              }
            }
          );
          console.log(`Topped up MainWallet with ${Math.round(percent * 100)}% for user ${userId}`);
          break;
        }
      }

      // If no fallback level succeeded
      console.log(`Not enough in TemporaryWallet to meet any fallback level for user ${userId}`);
    }

    // 2. Salary Finalization Logic
    if (profile.salary?.date === today || (!profile.hasSalary && wallet.SteadyWallet.date == today)) {
      try {
        await finalizeSalary(userId);
        await Profile.updateOne(
          { userId: profile.userId },
          { $set: { isSalaryPaid: true } }
        );
        console.log(`Salary finalized for user ${userId}`);
      } catch (err) {
        console.error(`Error finalizing salary for ${userId}`, err);
      }
    }
  }
};
