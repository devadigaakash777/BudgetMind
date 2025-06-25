const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');

// In-memory user store for example purposes
const users = [];

exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const existing = users.find((u) => u.email === email);
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: users.length + 1 + '',
    name: `${firstName} ${lastName}`,
    email,
    password: hashedPassword,
    avatar: '/assets/avatar.png',
  };
  users.push(user);
  return res.status(201).json({ message: 'User registered' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid email or password' });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.json({ accessToken, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
};

exports.refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, process.env.REFRESH_SECRET);
    const accessToken = generateAccessToken(payload.userId);
    return res.json({ accessToken });
  } catch {
    return res.sendStatus(403);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};

exports.me = (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.ACCESS_SECRET);
    const user = users.find((u) => u.id === payload.userId);
    if (!user) return res.sendStatus(404);
    return res.json({ id: user.id, name: user.name, email: user.email, avatar: user.avatar });
  } catch {
    return res.sendStatus(403);
  }
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Placeholder logic — send email here in real app
  return res.json({ message: 'Password reset link sent to email (mock)' });
};
