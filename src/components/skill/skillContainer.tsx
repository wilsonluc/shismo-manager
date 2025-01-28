"use client";

import SkillCard from "./skillCard";
import Dropdown from "../dropdown/dropdown";
import ChevronIcon from "../dropdown/chevronIcon";
import { SkillLevel } from "../../app/page";

interface SkillContainerProps {
  characterName: string | undefined;
  skillLevels: SkillLevel[];
}

const SkillContainer: React.FC<SkillContainerProps> = ({ characterName, skillLevels }) => {
  if (!characterName || skillLevels.length == 0) {
    return null;
  }

  return (
    <Dropdown
      title="Current Skills"
      icon={<ChevronIcon isOpen={false} />} // Default not open
      content={
        <div className="p-4 bg-muted text-muted-foreground">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {skillLevels.map((skillLevel) => (
              <SkillCard
                key={skillLevel.skill} // Unique key for each Card component
                skill={skillLevel.skill}
                level={skillLevel.level}
                image={`/assets/skills/${skillLevel.skill.toLowerCase()}.png`}
              />
            ))}
          </div>
        </div>
      }
    />
  );
};

export default SkillContainer;
