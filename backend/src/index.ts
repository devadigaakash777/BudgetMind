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
import chatbotRoutes from './routes/chatbotRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:3000',             // for local development
    'https://budgetmind.onrender.com',   // for production frontend
  ],
  credentials: true,
}));

app.use('/api', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/expense', dailyExpenseRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.get('/time', (req, res) => {
  const now = new Date();
  res.send(`Server time: ${now}`);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
