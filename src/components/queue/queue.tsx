import { useState } from "react";
import QueueContainer from "./queueContainer";
import QueueEditorContainer from "./queueEditorContainer";

const Queue = () => {
  // State for cards
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_CARDS);

  return (
    <div>
      <QueueContainer tasks={tasks} setTasks={setTasks} />
      <QueueEditorContainer setTasks={setTasks} />
    </div>
  );
};

// TODO: MOVE QUEUE TO SEPARATE CLASS

export interface Skill {
  skillName: string;
  iconPath: string;
}

export interface Task {
  id: string;
  skill?: Skill;
  level?: number;
  duration?: Date;
  pluginName: string;
}

const generateSkill = (name: string): Skill => {
  return {
    skillName: name,
    iconPath: `/assets/skills/${name.toLowerCase()}.svg`,
  };
};

const skills: Skill[] = [
  generateSkill("Agility"),
  generateSkill("Attack"),
  generateSkill("Construction"),
  generateSkill("Cooking"),
  generateSkill("Crafting"),
  generateSkill("Defence"),
  generateSkill("Firemaking"),
  generateSkill("Fishing"),
  generateSkill("Fletching"),
  generateSkill("Herblore"),
  generateSkill("Hitpoints"),
  generateSkill("Hunter"),
  generateSkill("Magic"),
  generateSkill("Mining"),
  generateSkill("Prayer"),
  generateSkill("Ranged"),
  generateSkill("Runecrafting"),
  generateSkill("Slayer"),
  generateSkill("Smithing"),
  generateSkill("Strength"),
  generateSkill("Thieving"),
  generateSkill("Woodcutting"),
];

export const getSkillBySkillName = (skillName: string): Skill | undefined => {
  return skills.find((skill) => skill.skillName === skillName);
};

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
];

export default Queue;
