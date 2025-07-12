// routes/chatbotRoutes.ts
import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { generateResponse } from '../controllers/botController.js';

const router = express.Router();

router.use(requireAuth);

router.post('/chat', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { userMessage, history } = req.body;

    const chatbotResponse = await generateResponse(userMessage, userId, history ?? []);
    res.json({ chatbotResponse });
  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ chatbotResponse: 'Sorry, something went wrong.' });
  }
});

export default router;
