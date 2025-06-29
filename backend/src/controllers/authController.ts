import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import UserModel from '../models/User.js'; // Mongoose User model

// Register
export const register = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existing = await UserModel.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      avatar: '',
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
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
      secure: false, // set to true in production (with HTTPS)
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
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
  } catch (err) {
    res.sendStatus(403);
  }
};

// Logout
export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('refreshToken');
  res.sendStatus(200);
};

// Get current user
export const me = async (req: Request, res: Response): Promise<void> => {
  const auth = req.headers.authorization;
  if (!auth) {
    res.sendStatus(401);
    return;
  }

  const token = auth.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.ACCESS_SECRET!) as { userId: string };
    const user = await UserModel.findById(payload.userId).select('-password');

    if (!user) {
      res.sendStatus(404);
      return;
    }

    res.json(user);
  } catch (err) {
    res.sendStatus(403);
  }
};

// Forgot Password (Mock)
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // TODO: send real email in production
    res.json({ message: 'Password reset link sent to email (mock)' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
