import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import UserModel from '../models/User.js'; 
import sendEmail from '../utils/sendEmail.js';

const EMAIL_SECRET = process.env.EMAIL_SECRET || "email-secret-key";

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
      isVerified: false, // 👈 mark as unverified
    });

    await newUser.save();

    // ✅ Generate email verification token
    const emailToken = jwt.sign(
      { userId: newUser.id },
      EMAIL_SECRET,
      { expiresIn: '1h' } // valid for 1 hour
    );

    const verificationLink = `${process.env.BACKEND_URL}/verify-email/${emailToken}`;

    // ✅ Send verification email
    await sendEmail(
      newUser.email,
      'Verify Your Email',
      `<h3>Hi ${newUser.firstName},</h3>
       <p>Click the link below to verify your email address:</p>
       <a href="${verificationLink}">click to verify</a>
       <p>This link expires in 1 hour.</p>`
    );

    res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
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

    if (!user.isVerified) {
      res.status(403).json({ message: 'Please verify your email before logging in.' });
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
      secure: process.env.NODE_ENV === 'production', // set to true in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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

// Forgot Password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const resetToken = jwt.sign(
      { userId: user.id },
      EMAIL_SECRET,
      { expiresIn: '15m' }
    );

    const resetLink = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      'Reset Your Password',
      `<p>Click the link below to reset your password:</p>
       <a href="${resetLink}">click here</a>
       <p>This link expires in 15 minutes.</p>`
    );

    res.json({ message: 'Password reset link sent to email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, EMAIL_SECRET) as { userId: string };

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // ✅ Issue new tokens and log in user automatically
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: 'Password reset successful. You are now logged in.',
      accessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired reset token.' });
  }
};


// Verify Email
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, EMAIL_SECRET) as { userId: string };

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      res.status(404).send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1>❌ Verification Failed</h1>
            <p>User not found.</p>
            <a href="${process.env.CLIENT_URL}" style="color: blue;">Go back to website</a>
          </body>
        </html>
      `);
      return;
    }

    if (user.isVerified) {
      res.send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1>✅ Email Already Verified</h1>
            <p>You can now log in to your account.</p>
            <a href="${process.env.CLIENT_URL}" style="color: blue;">Go back to website</a>
          </body>
        </html>
      `);
      return;
    }

    user.isVerified = true;
    await user.save();

    res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          <h1>✅ Email Verified Successfully</h1>
          <p>You can now log in to your account.</p>
          <a href="${process.env.CLIENT_URL}" style="color: blue;">Go back to website</a>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error(err);
    if (err.name === "TokenExpiredError") {
      res.status(400).send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1>⏳ Verification Link Expired</h1>
            <p>Please request a new verification email.</p>
            <a href="${process.env.CLIENT_URL}" style="color: blue;">Go back to website</a>
          </body>
        </html>
      `);
    } else {
      res.status(400).send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1>❌ Invalid Verification Link</h1>
            <p>The link you clicked is invalid or broken.</p>
            <a href="${process.env.CLIENT_URL}" style="color: blue;">Go back to website</a>
          </body>
        </html>
      `);
    }
  }
};

// Resend Email
export const resendVerification = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: 'Email is already verified' });
      return;
    }

    const emailToken = jwt.sign(
      { userId: user.id },
      EMAIL_SECRET,
      { expiresIn: '1h' }
    );

    const verificationLink = `${process.env.BACKEND_URL}/verify-email/${emailToken}`;

    await sendEmail(
      user.email,
      'Verify Your Email (Resent)',
      `<h3>Hi ${user.firstName},</h3>
       <p>You requested a new verification link:</p>
       <a href="${verificationLink}">Click here to verify</a>
       <p>This link expires in 1 hour.</p>`
    );

    res.json({ message: 'Verification email resent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
