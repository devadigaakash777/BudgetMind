import { Response } from "express";
import { AuthRequest } from '../middleware/authMiddleware.js';
import FeedbackModel, { IFeedback } from "../models/feedback.model.js";
import sendEmail from "../utils/sendEmail.js";

export const submitFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, feedbackType, message, rating } = req.body;

  try {
    const feedback: IFeedback = new FeedbackModel({
      userId: req.userId!,
      name,
      email,
      feedbackType,
      message,
      rating,
    });

    await feedback.save();

    // Send admin notification email
    await sendEmail(
      process.env.EMAIL_USER!,
      `New Feedback (${feedbackType})`,
      `
      <h3>New Feedback Submitted</h3>
      <p><b>Name:</b> ${name || "Anonymous"}</p>
      <p><b>Email:</b> ${email || "Not Provided"}</p>
      <p><b>Type:</b> ${feedbackType}</p>
      <p><b>Rating:</b> ${rating ?? "Not Rated"} ⭐</p>
      <p><b>Message:</b> ${message}</p>
      `
    );

    // Optional: Send confirmation email to user
    if (email) {
      await sendEmail(
        email,
        "Thank you for your feedback!",
        `
        <h3>Hello ${name || "there"},</h3>
        <p>We’ve received your feedback and appreciate you sharing your thoughts!</p>
        <blockquote>${message}</blockquote>
        <p>— The BudgetMind Team</p>
        `
      );
    }

    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit feedback." });
  }
};
