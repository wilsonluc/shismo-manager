import React, { useState } from "react";
import ChevronIcon from "../dropdown/chevronIcon";
import Dropdown from "../dropdown/dropdown";
import { generateRandomString, getSkillBySkillName, Task } from "./queue";

// Define a form component inside the QueueEditorContainer
const QueueEditorContainer = ({
  setTasks,
}: {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) => {
  const [getSkillName, setSkillName] = useState("");
  const [getLevel, setLevel] = useState("");
  // const [getDuration, setDuration] = useState("");
  const [getPlugin, setPlugin] = useState("");

  const handleAddCard = () => {
    // If fields are empty
    if (!getSkillName.trim()) return;
    // if (!getLevel.trim() && !getDuration.trim()) return;
    if (!getLevel.trim()) return;
    if (!getPlugin.trim()) return;

    // Validate skill
    const skill = getSkillBySkillName(getSkillName);
    if (!skill) {
      return;
    }

    // Validate level & duration
    const level = Number.parseInt(getLevel);
    if (!level) {
      return;
    }

    const newCard: Task = {
      id: generateRandomString(10),
      skill: skill,
      level: level,
      pluginName: getPlugin,
    };

    // Add the new card to the queue
    setTasks((prevCards) => [...prevCards, newCard]);
    setSkillName(""); // Clear input field after adding
    setLevel(""); // Clear input field after adding
    setPlugin(""); // Clear input field after adding
  };

  return (
    <Dropdown
      title="Queue Editor"
      icon={<ChevronIcon isOpen={false} />} // Default not open
      content={
        <div className="p-4">
          <input
            type="text"
            value={getSkillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="Skill"
            className="w-full p-2 mb-4 border border-neutral-500 rounded text-black"
          />
          <input
            type="text"
            value={getLevel}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="Level"
            className="w-full p-2 mb-4 border border-neutral-500 rounded text-black"
          />
          <input
            type="text"
            value={getPlugin}
            onChange={(e) => setPlugin(e.target.value)}
            placeholder="Plugin"
            className="w-full p-2 mb-4 border border-neutral-500 rounded text-black"
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
