/* eslint-disable @next/next/no-img-element */
import React from "react";

interface CardProps {
  skill: string;
  level: number;
  image?: string;
}

const Card = ({ skill, level, image }: CardProps) => {
  return (
    <div className="p-4 rounded-lg border bg-card relative transition-all duration-200 cursor-pointer bg-muted border-border">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <img src={image} alt={skill} className="w-6 h-6 "></img>
            <span className="text-sm font-medium text-foreground">{skill}</span>
          </div>
          <div className="space-y-0.5 pl-8">
            <div className="text-sm font-medium text-foreground">Level {level}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;