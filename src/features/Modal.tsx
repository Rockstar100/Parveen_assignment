import React, { useState } from 'react';


interface ModalProps {
  onClose: () => void;
  onInsert: () => void;
}

interface ChatMessage {
  id: number;
  text: string;
  from: 'user' | 'system';
}

export const Modal: React.FC<ModalProps> = ({ onClose, onInsert }) => {
  const [prompt, setPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const handleGenerate = () => {
    if (prompt.trim()) {
      const userMessage: ChatMessage = {
        id: chatMessages.length + 1,
        text: prompt,
        from: 'user'
      };

      const systemMessage: ChatMessage = {
        id: chatMessages.length + 2,
        text: "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.",
        from: 'system'
      };

      setChatMessages([...chatMessages, userMessage, systemMessage]);
      setPrompt('');
    }
  };

  const handleInsert = () => {
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage && lastMessage.from === 'system') {
      const messageBox = document.querySelector('.msg-form__contenteditable[contenteditable="true"]');
      if (messageBox) {
        messageBox.innerHTML = `<p>${lastMessage.text}</p>`; // Insert plain text within paragraph tags
        // Remove placeholder
        const placeholder = messageBox.nextElementSibling;
        if (placeholder && placeholder.classList.contains('msg-form__placeholder')) {
          placeholder.remove();
        }

        // Trigger input and keydown events
        const inputEvent = new Event('input', { bubbles: true });
        const keydownEvent = new KeyboardEvent('keydown', { bubbles: true, key: ' ' });

        messageBox.dispatchEvent(inputEvent);
        messageBox.dispatchEvent(keydownEvent);

        console.log('System message inserted:', lastMessage.text);
        onInsert();
      } else {
        console.error('LinkedIn message box not found');
      }
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isSystemMessagePresent = chatMessages.some(msg => msg.from === 'system');

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white w-[40vw] max-w-md p-5 rounded-lg shadow-lg flex flex-col relative">
        <div className="flex-grow overflow-y-auto mb-4">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded-lg max-w-[69%] break-words ${
                msg.from === 'user' ? 'bg-blue-100 self-end left-5 ml-[100px]' : 'bg-gray-100 self-start text-left'
              }`}
              style={{ minWidth: '50px' }}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          value={prompt}
          placeholder="Your Prompt"
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex space-x-1 justify-end w-full">
          {!isSystemMessagePresent ? (
            <button
              onClick={handleGenerate}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded"
            >
              <img src="https://res.cloudinary.com/dghpjm2df/image/upload/v1719731592/tfnaqsisnwm84vg4njfw.png" width={10} height={10} alt="Send" className="mr-2" />
              Generate
            </button>
          ) : (
            <div className="flex space-x-2 justify-end w-full">
              <button
                onClick={handleInsert}
                className="flex items-center px-4 py-2 border border-black text-black rounded"
              >
                <img src="https://res.cloudinary.com/dghpjm2df/image/upload/v1719731592/rimjvax5hmblovhy4vgx.png" width={12} height={12} alt="Insert" className="mr-2" />
                Insert
              </button>
              <button
                onClick={() => {}}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded"
                disabled
              >
                <img src='https://res.cloudinary.com/dghpjm2df/image/upload/v1719731592/xdajndtqpsaoqzs9uzeb.png' width={10} height={10} alt="Regenerate" className="mr-2" />
                Regenerate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
