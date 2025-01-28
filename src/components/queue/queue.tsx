import QueueEditorContainer from "./queueEditorContainer";
import QueueContainer from "./queueContainer";
import { Task } from "../../app/page";

interface QueueProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  characterName: string | undefined;
  plugins: string[]
}

const Queue: React.FC<QueueProps> = ({ tasks, setTasks, characterName, plugins }) => {
  return (
    <div>
      <QueueContainer tasks={tasks} setTasks={setTasks} characterName={characterName} />
      <QueueEditorContainer tasks={tasks} setTasks={setTasks} characterName={characterName} plugins={plugins} />
    </div>
  );
};

export function parseTasksJsonToString(tasks: Task[]): string {
  return JSON.stringify(tasks, null, 2);
}

export default Queue;
