// src/components/Dropdown.tsx

import React, { useState } from 'react';

interface DropdownProps {
  title: string;
  content: React.ReactNode; // Content can be anything (text, components, etc.)
  icon: React.ReactNode; // Icon that will rotate on toggle
}

const Dropdown: React.FC<DropdownProps> = ({ title, content, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border mb-4 overflow-hidden">
      <div className="border-b border-border">
        <div className="flex items-center gap-2 p-4">
          <button
            className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
            onClick={toggleDropdown}
          >
            <div
              className={`transform transition-transform duration-300 ${
                isOpen ? 'rotate-90' : ''
              }`}
            >
              {icon}
            </div>
          </button>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
        </div>
      </div>

      {isOpen && <div className="p-4 bg-muted text-muted-foreground">{content}</div>}
    </div>
  );
};

export default Dropdown;
