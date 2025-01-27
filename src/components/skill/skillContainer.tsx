"use client";

import React, { useEffect, useState } from "react";
import SkillCard from "./skillCard";
import Dropdown from "../dropdown/dropdown";
import ChevronIcon from "../dropdown/chevronIcon";
import { SKILLS_ENDPOINT } from "../../app/endpoints";

interface Skill {
  skillName: string;
  level: number;
}

const skills: Skill[] = [
  { skillName: "Overall", level: 1 },
  { skillName: "Attack", level: 1 },
  { skillName: "Defence", level: 1 },
  { skillName: "Strength", level: 1 },
  { skillName: "Hitpoints", level: 10 },
  { skillName: "Ranged", level: 1 },
  { skillName: "Prayer", level: 1 },
  { skillName: "Magic", level: 1 },

  { skillName: "Cooking", level: 1 },
  { skillName: "Woodcutting", level: 1 },
  { skillName: "Fletching", level: 1 },
  { skillName: "Fishing", level: 1 },
  { skillName: "Firemaking", level: 1 },
  { skillName: "Crafting", level: 1 },
  { skillName: "Smithing", level: 1 },

  { skillName: "Mining", level: 1 },
  { skillName: "Herblore", level: 1 },
  { skillName: "Agility", level: 1 },
  { skillName: "Thieving", level: 1 },
  { skillName: "Slayer", level: 1 },
  { skillName: "Farming", level: 1 },
  { skillName: "Runecrafting", level: 1 },

  { skillName: "Hunter", level: 1 },
  { skillName: "Construction", level: 1 },
];

function parseSkillsStringToJson(jsonString: string): Skill[] {
  console.log(jsonString);

  let totalLevel = 0;
  const skillsArr: string[] = jsonString.slice(1, -1).split(", ");

  skillsArr.map((skillString: string) => {
    const skillSplit: string[] = skillString.split("=")

    let skill = skillSplit[0];
    const level = skillSplit[1];

    if (skill === "RUNECRAFT") {
      skill = "Runecrafting";
    } else {
      skill = skill.toLowerCase();
      skill = String(skill).charAt(0).toUpperCase() + String(skill).slice(1); // Capitalise first char
    }

    const skillObj = skills.find((s) => s.skillName === skill);
    if (skillObj) {
      skillObj.level = parseInt(level, 10);
      totalLevel += skillObj.level;
    }
  });

  const overallObj = skills.find((s) => s.skillName === "Overall");
  if (overallObj) {
    overallObj.level = totalLevel;
  }

  return skills;
}

interface SkillContainerProps {
  characterName: string;
}

const SkillContainer: React.FC<SkillContainerProps> = ({ characterName }) => {
  const [skills, setSkills] = useState<Skill[]>([]);

  // TODO: Implement the overall skill as well

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();

        if (data.user && characterName) {
          const skillsResponse = await fetch(
            SKILLS_ENDPOINT + data.user.id + "/" + characterName
          );
          const skillsJson = await skillsResponse.json();
          const skillsString = skillsJson.skills;
          if (skillsString === "") {
            setSkills([]);
          } else {
            setSkills(parseSkillsStringToJson(skillsString));
          }
        }
      } catch (error) {
        console.error("Error fetching user/characterName data: ", error);
      }
    };

    fetchSkills();
  }, [characterName]);

  return (
    <Dropdown
      title="Current Skills"
      icon={<ChevronIcon isOpen={false} />} // Default not open
      content={
        <div className="p-4 bg-muted text-muted-foreground">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {skills.map((skill) => (
              <SkillCard
                key={skill.skillName} // Unique key for each Card component
                skill={skill.skillName}
                level={skill.level}
                image={`/assets/skills/${skill.skillName.toLowerCase()}.png`}
              />
            ))}
          </div>
        </div>
      }
    />
  );
};

export default SkillContainer;
