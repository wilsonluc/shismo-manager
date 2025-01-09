import React from "react";
import Image from 'next/image'; // Import the Image component from Next.js

interface CardProps {
  skill: string;
  level: number;
  image?: string;
}

const Card = ({ skill, level, image }: CardProps) => {
  return (
    <div className="card flex flex-col justify-center p-5 rounded-lg relative text-white overflow-hidden h-fit w-fit z-10 transition-all duration-300">
      <div className="flex flex-col items-center">
      {image && (
          <Image
            src={image}
            alt={skill}
            width={40}   // Specify the width (in pixels)
            height={40}  // Specify the height (in pixels)
            className="object-contain mb-4 shadow-lg" // You can still use Tailwind classes
          />
        )}
        <h2 className="text-2xl font-bold mb-2">{skill}</h2>
        <p className="text-sm opacity-70">Level: {level}</p>
      </div>

      {/* Card Background or any additional styles can be added */}
      <div className="inset-0 absolute z-0 bg-gradient-to-b from-blue-500 to-blue-800 opacity-30"></div>
    </div>
  );
};

export default Card;
