import QueueEditorContainer from "./queueEditorContainer";
import { getSkillBySkillName } from "./skill";
import QueueContainer from "./queueContainer";
import { Task } from "../../app/page";
import { useEffect } from "react";
import { ENDPOINT } from "../../app/constants";

interface QueueProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  characterName: string;
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
            ENDPOINT + data.user.id + "/" + characterName
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
  });

  return (
    <div>
      <QueueContainer tasks={tasks} setTasks={setTasks} />
      <QueueEditorContainer setTasks={setTasks} />
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

export const DEFAULT_CARDS: Task[] = [
  {
    skill: getSkillBySkillName("Woodcutting"),
    level: 30,
    pluginName: "Skiller",
    id: generateRandomString(10),
  },
  {
    skill: getSkillBySkillName("Crafting"),
    level: 50,
    pluginName: "Bank Skiller",
    id: generateRandomString(10),
  },
  {
    skill: getSkillBySkillName("Hunter"),
    level: 70,
    pluginName: "Hunters' Rumours",
    id: generateRandomString(10),
  },
  {
    skill: getSkillBySkillName("Slayer"),
    duration: 50,
    pluginName: "Slayer",
    id: generateRandomString(10),
  },
];

export function parseTasksJsonToString(tasks: Task[]): string {
  return JSON.stringify(tasks, null, 2);
}

export function parseTasksStringToJson(tasksString: string): Task[] {
  try {
    return JSON.parse(tasksString);
  } catch (error) {
    console.error("Error parsing tasks string:", error);
    return [];
  }
}

export default Queue;
