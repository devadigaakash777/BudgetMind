import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import DailyExpense, { IDailyExpense } from '../models/expense.model.js';
import mongoose from 'mongoose';
import { BudgetSummary } from "../models/budget.model.js";
import { processDailyExpense, handleTempWallet } from "../services/dailyExpense.service.js";
import { Wallet } from "../models/wallet.model.js";
import XLSX from "xlsx";
import dayjs from 'dayjs';
import { getDaysSinceLastExpense } from '../utils/expensePending.js';

// 1. Fetch user expenses
export const getUserDailyExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req as any).userId;
    const expenses = await DailyExpense.find({ userId }).sort({ date: 1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses', details: error });
  }
};

// 2. Bulk add expenses
export const addDailyExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
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
export const generateAndAddExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
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
    
     //  Reject if expenses already exist for today
    const daysBetween = await getDaysSinceLastExpense(userId);

    if (daysBetween !== null && daysBetween === 0) {
      res.status(400).json({
        error: 'You have already added expenses for today. Try again tomorrow.',
      });
      return;
    }

    // Checking whether take money from wishlist or main

    const budget = await BudgetSummary.findOne({ userId }).lean();
    if (!budget) throw new Error(`BudgetSummary not found for user ${userId}`);
    const actualDailyBudget = budget.DailyBudget.amount * numberOfDays;

    const wallet = await Wallet.findOne({ userId }).lean();
    if (!wallet) throw new Error(`Wallet not found for user ${userId}`);

    const tempWalletBudget = wallet.TemporaryWallet.balance;
    const bufferWalletBudget = wallet.DailyBuffer.balance;
    const walletBudget = tempWalletBudget + bufferWalletBudget;

    const totalBudget = actualDailyBudget + walletBudget;

    let count = 1;
    let preference = source;
    if(usedBoth){
      preference = (preference === 'main') ? 'wishlist' : 'main';
      count = 2;
    }

    if(totalAmount > totalBudget){
      let required = totalAmount - totalBudget;
      const unpaidDays = daysBetween || 0;
      for(let i=0; i<count ; i++){
        const newState = await handleTempWallet(userId, required, preference, canReduceBudget, false, unpaidDays);
        required -= (newState.amountCollected - newState.freedBudget);
        preference = (preference === 'main') ? 'wishlist' : 'main';
        console.warn("Required ",required);
      } 
      if(required > 0){
        throw new Error("Insufficient balance");
      }
    }

    const today = new Date();
    const expense = {amount: totalAmount, duration: numberOfDays}

    const generatedState = await processDailyExpense(expense, today, userId, details, daysBetween);

    const generatedExpenses = generatedState.data;
    console.log(JSON.stringify(generatedExpenses, null, 2));
    await DailyExpense.insertMany(generatedExpenses);
    res.status(201).json({ message: 'Generated and added expenses', data: generatedExpenses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to generate/add expenses', details: error });
  }
};

export const downloadUserExpensesExcel = async (req: AuthRequest, res: Response): Promise<void>  => {
  try {
    const userId = (req as any).userId;

    // Get "from" and "to" dates from query params
    const { from, to } = req.query;

    if (!from || !to) {
      res.status(400).json({ error: "Please provide 'from' and 'to' dates in query params." });
      return;
    }

    // Dates are stored as strings, so we need to use $gte and $lte on date strings
    const fromDate = from as string;
    const toDate = to as string;

    // Fetch expenses for this user within the date range
    const expenses = await DailyExpense.find({
      userId,
      date: { $gte: fromDate, $lte: toDate },
    })
      .sort({ date: 1 }) // Sort by date ascending
      .lean();

    if (!expenses || expenses.length === 0) {
      res.status(404).json({ error: "No expenses found for this date range." });
      return;
    }

    // Clean up fields for Excel (if needed)
    const dataForExcel = expenses.map((expense) => ({
      Date: expense.date,
      Amount: expense.amount,
      Details: expense.details,
      Balance: expense.balance,
      Status: expense.amountStatus,
      Difference: expense.amountDifference,
    }));

    // Create Excel workbook
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Expenses");

    // Write workbook to buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Send Excel file
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=daily_expenses_${from}_${to}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to generate and download expenses",
      details: error,
    });
  }
};
