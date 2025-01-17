"use client";

import Header from "../components/header";
import Account from "../components/account/account";
import Queue from "../components/queue/queue";
import SkillContainer from "../components/skill/skillContainer";
import Sync from "../components/sync/sync";
import { useState } from "react";
import { Skill } from "../components/queue/skill";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [characterName, setCharacterName] = useState<string>("");

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1920px] mx-auto relative">
        
        <Account setCharacterName={setCharacterName} />
        <Sync tasks={tasks} characterName={characterName}/>

        <Header />
        <Queue tasks={tasks} setTasks={setTasks} characterName={characterName}/>
        <SkillContainer />
      </div>
    </div>
  );
}

export interface Task {
  id: string;
  skill: Skill;
  level?: number;
  duration?: number; // Minutes
  pluginName: string;
}