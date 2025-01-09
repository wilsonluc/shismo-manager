import Header from "@/components/header";
import QueueContainer from "@/components/queueContainer";
import SkillContainer from "@/components/skillContainer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1920px] mx-auto relative">
        <Header />
        <QueueContainer />
        <SkillContainer />
      </div>
    </div>
  );
}
