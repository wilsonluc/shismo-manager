"use client";

import Header from "../components/header";
import Account from "../components/account/account";
import Queue from "../components/queue/queue";
import SkillContainer from "../components/skill/skillContainer";
import Sync from "../components/sync/sync";
import { useEffect, useState } from "react";
import { CHARS_ENDPOINT, SKILLS_ENDPOINT, TASKS_ENDPOINT } from "./endpoints";
import { Profile } from "passport-discord";

export default function Home() {
  const [user, setUser] = useState<Profile>();
  const [characterNames, setCharacterNames] = useState<string[]>([]);
  const [loadingCharacterNames, setLoadingCharacterNames] = useState(false);

  const [characterName, setCharacterName] = useState<string | undefined>();
  const [skillLevels, setSkillLevels] = useState<SkillLevel[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Set user
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

  // Set character names
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
  }, [loadingCharacterNames, user]);

  // Set character name
  useEffect(() => {
    const fetchCharacterName = async () => {
      if (characterNames[0]) {
        setCharacterName(characterNames[0]);
      }
    };

    if (user) {
      fetchCharacterName();
    }
  }, [characterNames, user]);

  // Set skills
  useEffect(() => {
    const fetchSkills = async () => {
      if (!user) return;
      const skillLevelsResponse = await fetch(
        SKILLS_ENDPOINT + user.id + "/" + characterName
      );
      const skillLevelsData = await skillLevelsResponse.json();

      if (skillLevelsData.skills && skillLevelsData.skills.length > 0) {
        setSkillLevels(parseSkillLevelsFromJson(skillLevelsData.skills));
      }
    };

    if (user && user.id && characterName) {
      fetchSkills();
    }
  }, [characterName, user]);

  // Set tasks
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      const tasksResponse = await fetch(
        TASKS_ENDPOINT + user.id + "/" + characterName
      );
      const tasksData = await tasksResponse.json();
      if (tasksData.tasks === "") {
        setTasks([]);
      } else {
        setTasks(parseTasksStringToJson(tasksData.tasks));
      }
    };

    if (user && user.id && characterName) {
      fetchTasks();
    }
  }, [characterName, user]);

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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1920px] mx-auto relative">
        <Header />

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
