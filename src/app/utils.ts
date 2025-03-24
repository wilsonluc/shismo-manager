// src/lib/utils.ts

export class Task {
    id: string;
    pluginName: string;
    level: number | null;
    skill: string | null;
    duration: number | null;
  
    constructor(
      id: string,
      pluginName: string,
      skill: string | null,
      level: number | null,
      duration: number | null
    ) {
      this.id = id;
      this.pluginName = pluginName;
      this.skill = skill;
      this.level = level;
      this.duration = duration;
    }
  }
  
  export class SkillLevel {
    skill: string;
    level: number;
  
    constructor(skill: string, level: number) {
      this.skill = skill;
      this.level = level;
    }
  }
  
  export const defaultSkillLevels: SkillLevel[] = [
    { skill: "Overall", level: 1 },
    { skill: "Attack", level: 1 },
    { skill: "Defence", level: 1 },
    { skill: "Strength", level: 1 },
    { skill: "Hitpoints", level: 10 },
    { skill: "Ranged", level: 1 },
    { skill: "Prayer", level: 1 },
    { skill: "Magic", level: 1 },
    { skill: "Cooking", level: 1 },
    { skill: "Woodcutting", level: 1 },
    { skill: "Fletching", level: 1 },
    { skill: "Fishing", level: 1 },
    { skill: "Firemaking", level: 1 },
    { skill: "Crafting", level: 1 },
    { skill: "Smithing", level: 1 },
    { skill: "Mining", level: 1 },
    { skill: "Herblore", level: 1 },
    { skill: "Agility", level: 1 },
    { skill: "Thieving", level: 1 },
    { skill: "Slayer", level: 1 },
    { skill: "Farming", level: 1 },
    { skill: "Runecrafting", level: 1 },
    { skill: "Hunter", level: 1 },
    { skill: "Construction", level: 1 },
  ];
  
  export function parsePluginsFromJson(jsonString: string): string[] {
    const plugins: string[] = ["Break"];
    const excludeTerms = [
      "Auto Eater",
      "Break",
      "Loader",
      "Profiles",
      "Run Handler",
      "Scheduler",
      "Utils",
      "Webwalker",
    ];
  
    const cleanedString = jsonString.replace(/[\[\]]/g, "");
    const pluginsArr = cleanedString.split(", ");
    for (const plugin of pluginsArr) {
      if (
        plugin.includes("Shismo") &&
        !excludeTerms.some((term) => plugin.includes(term))
      ) {
        plugins.push(plugin);
      }
    }
    return plugins;
  }
  
  export function parseSkillLevelsFromJson(jsonString: string): SkillLevel[] {
    const skills: SkillLevel[] = [...defaultSkillLevels];
    let totalLevel = 0;
  
    const skillsArr = jsonString.slice(1, -1).split(", ");
    for (const skillString of skillsArr) {
      const [rawSkill, rawLevel] = skillString.split("=");
      const skillStr =
        rawSkill === "RUNECRAFT"
          ? "Runecrafting"
          : rawSkill.charAt(0).toUpperCase() + rawSkill.slice(1).toLowerCase();
  
      const level = parseInt(rawLevel, 10);
      const skill = skills.find((s) => s.skill === skillStr);
      if (skill) {
        skill.level = level;
        totalLevel += level;
      }
    }
  
    const overallSkill = skills.find((s) => s.skill === "Overall");
    if (overallSkill) {
      overallSkill.level = totalLevel;
    }
  
    return skills;
  }
  
  export function parseTasksFromJson(tasksString: string): Task[] {
    try {
      if (tasksString.length === 0) return [];
      return JSON.parse(tasksString);
    } catch (error) {
      console.error("Error parsing tasks string:", error);
      return [];
    }
  }  