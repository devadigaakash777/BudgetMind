import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
}

const users: User[] = [];

// Register
export const register = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password }: 
    { firstName: string; lastName: string; email: string; password: string } = req.body;

  const existing = users.find((u) => u.email === email);
  if (existing) {
    res.status(400).json({ message: 'Email already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user: User = {
    id: (users.length + 1).toString(),
    name: `${firstName} ${lastName}`,
    email,
    password: hashedPassword,
    avatar: '/assets/avatar.png',
  };

  users.push(user);
  res.status(201).json({ message: 'User registered' });
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

// Refresh Token
export const refresh = (req: Request, res: Response): void => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.REFRESH_SECRET!) as { userId: string };
    const accessToken = generateAccessToken(payload.userId);
    res.json({ accessToken });
  } catch {
    res.sendStatus(403);
  }
};

// Logout
export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('refreshToken');
  res.sendStatus(200);
};

// Get current user
export const me = (req: Request, res: Response): void => {
  const auth = req.headers.authorization;
  if (!auth) {
    res.sendStatus(401);
    return;
  }

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.ACCESS_SECRET!) as { userId: string };
    const user = users.find((u) => u.id === payload.userId);
    if (!user) {
      res.sendStatus(404);
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch {
    res.sendStatus(403);
  }
};

// Forgot Password
export const forgotPassword = (req: Request, res: Response): void => {
  const { email }: { email: string } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.json({ message: 'Password reset link sent to email (mock)' });
};
