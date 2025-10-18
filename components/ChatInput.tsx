import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, MicIcon } from './icons';

// Fix: Add types for SpeechRecognition API to the window object to resolve TypeScript errors.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

// Check for SpeechRecognition API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
}


const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!recognition) return;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setText(transcript);
    };
  }, []);

  const handleMicClick = () => {
    if (!recognition) {
        alert("Speech recognition is not supported in your browser.");
        return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  useEffect(() => {
    const textarea = textInputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="p-3 bg-white border-t border-gray-200 flex-shrink-0">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <button 
            type="button" 
            onClick={handleMicClick}
            disabled={isLoading}
            className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isListening ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} disabled:opacity-50`}
            aria-label="Use microphone"
        >
          <MicIcon className="w-5 h-5" />
        </button>
        <textarea
          ref={textInputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 max-h-24"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;