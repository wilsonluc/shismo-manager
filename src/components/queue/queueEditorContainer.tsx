import React, { useState, useEffect } from "react";
import ChevronIcon from "../dropdown/chevronIcon";
import Dropdown from "../dropdown/dropdown";
import { generateRandomString, Task } from "./queue";
import { getSkillBySkillName, skills } from "./skill";
import { getAssociatedPlugins } from "./plugin"; // Make sure to import this function

// Define a form component inside the QueueEditorContainer
const QueueEditorContainer = ({
  setTasks,
}: {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) => {
  const [getSkillName, setSkillName] = useState("");
  const [getLevel, setLevel] = useState("");
  const [getPlugin, setPlugin] = useState("");
  const [associatedPlugins, setAssociatedPlugins] = useState<string[]>([]);

  useEffect(() => {
    // Fetch associated plugins whenever the selected skill changes
    if (getSkillName) {
      const skill = getSkillBySkillName(getSkillName);
      if (skill) {
        const pluginsForSkill = getAssociatedPlugins(skill); // Get plugins based on selected skill
        setAssociatedPlugins(
          pluginsForSkill.map((plugin) => plugin.pluginName)
        );
      }
    } else {
      setAssociatedPlugins([]); // Reset plugin options if no skill is selected
    }
  }, [getSkillName]);

  const handleAddCard = () => {
    // If fields are empty
    if (!getSkillName.trim()) return;
    if (!getLevel.trim()) return;
    if (!getPlugin.trim()) return;

    // Validate skill
    const skill = getSkillBySkillName(getSkillName);
    if (!skill) {
      return;
    }

    // Validate level
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
        <div>
          <div className="flex">
            {/*Skill*/}
            <select
              value={getSkillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="w-[25%] p-2 mb-4 border border-neutral-500 rounded text-black h-10"
            >
              <option value="">Skill</option>
              {skills.map((skill) => (
                <option key={skill.skillName} value={skill.skillName}>
                  {skill.skillName}
                </option>
              ))}
            </select>

            {/*Level*/}
            <input
              type="text"
              value={getLevel}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Level"
              className="w-[20%] p-2 mb-4 border border-neutral-500 rounded text-black h-10"
            />

            {/*Plugin*/}
            <select
              value={getPlugin}
              onChange={(e) => setPlugin(e.target.value)}
              className="w-[55%] p-2 mb-4 border border-neutral-500 rounded text-black h-10"
              disabled={associatedPlugins.length === 0}
            >
              <option value="">Plugin</option>
              {associatedPlugins.map((pluginName) => (
                <option key={pluginName} value={pluginName}>
                  {pluginName}
                </option>
              ))}
            </select>
          </div>

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
// TODO: Drag functionality doesn't work on mobile
