import React, { useState } from "react";
import ChevronIcon from "../dropdown/chevronIcon";
import Dropdown from "../dropdown/dropdown";
import { getSkillBySkillName, skillNames } from "./skill";
import { Task } from "../../app/page";

function getLargestID(tasks: Task[]): string {
  // console.log(tasks);
  if (tasks.length === 0) {
    return "0";
  }
  return (
    Math.max(...tasks.map((task) => parseInt(task.id, 10))) + 1
  ).toString();
}

interface QueueEditorContainerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  characterName: string | undefined;
  plugins: string[];
}

const QueueEditorContainer: React.FC<QueueEditorContainerProps> = ({
  tasks,
  setTasks,
  characterName,
  plugins,
}) => {
  const [getSkillName, setSkillName] = useState("");
  const [getLevel, setLevel] = useState("");
  const [getDuration, setDuration] = useState("");
  const [getPlugin, setPlugin] = useState("");

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
      id: getLargestID(tasks),
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
  };

  return (
    <Dropdown
      title="Queue Editor"
      icon={<ChevronIcon isOpen={false} />}
      defaultOpen={true}
      content={
        <div>
          <div className="flex gap-1">
            {/* Plugin */}
            <button
              onClick={() => {
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
                setShowPlugins(false);
                setShowLevelDuration((prev) => !prev);
              }} // Toggle the visibility of icons
              className={`w-full p-2 mb-4 border border-neutral-500 rounded h-10 ${
                showLevelDuration
                  ? "bg-blue-500 text-white"
                  : "bg-black text-white"
              }`} // Change button color based on skill selection
            >
              Level / Duration
            </button>
          </div>

          <div>
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
                <div className="flex gap-1">
                  {/* Target Level Input */}
                  <div className="flex-1">
                    <label htmlFor="level" className="text-white">
                      Target Level:
                    </label>
                    <input
                      id="level"
                      type="number"
                      onKeyDown={(e) => {
                        if (
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "-" ||
                          e.key === "."
                        ) {
                          e.preventDefault();
                        }
                      }}
                      value={getLevel}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (Number(value) >= 1 || value === "") {
                          setLevel(value); // Only set the value if it's greater than or equal to 1
                        }
                      }}
                      disabled={getDuration !== ""}
                      className="w-full p-2 border border-neutral-500 rounded text-black h-[2.5rem]"
                      placeholder="Enter target level"
                    />
                  </div>

                  {/* Skill Dropdown */}
                  <div className="flex-1">
                    <label htmlFor="skill" className="text-white">
                      Select Skill:
                    </label>
                    <select
                      id="skill"
                      value={getSkillName}
                      onChange={(e) => setSkillName(e.target.value)}
                      disabled={getDuration !== ""}
                      className="w-full p-2 border border-neutral-500 rounded text-black h-[2.5rem]"
                    >
                      <option value="">--Select Skill--</option>
                      {skillNames.map((skill) => (
                        <option key={skill} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Duration Input */}
                <div className="flex-1">
                  <label htmlFor="duration" className="text-white">
                    Duration (minutes):
                  </label>
                  <input
                    id="duration"
                    type="number"
                    onKeyDown={(e) => {
                      if (
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-" ||
                        e.key === "."
                      ) {
                        e.preventDefault();
                      }
                    }}
                    value={getDuration}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (Number(value) >= 1 || value === "") {
                        setDuration(value); // Only set the value if it's greater than or equal to 1
                      }
                    }}
                    disabled={getLevel !== ""}
                    className="w-full p-2 border border-neutral-500 rounded text-black"
                    placeholder="Enter duration (minutes)"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAddCard}
            disabled={characterName === undefined}
            className={`w-full p-2 rounded text-white ${
              characterName === undefined
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500"
            }`}
          >
            Add to Queue
          </button>
        </div>
      }
    />
  );
};

export default QueueEditorContainer;
