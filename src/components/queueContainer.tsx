"use client";

import React, { useState } from "react";

const QueueContainer = () => {
  // Drop open/closed state tracker
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`lucide lucide-chevron-right w-4 h-4 transform transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} // Add the rotate class when isOpen
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
          <h2 className="text-base font-semibold text-foreground">Scheduled Queue</h2>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 bg-muted text-muted-foreground">
          {/* Your dropdown content goes here */}
          <p>This is the dropdown content!</p>
        </div>
      )}
    </div>
  );
};

export default QueueContainer;
