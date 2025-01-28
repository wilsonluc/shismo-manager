export interface Skill {
  skill: string;
  iconPath: string;
}

export const generateSkill = (name: string): Skill => {
  return {
    skill: name,
    iconPath: `/assets/skills/${name.toLowerCase()}.png`,
  };
};

export const getSkillIconPath = (skill: string): string => {
  // console.log(skillName);
  return `/assets/skills/${skill.toLowerCase()}.png`;
}

export const agility = "Agility";
export const attack = "Attack";
export const construction = "Construction";
export const cooking = "Cooking";
export const crafting = "Crafting";
export const defence = "Defence";
export const firemaking = "Firemaking";
export const fishing = "Fishing";
export const fletching = "Fletching";
export const herblore = "Herblore";
export const hitpoints = "Hitpoints";
export const hunter = "Hunter";
export const magic = "Magic";
export const mining = "Mining";
export const prayer = "Prayer";
export const ranged = "Ranged";
export const runecrafting = "Runecrafting";
export const slayer = "Slayer";
export const smithing = "Smithing";
export const strength = "Strength";
export const thieving = "Thieving";
export const woodcutting = "Woodcutting";

export const skillNames: string[] = [
  agility,
  attack,
  construction,
  cooking,
  crafting,
  defence,
  firemaking,
  fishing,
  fletching,
  herblore,
  hitpoints,
  hunter,
  magic,
  mining,
  prayer,
  ranged,
  runecrafting,
  slayer,
  smithing,
  strength,
  thieving,
  woodcutting,
];

export const getSkillBySkillName = (skillName: string): string => {
  const skill = skillNames.find((name) => name === skillName);
  return skill || woodcutting;
};
