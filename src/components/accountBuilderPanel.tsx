// "use client";
// import { createContext } from "react";
// import { Card, Input, Button, Spacer } from "@nextui-org/react";
// import { Card } from "@nextui-org/react";
import Welcome from "./welcome";
import Card from "./card";
// import { Row, Col } from "@nextui-org/react"; // Import Row and Col for grid layout

interface Skill {
  skill: string;
  level: number;
}

// const Context = createContext();

const AccountBuilderPanel: React.FC = () => {
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
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      {skills.map((skill) => (
        <Card
          key={skill.skill} // Unique key for each Card component
          skill={skill.skill}
          level={skill.level}
          image={`/assets/${skill.skill.toLowerCase()}.png`} // Assuming image filenames are skill names in lowercase
        />
      ))}
    </div>
  );
};

export default AccountBuilderPanel;
