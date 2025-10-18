import { GoogleGenAI, Chat } from "@google/genai";
import { Language } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

let chat: Chat | null = null;

function getChatInstance(language: Language): Chat {
  if (!chat) {
    chat = ai.chats.create({
      model,
      config: {
        systemInstruction: `You are a helpful and friendly AI assistant for MNNIT Allahabad, a premier technical institution in India.
        Your purpose is to assist students by answering their questions about admissions, fee deadlines, scholarships, timetables, campus facilities, and other college-related queries.
        You should base your answers on publicly available information from the official MNNIT website (mnnit.ac.in).
        You must be polite, accurate, and concise.
        You must respond ONLY in ${language.name} (${language.code}).`,
      },
    });
  }
  return chat;
}

// Function to reset the chat session, e.g., when language changes
export function resetChatSession() {
  chat = null;
}

export async function* streamChatResponse(message: string, language: Language): AsyncGenerator<string> {
  try {
    const currentChat = getChatInstance(language);
    
    // Although the system instruction sets the language, reinforcing it in the prompt can improve reliability.
    const userPrompt = `Respond in ${language.name}. User question: "${message}"`;

    const stream = await currentChat.sendMessageStream({ message: userPrompt });

    for await (const chunk of stream) {
      const chunkText = chunk.text;
      if (chunkText) {
        yield chunkText;
      }
    }
  } catch (error) {
    console.error("Error streaming response from Gemini:", error);
    yield "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
}