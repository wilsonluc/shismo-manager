import React, { useState } from "react";
import ChevronIcon from "../dropdown/chevronIcon";
import Dropdown from "../dropdown/dropdown";
import { generateRandomString, Task } from "./queue";
import { getSkillBySkillName, skills } from "./skill";
import { plugins } from "./plugin";
import Image from "next/image";

interface QueueEditorContainerProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  characterName: string;
}

const QueueEditorContainer: React.FC<QueueEditorContainerProps> = ({ setTasks, characterName }) => {
  const [getSkillName, setSkillName] = useState("");
  const [getLevel, setLevel] = useState("");
  const [getDuration, setDuration] = useState("");
  const [getPlugin, setPlugin] = useState("");
  
  const [showSkillIcons, setShowSkillIcons] = useState(false);
  const [showPlugins, setShowPlugins] = useState(false);
  const [showLevelDuration, setShowLevelDuration] = useState(false);

  const handleAddCard = () => {
    // If fields are empty
    if (!getSkillName.trim()) return;
    if (!getPlugin.trim()) return;

    // Validate skill
    const skill = getSkillBySkillName(getSkillName);
    if (!skill) {
      return;
    }

    const newCard: Task = {
      id: generateRandomString(10),
      skill: skill,
      pluginName: getPlugin,
    };

    if (getLevel.trim()) {
      const level = Number.parseInt(getLevel);
      if (!level) {
        // TODO: Handle error
        return;
      }
      newCard.level = level; // Use level if provided
    } else if (getDuration.trim()) {
      const duration = Number.parseInt(getDuration);
      if (isNaN(duration) || duration <= 0) {
        // TODO: Handle error
        return;
      }
      newCard.duration = duration; // Use duration if provided
    } else {
        // TODO: Handle error
    }

    setTasks((prevCards) => [...prevCards, newCard]);
    // Don't need to reset
    // setSkillName("");
    // setLevel("");
    // setPlugin("");
  };

  return (
    <Dropdown
      title="Queue Editor"
      icon={<ChevronIcon isOpen={false} />}
      defaultOpen={true}
      content={
        <div>
          <div className="flex gap-1">
            {/* Skill */}
            <button
              onClick={() => {
                setShowSkillIcons((prev) => !prev);
                setShowPlugins(false);
                setShowLevelDuration(false);
              }} // Toggle the visibility of icons
              className={`w-full p-2 mb-4 border border-neutral-500 rounded h-10 ${
                showSkillIcons
                  ? "bg-blue-500 text-white"
                  : "bg-black text-white"
              }`} // Change button color based on skill selection
            >
              Select Skill
            </button>

            {/* Plugin */}
            <button
              onClick={() => {
                setShowSkillIcons(false);
                setShowPlugins((prev) => !prev);
                setShowLevelDuration(false);
              }} // Toggle the visibility of icons
              className={`w-full p-2 mb-4 border border-neutral-500 rounded h-10 ${
                showPlugins ? "bg-blue-500 text-white" : "bg-black text-white"
              }`} // Change button color based on skill selection
            >
              Select Plugin
            </button>

            {/* Level/Duration */}
            <button
              onClick={() => {
                setShowSkillIcons(false);
                setShowPlugins(false);
                setShowLevelDuration((prev) => !prev);
              }} // Toggle the visibility of icons
              className={`w-full p-2 mb-4 border border-neutral-500 rounded h-10 ${
                showLevelDuration
                  ? "bg-blue-500 text-white"
                  : "bg-black text-white"
              }`} // Change button color based on skill selection
            >
              Level/Duration
            </button>
          </div>

          <div>
            {/* Select Skill */}
            {showSkillIcons && (
              <div className="skill-icons-container grid grid-cols-3 gap-2 mb-4">
                {skills.map((skill) => (
                  <div
                    key={skill.skillName}
                    onClick={() => setSkillName(skill.skillName)}
                    className={`skill-icon cursor-pointer p-2 text-center border border-neutral-300 rounded ${
                      getSkillName === skill.skillName
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                  >
                    <Image
                      src={skill.iconPath}
                      alt={skill.skillName}
                      width={32}
                      height={32}
                      className="mx-auto"
                    />
                    <p>{skill.skillName}</p>{" "}
                  </div>
                ))}
              </div>
            )}

            {/* Select Plugin */}
            {showPlugins && (
              <div className="skill-icons-container grid grid-cols-2 gap-2 mb-4">
                {plugins.map((plugin) => (
                  <div
                    key={plugin}
                    onClick={() => setPlugin(plugin)}
                    className={`skill-icon cursor-pointer p-2 text-center border border-neutral-300 rounded ${
                      getPlugin === plugin ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    <p>{plugin}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Select Level/Duration */}
            {showLevelDuration && (
              <div className="flex flex-col gap-2 mb-4">
                {/* Level Input */}
                <label htmlFor="level" className="text-white">
                  Target Level:
                </label>
                <input
                  id="level"
                  type="number"
                  onKeyDown={(e) => {
                    if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '.') {
                      e.preventDefault();
                    }
                  }}
                  value={getLevel}
                  onChange={(e) => setLevel(e.target.value)}
                  disabled={getDuration !== ""}
                  className="w-full p-2 border border-neutral-500 rounded text-black"
                  placeholder="Enter target level"
                />

                {/* Duration Input (in minutes or hours) */}
                <label htmlFor="duration" className="text-white">
                  Duration (minutes):
                </label>
                <input
                  id="duration"
                  type="number"
                  onKeyDown={(e) => {
                    if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '.') {
                      e.preventDefault();
                    }
                  }}
                  value={getDuration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={getLevel !== ""}
                  className="w-full p-2 border border-neutral-500 rounded text-black"
                  placeholder="Enter duration (minutes)"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleAddCard}
            disabled={characterName === undefined}
            className={`w-full p-2 rounded text-white ${characterName === undefined ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'}`}
          >
            Add to Queue
          </button>
        </div>
      }
    />
  );
};

export default QueueEditorContainer;
