// src/redux/thunks/chatbot-thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axiosInstance";
import { RootState } from "../store";

const BASE_URL = 'http://localhost:5000/api';

export const sendChatbotMessage = createAsyncThunk<
  string,
  { userMessage: string },
  { state: RootState }
>(
  "chatbot/sendMessage",
  async ({ userMessage }, { getState }) => {
    const history = getState().chatbot.history;
    const res = await axios.post<{ chatbotResponse: string }>(
      `${BASE_URL}/chatbot/chat`,
      { userMessage, history },
    );
    return res.data.chatbotResponse;
  }
);
