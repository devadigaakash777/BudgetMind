import { Request, Response } from 'express';
import { Wallet } from '../models/wallet.model.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// Helper: Get or create wallet for specific user
const getOrCreateWallet = async (userId: string) => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = new Wallet({ userId });
    await wallet.save();
  }
  return wallet;
};

export const getWallet = async (req: AuthRequest, res: Response) => {
  const wallet = await getOrCreateWallet(req.userId!);
  res.json(wallet); 
};

export const updateMainWallet = async (req: AuthRequest, res: Response) => {
  const wallet = await getOrCreateWallet(req.userId!);
  wallet.MainWallet.balance = req.body.balance;
  await wallet.save();
  res.sendStatus(200);
};

export const updateTempWallet = async (req: AuthRequest, res: Response) => {
  const wallet = await getOrCreateWallet(req.userId!);
  wallet.TemporaryWallet.balance += req.body.delta;
  await wallet.save();
  res.sendStatus(200);
};

export const updateSteadyWallet = async (req: AuthRequest, res: Response) => {
  const wallet = await getOrCreateWallet(req.userId!);
  Object.assign(wallet.SteadyWallet, req.body);
  await wallet.save();
  res.sendStatus(200);
};

export const updateTotalWealth = async (req: AuthRequest, res: Response) => {
  const wallet = await getOrCreateWallet(req.userId!);
  wallet.TotalWealth.amount = req.body.amount;
  await wallet.save();
  res.sendStatus(200);
};

export const updateThreshold = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const threshold = req.body.threshold;
    if (typeof threshold !== 'number' || threshold < 0) {
      res.status(400).json({ error: "Invalid threshold value" });
      return;
    }

    const wallet = await getOrCreateWallet(req.userId!);
    const prevThreshold = wallet.threshold;
    const mainBal = wallet.MainWallet.balance;
    const tempBal = wallet.TemporaryWallet.balance;

    // Update threshold
    wallet.threshold = threshold;

    if (threshold < mainBal) {
      // Threshold decreased – move extra to temp wallet
      const surplus = mainBal - threshold;
      wallet.MainWallet.balance = threshold;
      wallet.TemporaryWallet.balance += surplus;

    } else if (threshold > mainBal) {
      // Threshold increased – only proceed if MainWallet == previous threshold
      const needed = threshold - mainBal;
      if (tempBal >= needed) {
        wallet.MainWallet.balance += needed;
        wallet.TemporaryWallet.balance -= needed;
      } // else ignore (not enough funds in temp)
    }

    await wallet.save();
    res.sendStatus(200);
  } catch (err) {
    console.error("Error updating threshold:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

