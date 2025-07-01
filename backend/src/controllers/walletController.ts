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

export const updateThreshold = async (req: AuthRequest, res: Response) => {
  const wallet = await getOrCreateWallet(req.userId!);
  wallet.threshold = req.body.threshold;
  await wallet.save();
  res.sendStatus(200);
};
