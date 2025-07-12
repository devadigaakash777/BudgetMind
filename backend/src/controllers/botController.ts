import { contextCache, getUserContext, globalAppTerms } from "../services/chatbot.service.js";

const OPEN_ROUTER_API_KEY = process.env.OPEN_ROUTER_API_KEY

export const generateResponse = async (
  userMessage: string,
  userId: string,
  conversationHistory: any[] = []
): Promise<string> => {
  let systemPrompt = contextCache.get<string>(`prompt:${userId}`);

  // Cache miss — generate and cache
  if (!systemPrompt) {
    const userContext = await getUserContext(userId);
    systemPrompt = `You are a helpful assistant in a budgeting app.\n${globalAppTerms}\n${userContext}`;
    contextCache.set(`prompt:${userId}`, systemPrompt);
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPEN_ROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-chat',
      messages
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
};
