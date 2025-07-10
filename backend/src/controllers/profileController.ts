import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import Profile from '../models/profile.model.js';
import User from '../models/User.js';
import { finalizeProfile } from "../services/profile.service.js";

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
