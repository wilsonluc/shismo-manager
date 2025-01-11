"use client";

import SkillCard from "./skillCard";
import Dropdown from "../dropdown/dropdown";
import ChevronIcon from "../dropdown/chevronIcon";

const SkillContainer = () => {
  interface Skill {
    skill: string;
    level: number;
  }

  const skills: Skill[] = [
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

  return (
    <Dropdown
      title="Current Skills"
      icon={<ChevronIcon isOpen={false} />} // Default not open
      content={
        <div className="p-4 bg-muted text-muted-foreground">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {skills.map((skill) => (
              <SkillCard
                key={skill.skill} // Unique key for each Card component
                skill={skill.skill}
                level={skill.level}
                image={`/assets/skills/${skill.skill.toLowerCase()}.png`}
              />
            ))}
          </div>
        </div>
      }
    />
  );
};

export default SkillContainer;
