'use client'

import Header from "../components/header";
import SwitchAccount from "../components/switchAccount";
import QueueContainer from "../components/queueContainer";
import SkillContainer from "../components/skillContainer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1920px] mx-auto relative">
        <SwitchAccount />
        <Header />
        <QueueContainer />
        <SkillContainer />
      </div>
    </div>
  );
}
