import React, { useState } from 'react';
import ChatWidget from './components/ChatWidget';
import Launcher from './components/Launcher';

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="antialiased">
      <div className={`fixed bottom-20 right-5 sm:right-8 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <ChatWidget onClose={() => setIsOpen(false)} />
      </div>
      <Launcher isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
    </div>
  );
};

export default App;
