import { Request, Response } from 'express';
import { Wallet } from '../models/wallet.model.js';

// Helper to get/create wallet
const getOrCreateWallet = async () => {
  let wallet = await Wallet.findOne();
  if (!wallet) {
    wallet = new Wallet();
    await wallet.save();
  }
  return wallet;
};

export const getWallet = async (_req: Request, res: Response) => {
  const wallet = await getOrCreateWallet();
  res.json(wallet);
};

export const updateMainWallet = async (req: Request, res: Response) => {
  const wallet = await getOrCreateWallet();
  wallet.MainWallet.balance = req.body.balance;
  await wallet.save();
  res.sendStatus(200);
};

export const updateTempWallet = async (req: Request, res: Response) => {
  const wallet = await getOrCreateWallet();
  wallet.TemporaryWallet.balance += req.body.delta;
  await wallet.save();
  res.sendStatus(200);
};

export const updateSteadyWallet = async (req: Request, res: Response) => {
  const wallet = await getOrCreateWallet();
  Object.assign(wallet.SteadyWallet, req.body);
  await wallet.save();
  res.sendStatus(200);
};

export const updateTotalWealth = async (req: Request, res: Response) => {
  const wallet = await getOrCreateWallet();
  wallet.TotalWealth.amount = req.body.amount;
  await wallet.save();
  res.sendStatus(200);
};

export const updateThreshold = async (req: Request, res: Response) => {
  const wallet = await getOrCreateWallet();
  wallet.threshold = req.body.threshold;
  await wallet.save();
  res.sendStatus(200);
};
