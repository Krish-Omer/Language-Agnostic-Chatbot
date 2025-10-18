import React from 'react';
import { ChatIcon, CloseIcon } from './icons';

interface LauncherProps {
  isOpen: boolean;
  onClick: () => void;
}

const Launcher: React.FC<LauncherProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 sm:right-8 w-16 h-16 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform duration-200 ease-in-out transform hover:scale-110 z-50 flex items-center justify-center"
      aria-label={isOpen ? 'Close Chat' : 'Open Chat'}
    >
      <div className="relative w-8 h-8">
        <ChatIcon className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${isOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`} />
        <CloseIcon className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
      </div>
    </button>
  );
};

export default Launcher;