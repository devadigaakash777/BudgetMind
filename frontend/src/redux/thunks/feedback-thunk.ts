import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios-instance";

const API_URL = "/feedback"; // Assuming your backend route is /api/feedback

interface FeedbackPayload {
  feedbackType: string;
  name?: string;
  email?: string;
  message: string;
  rating: number;
}

export const submitFeedbackThunk = createAsyncThunk(
  "feedback/submitFeedback",
  async (feedback: FeedbackPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}`, feedback);
      console.debug("Feedback submitted successfully", response.status);
      return response.data;
    } catch {
      console.error("Failed to submit feedback");
      return rejectWithValue("Failed to submit feedback");
    }
  }
);
