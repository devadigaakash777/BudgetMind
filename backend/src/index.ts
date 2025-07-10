import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import dailyExpenseRoutes from './routes/dailyExpenseRoutes.js';
import connectDB from './config/db.js';
import './cron/midnightJob.js'

import { finalizeSalary } from "./services/profile.service.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use('/api', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/expense', dailyExpenseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
