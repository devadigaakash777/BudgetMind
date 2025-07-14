import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import Profile from '../models/profile.model.js';
import User from '../models/User.js';
import { allocateBudget, finalizeProfile } from "../services/profile.service.js";
import { FixedExpense, BudgetSummary } from '../models/budget.model.js';
import DailyExpense from '../models/expense.model.js';
import { Wallet } from '../models/wallet.model.js';
import { WishlistItem, WishlistSummary } from '../models/wishlist.model.js';

const getOrCreateProfile = async (userId: string) => {
  let profile = await Profile.findOne({ userId });
  if (!profile) {
    profile = new Profile({ userId });
    await profile.save();
  }
  return profile;
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  const { userId } = req as any;

  const profile = await getOrCreateProfile(userId);

  res.status(200).json({
    phone: profile.phone,
    jobTitle: profile.jobTitle,
    address: profile.address,
    isProfileComplete: profile.isProfileComplete,
    isSalaryPaid: profile.isSalaryPaid,
    hasSalary: profile.hasSalary,
    salary: profile.salary
  });
};

export const updateBasicProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  const { firstName, lastName, email, phone, city, state } = req.body;

  try {
    await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      email
    });

    const profile = await getOrCreateProfile(userId);
    profile.phone = phone;
    profile.address = [
      {
        city,
        state,
        country: 'India',
        timezone: 'GMT+5:30'
      }
    ];
    await profile.save();

    res.json({ message: 'Profile info updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile info' });
  }
};

export const updateSalary = async (req: AuthRequest, res: Response) => {
  const userId = (req as any).userId;
  const { jobTitle, hasSalary, salaryAmount, salaryDate } = req.body;

  const profile = await getOrCreateProfile(userId);
  profile.jobTitle = jobTitle;
  profile.hasSalary = hasSalary;
  profile.salary = { amount: salaryAmount, date: salaryDate };
  await profile.save();

  res.json({ message: 'Salary info updated' });
};

export const updateAvatar = async (req: AuthRequest, res: Response) => {
  const userId = (req as any).userId;
  await User.findByIdAndUpdate(userId, { avatar: req.body.avatar });
  res.json({ message: 'Avatar updated' });
};

export const markProfileComplete = async (req: AuthRequest, res: Response) => {
  const userId = (req as any).userId;
  const profile = await getOrCreateProfile(userId);
  profile.isProfileComplete = req.body.isProfileComplete;
  await profile.save();
  console.log("Updated markProfileComplete as ",profile.isProfileComplete);
  res.json({ message: 'Profile status updated' });
};

export const markSalaryPaid = async (req: AuthRequest, res: Response) => {
  const userId = (req as any).userId;
  const profile = await getOrCreateProfile(userId);
  profile.isSalaryPaid = req.body.isSalaryPaid;
  await profile.save();
  res.json({ message: 'Salary status updated' });
};

export const calculateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = (req as any).userId; // from JWT or session
        const newState = await finalizeProfile(userId);
        res.status(200).json({ message: newState });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to calculate profile" });
    }
};

export const resetUserData = async (req: AuthRequest, res: Response) => {
  const userId = (req as any).userId;
  const { deleteDailyExpense = false } = req.body;

  try {
    // 1. Reset only specific Profile fields
    const profile = await Profile.findOne({ userId });
    if (profile) {
      profile.isProfileComplete = false;
      profile.isSalaryPaid = false;
      profile.hasSalary = false;
      profile.salary = { amount: 0, date: 1 };
      await profile.save();
    }

    // 2. Delete related data
    await Wallet.deleteOne({ userId });
    await FixedExpense.deleteMany({ userId });
    await BudgetSummary.deleteOne({ userId });
    await WishlistItem.deleteMany({ userId });
    await WishlistSummary.deleteOne({ userId });

    // 3. Conditionally delete Daily Expenses
    if (deleteDailyExpense) {
      await DailyExpense.deleteMany({ userId });
    }

    res.status(200).json({ message: 'User data reset successfully' });
  } catch (error) {
    console.error('Error resetting user data:', error);
    res.status(500).json({ message: 'Failed to reset user data' });
  }
};

export const resetBudget = async (req: AuthRequest, res: Response) => {
  const userId = (req as any).userId;
  
  try {
        const userId = (req as any).userId; // from JWT or session
        const newState = await allocateBudget(userId);
        res.status(200).json({ message: newState });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to reallocate budget" });
    }
}