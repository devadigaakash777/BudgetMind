'use client';

import dynamic from 'next/dynamic';

// Dynamically import ChatbotFab only on the client side
const ChatbotFab = dynamic(() => import('./chatbot-fab'), { ssr: false });

export default function ChatbotFabWrapper() {
  return <ChatbotFab />;
}
