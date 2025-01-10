'use client'

import Header from "../components/header";
import Account from "../components/account/account";
import QueueContainer from "../components/queue/queueContainer";
import SkillContainer from "../components/skillContainer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1920px] mx-auto relative">
        <Account />

        <Header />
        <QueueContainer />
        <SkillContainer />
      </div>
    </div>
  );
}
