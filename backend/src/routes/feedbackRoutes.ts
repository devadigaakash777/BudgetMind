import express from "express";
import { submitFeedback } from "../controllers/feedbackController.js";
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

// POST /api/feedback
router.post("/", submitFeedback);

export default router;
