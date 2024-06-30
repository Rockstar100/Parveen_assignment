import React, { useState, useEffect } from 'react';

interface AiButtonProps {
  onClick: () => void;
  isModalOpen: boolean;
}

export const AiButton: React.FC<AiButtonProps> = ({ onClick, isModalOpen }) => {

  return (
    <button
      type="button"
      className="flex items-center px-4 py-2 text-sm transition-all border-none"
      onClick={onClick}
    >
      <img src="https://res.cloudinary.com/dghpjm2df/image/upload/v1719731592/lehnoyjlikcch0guoyly.png" width={15} height={15} alt="Icon" />
    </button>
  );
};
