import React from 'react';
import Ai from '../../assets/ai-icon.png';
import Stars from '../../assets/stars.png';

interface AiButtonProps {
  onClick: () => void;
  isModalOpen: boolean;
}

export const AiButton: React.FC<AiButtonProps> = ({ onClick, isModalOpen }) => {
  console.log('isModalOpen:', isModalOpen);

  return (
    <button
      type="button"
      className="flex flex-row items-center px-4 py-2 text-sm transition-all border-none"
      onClick={onClick}
    >
      <img 
        src={isModalOpen ? Stars : Ai} 
        width={isModalOpen ? 20 : 15} 
        height={isModalOpen ? 20 : 15} 
        alt={isModalOpen ? "Stars Icon" : "AI Icon"} 
      />
    </button>
  );
};
