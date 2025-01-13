import { Skill } from "./skill";

export interface Plugin {
  skill: Skill;
  pluginName: string;
}

export const plugins: string[] = [
  "Hunters' Rumours",
  "Motherlode Mine",
  "Slayer",
  "Tempoross",
];
