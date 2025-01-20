import QueueEditorContainer from "./queueEditorContainer";
import QueueContainer from "./queueContainer";
import { Task } from "../../app/page";
import { useEffect } from "react";
import { TASKS_ENDPOINT } from "../../app/endpoints";

interface QueueProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  characterName: string | undefined;
}

const Queue: React.FC<QueueProps> = ({ tasks, setTasks, characterName }) => {
  useEffect(() => {
    // Fetch the user data from the /api/user route
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();

        if (data.user && characterName) {
          const tasksResponse = await fetch(
            TASKS_ENDPOINT + data.user.id + "/" + characterName
          );
          const tasksJson = await tasksResponse.json();
          const tasksString = tasksJson.tasks;
          if (tasksString === "") {
            setTasks([]);
          } else {
            setTasks(parseTasksStringToJson(tasksString));
          }
        }
      } catch (error) {
        console.error("Error fetching user/characterName data:", error);
      }
    };

    fetchTasks();
  }, [characterName, setTasks]);

  return (
    <div>
      <QueueContainer tasks={tasks} setTasks={setTasks} characterName={characterName} />
      <QueueEditorContainer tasks={tasks} setTasks={setTasks} characterName={characterName} />
    </div>
  );
};

export const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export function parseTasksJsonToString(tasks: Task[]): string {
  return JSON.stringify(tasks, null, 2);
}

export function parseTasksStringToJson(tasksString: string): Task[] {
  try {
    if (tasksString.length == 0) {
      return [];
    }
    return JSON.parse(tasksString);
  } catch (error) {
    console.error("Error parsing tasks string:", error);
    return [];
  }
}

export default Queue;
