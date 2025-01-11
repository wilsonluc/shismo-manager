import React, { useState } from "react";
import ChevronIcon from "../dropdown/chevronIcon";
import Dropdown from "../dropdown/dropdown";
import { QueueCard } from "./queue";

// Define a form component inside the QueueEditorContainer
const QueueEditorContainer = ({ setCards }: { setCards: React.Dispatch<React.SetStateAction<QueueCard[]>> }) => {
  const [newCardTitle, setNewCardTitle] = useState("");

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return; // Ignore empty titles

    const newCard = {
      title: newCardTitle,
      id: Math.random().toString(36).substr(2, 9), // generate a simple unique ID
      column: "queue",
    };

    // Add the new card to the queue
    setCards((prevCards) => [...prevCards, newCard]);
    setNewCardTitle(""); // Clear input field after adding
  };

  return (
    <Dropdown
      title="Queue Editor"
      icon={<ChevronIcon isOpen={false} />} // Default not open
      content={
        <div className="p-4">
          <input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Queue Task"
            className="w-full p-2 mb-4 border border-neutral-500 rounded"
          />
          <button
            onClick={handleAddCard}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Add to Queue
          </button>
        </div>
      }
    />
  );
};

export default QueueEditorContainer;