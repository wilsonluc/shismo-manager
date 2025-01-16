// src/components/Dropdown.tsx

import React, { useState } from "react";

interface DropdownProps {
  title: string;
  content: React.ReactNode; // Content can be anything (text, components, etc.)
  icon: React.ReactNode; // Icon that will rotate on toggle
  buttons?: Button[];
}

interface Button {
  label: string;
  onClick: () => void; // The onClick function
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  content,
  icon,
  buttons,
}) => {
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
                isOpen ? "rotate-90" : ""
              }`}
            >
              {icon}
            </div>
          </button>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {buttons && (
            <div className="flex gap-2 pl-2">
              {buttons.map((button, index) => (
                <button
                  key={index}
                  onClick={button.onClick} // Attach the onClick event handler
                  className="px-4 py-1 bg-blue-500 text-white rounded"
                >
                  {button.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 bg-muted text-muted-foreground">{content}</div>
      )}
    </div>
  );
};

export default Dropdown;
