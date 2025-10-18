import React from 'react';
import { Message, Sender } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  const wrapperClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-indigo-600 text-white rounded-2xl rounded-br-none'
    : 'bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none';

  // Basic markdown for newlines
  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };
  
  return (
    <div className={wrapperClasses}>
      <div className={`p-3 max-w-xs lg:max-w-md transition-all duration-300 ${bubbleClasses}`}>
        <p className="text-sm whitespace-pre-wrap">{message.text || '...'}</p>
      </div>
    </div>
  );
};

export default MessageBubble;