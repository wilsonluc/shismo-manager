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
    { skill: "Overall", level: 32 },
    { skill: "Attack", level: 1 },
    { skill: "Defence", level: 1 },
    { skill: "Strength", level: 1 },
    { skill: "Hitpoints", level: 10 },
    { skill: "Magic", level: 35 },
    { skill: "Woodcutting", level: 52 },
    { skill: "Mining", level: 42 },
    { skill: "Thieving", level: 52 },
    { skill: "Herblore", level: 50 },
    { skill: "Agility", level: 54 },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <Card
        skill="Attack"
        level={skills.find(skill => skill.skill === "Attack")?.level || 0} // Default to 0 if not found
        image="/assets/attack.png"
      />
    </div>
  );
};

export default AccountBuilderPanel;
