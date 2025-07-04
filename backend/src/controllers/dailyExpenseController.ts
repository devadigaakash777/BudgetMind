import { Request, Response } from 'express';
import DailyExpense, { IDailyExpense } from '../models/expense.model.js';
import mongoose from 'mongoose';

// 1. Fetch user expenses
export const getUserDailyExpenses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const expenses = await DailyExpense.find({ userId }).sort({ date: 1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses', details: error });
  }
};

// 2. Bulk add expenses
export const addDailyExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const expenses = req.body.map((expense: Omit<IDailyExpense, 'userId'>) => ({
      ...expense,
      userId: userId,
    }));

    await DailyExpense.insertMany(expenses);
    res.status(201).json({ message: 'Expenses added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add expenses', details: error });
  }
};

// 3. Generate and add expenses
export const generateAndAddExpenses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const {
      totalAmount,
      numberOfDays,
      details,
      source,
      canReduceBudget,
    }: {
      totalAmount: number;
      numberOfDays: number;
      details: string;
      source: 'wishlist' | 'main';
      canReduceBudget: boolean;
    } = req.body;

    const today = new Date();
    const perDayAmount = totalAmount / numberOfDays;

    const generatedExpenses: Partial<IDailyExpense>[] = Array.from({ length: numberOfDays }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      const isoDate = date.toISOString().split('T')[0];

      return {
        userId: new mongoose.Types.ObjectId(userId),
        amount: Math.round(perDayAmount),
        date: isoDate,
        details,
        balance: 0,
        amountStatus: 'equal',
        amountDifference: 0,
      };
    });

    await DailyExpense.insertMany(generatedExpenses);
    res.status(201).json({ message: 'Generated and added expenses', data: generatedExpenses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate/add expenses', details: error });
  }
};
