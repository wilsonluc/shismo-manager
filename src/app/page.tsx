"use client";

import Header from "../components/header";
import Account from "../components/account/account";
import Queue from "../components/queue/queue";
import SkillContainer from "../components/skill/skillContainer";
import Sync from "../components/sync/sync";
import { useEffect, useState } from "react";
// import { CHARS_ENDPOINT, SKILLS_ENDPOINT, TASKS_ENDPOINT } from "./endpoints";
import { CHARS_ENDPOINT, REST_ENDPOINT } from "./endpoints";
import { Profile } from "passport-discord";

export default function Home() {
  const [user, setUser] = useState<Profile | undefined>();
  const [characterNames, setCharacterNames] = useState<string[]>([]);
  const [loadingCharacterNames, setLoadingCharacterNames] = useState(false);

  const [characterName, setCharacterName] = useState<string | undefined>();
  const [plugins, setPlugins] = useState<string[]>([]);
  const [skillLevels, setSkillLevels] = useState<SkillLevel[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Set user (initial load)
  useEffect(() => {
    const fetchUser = async () => {
      // Call backend to get user data
      const res = await fetch("/api/user");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(undefined);
      }
    };

    fetchUser();
  }, []);

  // Set character names (user set)
  useEffect(() => {
    const fetchCharacterNames = async () => {
      if (user && user.id) {
        const charactersResponse = await fetch(CHARS_ENDPOINT + user.id);
        const charactersData = await charactersResponse.json();
        if (charactersData) {
          setCharacterNames(charactersData.characterNames || []);
        }
      }
      setLoadingCharacterNames(false);
    };

    if (user) {
      fetchCharacterNames();
    }
  }, [user]);

  // Set character name (characterNames set)
  useEffect(() => {
    const fetchCharacterName = async () => {
      if (characterNames[0]) {
        setCharacterName(characterNames[0]);
      }
    };

    if (user) {
      fetchCharacterName();
    }
  }, [user, characterNames]);

  // Open websocket + populate initial tasks (characterName set)
  useEffect(() => {
    if (user && user.id && characterName) {
      const wsUrl = `wss://cn2xa6jdhj.execute-api.eu-west-2.amazonaws.com/production/?discordID=${user.id}&characterName=${characterName}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("Websocket connection opened");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);

        // Parse skills
        if (data.skills) {
          console.log("Skills received: " + data.skills);
          setSkillLevels(parseSkillLevelsFromJson(data.skills));
        }

        // Parse tasks
        if (data.tasks) {
          console.log("Tasks received: " + data.tasks);

          const updatedTasks: Task[] = [];

          const jsonTasks = JSON.parse(data.tasks);
          for (const key in jsonTasks) {
            const id = jsonTasks[key].id;
            const skill = jsonTasks[key].skill;

            let level = jsonTasks[key].level;
            level = level ? parseInt(level) : null;
            let duration = jsonTasks[key].duration;
            duration = duration ? parseInt(duration) : null;

            const pluginName = jsonTasks[key].pluginName;
            const updatedTask = new Task(
              id,
              skill,
              level,
              duration,
              pluginName
            );
            updatedTasks.push(updatedTask);
          }
          setTasks(updatedTasks);
        }
      };

      ws.onclose = () => {
        console.log("Websocket connection closed");
      };

      setSocket(ws);

      return () => {
        if (ws) {
          ws.close();
        }
      };
    }
  }, [characterName, user]);

  // Set plugins, skills & tasks (characterName set)
  useEffect(() => {
    const fetchAll = async () => {
      if (!user) return;
      const skillLevelsResponse = await fetch(
        REST_ENDPOINT + user.id + "/" + characterName
      );
      const jsonData = await skillLevelsResponse.json();

      const item = jsonData.item;
      if (!item) {
        console.log("No item found");
        return;
      }

      // Set plugins
      if (item.availablePlugins && item.availablePlugins.length > 0) {
        setPlugins(parsePluginsFromJson(item.availablePlugins));
      }

      // Set skills
      if (item.skills && item.skills.length > 0) {
        setSkillLevels(parseSkillLevelsFromJson(item.skills));
      }

      // Set tasks
      if (item.tasks === "") {
        setTasks([]);
      } else {
        setTasks(parseTasksFromJson(item.tasks));
      }
    };

    if (user && user.id && characterName) {
      fetchAll();
    }
  }, [characterName, user]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1920px] mx-auto relative">
        <Header user={user} characterName={characterName} />

        <Account
          setCharacterName={setCharacterName}
          user={user}
          setUser={setUser}
          loadingCharacterNames={loadingCharacterNames}
          characterNames={characterNames}
        />
        <Sync
          tasks={tasks}
          user={user}
          characterName={characterName}
          socket={socket}
        />

        <Queue
          tasks={tasks}
          setTasks={setTasks}
          characterName={characterName}
          plugins={plugins}
        />
        <SkillContainer
          characterName={characterName}
          skillLevels={skillLevels}
        />
      </div>
    </div>
  );
}

export class Task {
  id: string;
  skill: string;
  level?: number;
  duration?: number; // Minutes
  pluginName: string;

  constructor(
    id: string,
    skill: string,
    level: number,
    duration: number,
    pluginName: string
  ) {
    this.id = id;
    this.skill = skill;
    this.level = level;
    this.duration = duration;
    this.pluginName = pluginName;
  }
}

export class SkillLevel {
  skill: string;
  level: number;

  constructor(skill: string, level: number) {
    this.skill = skill;
    this.level = level;
  }
}

export function parsePluginsFromJson(jsonString: string): string[] {
  const plugins: string[] = [];

  const excludeTerms: string[] = [
    "Auto Eater",
    "Break",
    "Profiles",
    "Loader",
    "Scheduler",
    "Utils",
    "Webwalker",
  ];

  const pluginsArr: string[] = jsonString.split(", ");
  for (const plugin of pluginsArr) {
    if (
      plugin.includes("Shismo") &&
      !excludeTerms.some((term) => plugin.includes(term))
    ) {
      plugins.push(plugin);
    }
  }
  return plugins;
}

export function parseSkillLevelsFromJson(jsonString: string): SkillLevel[] {
  const skills: SkillLevel[] = [...defaultSkillLevels]; // Make a copy of default skill levels
  let totalLevel = 0;

  const skillsArr: string[] = jsonString.slice(1, -1).split(", ");
  skillsArr.map((skillString: string) => {
    const skillSplit: string[] = skillString.split("=");

    let skillStr = skillSplit[0];
    const levelStr = skillSplit[1];

    skillStr =
      skillStr === "RUNECRAFT"
        ? "Runecrafting"
        : `${skillStr.charAt(0).toUpperCase()}${skillStr
            .slice(1)
            .toLowerCase()}`;

    const level = parseInt(levelStr, 10);
    const skill = skills.find((s) => s.skill === skillStr);
    if (skill) {
      skill.level = level;
      totalLevel += level;
    }
  });

  const overallSkill = skills.find((s) => s.skill === "Overall");
  if (overallSkill) {
    overallSkill.level = totalLevel;
  }

  return skills;
}

const defaultSkillLevels: SkillLevel[] = [
  { skill: "Overall", level: 1 },
  { skill: "Attack", level: 1 },
  { skill: "Defence", level: 1 },
  { skill: "Strength", level: 1 },
  { skill: "Hitpoints", level: 10 },
  { skill: "Ranged", level: 1 },
  { skill: "Prayer", level: 1 },
  { skill: "Magic", level: 1 },

  { skill: "Cooking", level: 1 },
  { skill: "Woodcutting", level: 1 },
  { skill: "Fletching", level: 1 },
  { skill: "Fishing", level: 1 },
  { skill: "Firemaking", level: 1 },
  { skill: "Crafting", level: 1 },
  { skill: "Smithing", level: 1 },

  { skill: "Mining", level: 1 },
  { skill: "Herblore", level: 1 },
  { skill: "Agility", level: 1 },
  { skill: "Thieving", level: 1 },
  { skill: "Slayer", level: 1 },
  { skill: "Farming", level: 1 },
  { skill: "Runecrafting", level: 1 },

  { skill: "Hunter", level: 1 },
  { skill: "Construction", level: 1 },
];

export function parseTasksFromJson(tasksString: string): Task[] {
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
