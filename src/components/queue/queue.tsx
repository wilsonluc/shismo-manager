import { useState } from "react";
import QueueEditorContainer from "./queueEditorContainer";
import { getSkillBySkillName, Skill } from "./skill";
import GridExample from "./gridExample";

const Queue = () => {
  // State for cards
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_CARDS);

  return (
    <div>
      <GridExample tasks={tasks} />
      <QueueEditorContainer setTasks={setTasks} />
    </div>
  );
};

export interface Task {
  id: string;
  skill: Skill;
  level?: number;
  duration?: number; // Minutes
  pluginName: string;
}

export const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const DEFAULT_CARDS: Task[] = [
  {
    skill: getSkillBySkillName("Woodcutting"),
    level: 30,
    pluginName: "Skiller",
    id: generateRandomString(10),
  },
  {
    skill: getSkillBySkillName("Crafting"),
    level: 50,
    pluginName: "Bank Skiller",
    id: generateRandomString(10),
  },
  {
    skill: getSkillBySkillName("Hunter"),
    level: 70,
    pluginName: "Hunters' Rumours",
    id: generateRandomString(10),
  },
  {
    skill: getSkillBySkillName("Slayer"),
    level: 90,
    pluginName: "Slayer",
    id: generateRandomString(10),
  },
];

export default Queue;
