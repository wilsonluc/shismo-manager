// src/components/ChevronIcon.tsx

import React from 'react';

interface ChevronIconProps {
  isOpen: boolean;
  size?: number; // Optional prop to set the size of the icon (default: 24)
}

const ChevronIcon: React.FC<ChevronIconProps> = ({ isOpen, size = 24 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-chevron-right transform transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
    >
      <path d="m9 18 6-6-6-6"></path>
    </svg>
  );
};

export default ChevronIcon;
