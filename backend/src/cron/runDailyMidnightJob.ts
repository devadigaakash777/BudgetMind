import Profile from '../models/profile.model.js';
import { Wallet } from '../models/wallet.model.js';
import { finalizeSalary } from '../services/profile.service.js';
import UserModel from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

export const runDailyMidnightJob = async () => {
  const todayISO = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

  // Fetch profiles and wallets
  const profiles = await Profile.find({ hasSalary: true }).lean();
  const walletsArray = await Wallet.find().lean();

  // Optimize wallet lookup with Map
  const wallets = new Map(walletsArray.map(w => [w.userId.toString(), w]));

  for (const profile of profiles) {
    const userId = profile.userId.toString();
    const wallet = wallets.get(userId);
    if (!wallet) continue;

    const mainBal = wallet.MainWallet?.balance ?? 0;
    const tempBal = wallet.TemporaryWallet?.balance ?? 0;
    const threshold = wallet.threshold ?? 0;

    // Wallet top-up logic
    if (mainBal < threshold) {
      const needed = threshold - mainBal;
      const fallbackPercents = [1, 0.5, 0.1, 0.05, 0.01];
      let success = false;

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
          success = true;
          break;
        }
      }

      if (!success) {
        console.log(`Not enough in TemporaryWallet to meet any fallback level for user ${userId}`);
      }
    }

    // Salary finalization logic
    const salaryDay = profile.salary?.date ?? null;
    const steadyDay = wallet.SteadyWallet?.date ?? null;

    const todayDay = new Date().getDate(); // still keep this for numeric comparison

    if (salaryDay === todayDay || (!profile.hasSalary && steadyDay === todayDay)) {
      try {
        await finalizeSalary(userId);

        await Profile.updateOne(
          { userId: profile.userId },
          { $set: { isSalaryPaid: true } }
        );

        console.log(`Salary finalized for user ${userId}`);

        const user = await UserModel.findOne({ userId });
        if (user) {
          await sendEmail(
            user.email,
            'Your Wallet Has Been Updated',
            `<h3>Hi ${user.firstName},</h3>
             <p>Today is your scheduled salary day. Your wallet has been successfully updated.</p>`
          );
        }
      } catch (err) {
        console.error(`Error finalizing salary for user ${userId}`, err);
      }
    }
  }
};
