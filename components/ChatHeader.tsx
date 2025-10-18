import React from 'react';
import { Language } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants';
import { CloseIcon, UniversityIcon } from './icons';

interface ChatHeaderProps {
  onClose: () => void;
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, selectedLanguage, onLanguageChange }) => {
  return (
    <div className="bg-indigo-600 text-white p-4 flex items-center justify-between flex-shrink-0 shadow-md">
      <div className="flex items-center space-x-3">
         <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <UniversityIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg">MNNIT Allahabad</h2>
          <p className="text-xs opacity-80">AI Assistant</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <select
          value={selectedLanguage.code}
          onChange={(e) => {
            const newLang = SUPPORTED_LANGUAGES.find(l => l.code === e.target.value);
            if (newLang) onLanguageChange(newLang);
          }}
          className="bg-indigo-700 border border-indigo-500 rounded-md text-sm p-1 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <button onClick={onClose} className="hover:bg-indigo-700 rounded-full p-2" aria-label="Close chat">
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;