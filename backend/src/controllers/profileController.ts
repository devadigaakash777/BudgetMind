import { Request, Response } from 'express';
import Profile from '../models/profile.model.js';
import User from '../models/User.js';

export const getUserProfile = async (req: Request, res: Response) => {
  const { userId } = req as any;

  const profile = await Profile.findOne({ userId });

  if (!profile){
    res.status(404).json({ message: 'Profile not found' });
  }
  else{
    res.status(200).json({
        phone: profile.phone,
        jobTitle: profile.jobTitle,
        address: profile.address,
        isProfileComplete: profile.isProfileComplete,
        isSalaryPaid: profile.isSalaryPaid,
        hasSalary: profile.hasSalary,
        Salary: profile.salary
    });
  }
};

export const updateBasicProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  const { firstName, lastName, email, phone, city, state } = req.body;

  try {
    // Update User model (firstName, lastName, email)
    await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      email
    });

    // Update Profile model (phone + address)
    await Profile.findOneAndUpdate(
      { userId },
      {
        phone,
        address: [
          {
            city,
            state,
            country: 'India',
            timezone: 'GMT+5:30'
          }
        ]
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Profile info updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile info' });
  }
};

export const updateSalary = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { jobTitle, hasSalary, salaryAmount, salaryDate } = req.body;

  await Profile.findOneAndUpdate(
    { userId },
    {
      jobTitle,
      hasSalary,
      salary: { amount: salaryAmount, date: salaryDate }
    },
    { upsert: true }
  );

  res.json({ message: 'Salary info updated' });
};

export const updateAvatar = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  await User.findByIdAndUpdate(userId, { avatar: req.body.avatar });
  res.json({ message: 'Avatar updated' });
};

export const markProfileComplete = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  await Profile.findOneAndUpdate(
    { userId },
    { isProfileComplete: req.body.isProfileComplete },
    { upsert: true }
  );
  res.json({ message: 'Profile status updated' });
};

export const markSalaryPaid = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  await Profile.findOneAndUpdate(
    { userId },
    { isSalaryPaid: req.body.isSalaryPaid },
    { upsert: true }
  );
  res.json({ message: 'Salary status updated' });
};
