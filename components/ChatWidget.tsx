import React, { useState, useEffect, useCallback } from 'react';
import { Message, Sender, Language } from '../types';
import { streamChatResponse, resetChatSession } from '../services/geminiService';
import { SUPPORTED_LANGUAGES } from '../constants';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

interface ChatWidgetProps {
  onClose: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      text: 'Hello! How can I help you today?',
      sender: Sender.Bot,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);

  useEffect(() => {
    resetChatSession();
    setMessages([
        {
          id: 'initial-lang-change',
          text: `Welcome to the MNNIT Allahabad AI Assistant! How can I assist you in ${selectedLanguage.name}?`,
          sender: Sender.Bot,
        },
      ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: Sender.User,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: botMessageId, text: '', sender: Sender.Bot },
    ]);

    try {
      let fullResponse = '';
      const responseStream = streamChatResponse(text, selectedLanguage);

      for await (const chunk of responseStream) {
        fullResponse += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: fullResponse } : msg
          )
        );
      }
    } catch (error) {
      console.error("Failed to get response:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, text: "Sorry, an error occurred." } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedLanguage]);

  return (
    <div className="w-[calc(100vw-40px)] h-[70vh] max-w-md max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      <ChatHeader
        onClose={onClose}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatWidget;