import { Request, Response } from 'express';
import DailyExpense, { IDailyExpense } from '../models/expense.model.js';
import mongoose from 'mongoose';
import { BudgetSummary } from "../models/budget.model.js";
import { processDailyExpense, handleTempWallet } from "../services/dailyExpense.service.js";
import { Wallet } from "../models/wallet.model.js";

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
      usedBoth
    }: {
      totalAmount: number;
      numberOfDays: number;
      details: string;
      source: 'wishlist' | 'main';
      canReduceBudget: boolean;
      usedBoth: boolean;
    } = req.body;
    const generatedExpenses = req.body;
    // Checking whether take money from wishlist or main
    // const budget = await BudgetSummary.findOne({ userId }).lean();
    // if (!budget) throw new Error(`BudgetSummary not found for user ${userId}`);
    // const actualDailyBudget = budget.DailyBudget.amount * numberOfDays;

    // const wallet = await Wallet.findOne({ userId }).lean();
    // if (!wallet) throw new Error(`Wallet not found for user ${userId}`);
    // const walletBudget = wallet.TemporaryWallet.balance;

    // const totalBudget = actualDailyBudget + walletBudget;

    // let prefer = source;
    // for(let i=0; i<2; i++){
    //   if(totalAmount < totalBudget){
    //     handleTempWallet(userId, 100, prefer, canReduceBudget)
    //   }
    //   prefer = "main";
    // }

    // const today = new Date();
    // const expense = {amount: totalAmount, duration: numberOfDays}

    // const generatedExpenses = processDailyExpense(expense, today, userId, details)

    console.log(JSON.stringify(generatedExpenses, null, 2));
    // await DailyExpense.insertMany(generatedExpenses);
    res.status(201).json({ message: 'Generated and added expenses', data: generatedExpenses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate/add expenses', details: error });
  }
};
