// src/redux/slices/chatbotSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotState {
  history: ChatMessage[];
}

const initialState: ChatbotState = {
  history: [],
};

export const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.history.push(action.payload);
    },
    resetHistory: (state) => {
      state.history = [];
    },
  },
});

export const { addMessage, resetHistory } = chatbotSlice.actions;
export default chatbotSlice.reducer;
