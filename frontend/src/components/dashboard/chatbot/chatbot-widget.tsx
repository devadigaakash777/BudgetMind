'use client';

import React from "react";
import ChatBot from "react-chatbotify";
import { useAppDispatch } from "@/redux/hooks";
import { sendChatbotMessage } from "@/redux/thunks/chatbot-thunks";
import { addMessage } from "@/redux/slices/chatbot-slice";
import removeMarkdown from "remove-markdown";

const ChatbotComponent = () => {
  const dispatch = useAppDispatch();

  const settings = {
    general: {
      embedded: true,
      avatar: "🤖",
      name: "MindBot",
    },
    header: {
      show: true,
      avatar: "/assets/smart-pig.avif",
      title: "Piggsy", // 👈 Set your desired bot name here
    },
    chatHistory: {
      storageKey: "chat",
    },
    botBubble: {
      simulateStream: true,
    },
    device: {
      mobileEnabled: true, 
      applyMobileOptimizations: true,
    },
  };

  const styles = {
    bodyStyle: {
      backgroundColor: "#f9f9f9" ,
      height: "72vh", 
      width: "100%",
    },
    botBubbleStyle: {
      backgroundColor: "#e0e0e0",
      color: "#333333",
    },
    userBubbleStyle: {
      backgroundColor: "#007bff", // Bootstrap blue
      color: "#ffffff",
    },
    chatWindowStyle: {
      backgroundColor: "#ffffff",
      height: "72vh", 
      width: "100%",
    },
    chatInputAreaStyle: {
      backgroundColor: "#f1f1f1",
      color: "#000000",
      fontFamily: "Poppins, sans-serif",
    },
  };

  const flow = {
    start: {
      message: removeMarkdown("Hey there! I'm Piggsy. Ask me anything about your money, budget, or goals 💸"),
      path: "loop",
    },
    loop: {
      message: async (params: { userInput: string }) => {
        const userMessage = params.userInput;

        // Add user message to Redux
        dispatch(addMessage({ role: "user", content: userMessage }));

        // Get response from backend
        const response = await dispatch(sendChatbotMessage({ userMessage })).unwrap();

        // Add bot response to Redux
        dispatch(addMessage({ role: "assistant", content: response }));

        return removeMarkdown(response);
      },
      path: "loop",
    },
  };

  return (
    <ChatBot
      settings={settings}
      styles={styles}
      flow={flow}
    />
  );
};

export default ChatbotComponent;
