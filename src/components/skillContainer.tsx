"use client";

import React, { useState } from "react";
import Card from "./card";

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

  // Drop open/closed state tracker
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border mb-4 overflow-hidden">
      <div className="border-b border-border">
        <div className="flex items-center gap-2 p-4">
          <button
            className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
            onClick={toggleDropdown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`lucide lucide-chevron-right w-4 h-4 transform transition-transform duration-300 ${
                isOpen ? "rotate-90" : ""
              }`} // Add the rotate class when isOpen
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
          <h2 className="text-base font-semibold text-foreground">
            Skills
          </h2>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 bg-muted text-muted-foreground">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {skills.map((skill) => (
              <Card
                key={skill.skill} // Unique key for each Card component
                skill={skill.skill}
                level={skill.level}
                image={`/assets/${skill.skill.toLowerCase()}.png`} // Assuming image filenames are skill names in lowercase
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillContainer;
