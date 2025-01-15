export interface Skill {
  skillName: string;
  iconPath: string;
}

export const generateSkill = (name: string): Skill => {
  return {
    skillName: name,
    iconPath: `/assets/skills/${name.toLowerCase()}.png`,
  };
};

export const agility = generateSkill("Agility");
export const attack = generateSkill("Attack");
export const construction = generateSkill("Construction");
export const cooking = generateSkill("Cooking");
export const crafting = generateSkill("Crafting");
export const defence = generateSkill("Defence");
export const firemaking = generateSkill("Firemaking");
export const fishing = generateSkill("Fishing");
export const fletching = generateSkill("Fletching");
export const herblore = generateSkill("Herblore");
export const hitpoints = generateSkill("Hitpoints");
export const hunter = generateSkill("Hunter");
export const magic = generateSkill("Magic");
export const mining = generateSkill("Mining");
export const prayer = generateSkill("Prayer");
export const ranged = generateSkill("Ranged");
export const runecrafting = generateSkill("Runecrafting");
export const slayer = generateSkill("Slayer");
export const smithing = generateSkill("Smithing");
export const strength = generateSkill("Strength");
export const thieving = generateSkill("Thieving");
export const woodcutting = generateSkill("Woodcutting");

export const skills: Skill[] = [
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

export const getSkillBySkillName = (skillName: string): Skill => {
  const skill = skills.find((skill) => skill.skillName === skillName);
  return skill || woodcutting;
};
