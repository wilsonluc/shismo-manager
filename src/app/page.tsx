"use client";

import Header from "../components/header";
import Account from "../components/account/account";
import Queue from "../components/queue/queue";
import SkillContainer from "../components/skill/skillContainer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1920px] mx-auto relative">
        <Account />

        <Header />
        <Queue />
        <SkillContainer />
      </div>
    </div>
  );
}