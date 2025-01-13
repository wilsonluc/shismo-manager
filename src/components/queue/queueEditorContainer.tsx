import React, { useState } from "react";
import ChevronIcon from "../dropdown/chevronIcon";
import Dropdown from "../dropdown/dropdown";
import { generateRandomString, Task } from "./queue";
import { getSkillBySkillName, skills } from "./skill";
import { plugins } from "./plugin";
import Image from "next/image";

const QueueEditorContainer = ({
  setTasks,
}: {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) => {
  const [getSkillName, setSkillName] = useState("");
  const [getLevel, setLevel] = useState("");
  const [getPlugin, setPlugin] = useState("");
  const [showSkillIcons, setShowSkillIcons] = useState(false);
  const [showPlugins, setShowPlugins] = useState(false);

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

    setTasks((prevCards) => [...prevCards, newCard]);
    setSkillName("");
    setLevel("");
    setPlugin("");
  };

  return (
    <Dropdown
      title="Queue Editor"
      icon={<ChevronIcon isOpen={false} />}
      content={
        <div>
          <div className="flex gap-1">
            {/* Skill Selector Button */}
            <button
              onClick={() => {
                setShowSkillIcons((prev) => !prev);
                setShowPlugins(false);
              }} // Toggle the visibility of icons
              className={`w-full p-2 mb-4 border border-neutral-500 rounded h-10 ${
                showSkillIcons
                  ? "bg-blue-500 text-white"
                  : "bg-black text-white"
              }`} // Change button color based on skill selection
            >
              Select Skill
            </button>

            {/* Plugin Input */}
            <button
              onClick={() => {
                setShowSkillIcons(false);
                setShowPlugins((prev) => !prev);
              }} // Toggle the visibility of icons
              className={`w-full p-2 mb-4 border border-neutral-500 rounded h-10 ${
                showPlugins ? "bg-blue-500 text-white" : "bg-black text-white"
              }`} // Change button color based on skill selection
            >
              Select Plugin
            </button>

            {/* Level Input */}
            <input
              type="text"
              value={getLevel}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Level"
              className="w-full p-2 mb-4 border border-neutral-500 rounded text-black h-10"
            />
          </div>

          <div className="mb-4">
            {/* Select Skill */}
            {showSkillIcons && (
              <div className="skill-icons-container grid grid-cols-3 gap-2">
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
              <div className="skill-icons-container grid grid-cols-2 gap-2">
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
