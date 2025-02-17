"use client";

import { Profile } from "passport-discord";
import React from "react";

interface HeaderProps {
  user: Profile | undefined;
  characterName: string | undefined;
}

const Header: React.FC<HeaderProps> = ({ user, characterName }) => {
  return (
    <div className="flex flex-col gap-1 mb-8">
      <h1 className="text-3xl font-bold text-foreground">Shismo Manager</h1>
      <p className="text-sm text-muted-foreground">
        {characterName ? 'Current character: ' + characterName : user ? 'Please select a character' : 'Please log in'}
      </p>
    </div>
  );
};

export default Header;
