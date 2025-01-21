"use client";

import { useRef } from "react";
import { TASKS_ENDPOINT } from "../../app/endpoints";
import { Task } from "../../app/page";
import { parseTasksJsonToString } from "../queue/queue";

interface SyncProps {
  tasks: Task[];
  characterName: string | undefined;
}

const Sync: React.FC<SyncProps> = ({ tasks, characterName }) => {
  // Websocket reference
  const socketRef = useRef<WebSocket | null>(null);

  // Function to send the PUT request to update tasks
  // const setTasks = async () => {
  //   try {
  //     const response = await fetch("/api/user");
  //     const data = await response.json();

  //     if (data.user && characterName) {
  //       const tasksResponse = await fetch(
  //         TASKS_ENDPOINT + data.user.id + "/" + characterName,
  //         {
  //           method: "PUT",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ tasks: parseTasksJsonToString(tasks) }),
  //         }
  //       );

  //       const tasksJson = await tasksResponse.json();
  //       if (tasksResponse.ok) {
  //         console.log("Tasks updated successfully:", tasksJson);
  //       } else {
  //         console.error("Failed to update tasks:", tasksJson);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user/characterName data:", error);
  //   }
  // };

  const syncWebSocket = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();

      if (data.user && characterName) {
        const wsUrl = `wss://cn2xa6jdhj.execute-api.eu-west-2.amazonaws.com/production/?discordID=${data.user.id}&characterName=${characterName}`;
        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onopen = () => {
          console.log("WebSocket connected");

          const params = {
            action: "sync", // route
            discordID: data.user.id,
            characterName: characterName,
            tasks: parseTasksJsonToString(tasks)
          };

          socketRef.current.send(JSON.stringify(params));
        };

        socketRef.current.onmessage = (event) => {
          console.log("Received message: " + event.data);
        };

        socketRef.current.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
        
        socketRef.current.onclose = () => {
          console.log("WebSocket connection closed");
        };
      }
    } catch (error) {
      console.error("Error setting up websocket", error);
    }
  };

  return (
    <div className="absolute top-0 right-12">
      <button
        onClick={syncWebSocket}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg    border border-border bg-background/50 hover:bg-accent    transition-colors duration-200"
        title="Sync with cloud"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4a90e2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
        </svg>
        <span className="sr-only">Toggle theme</span>
      </button>
    </div>
  );
};

export default Sync;

// TODO: Three lines, then login/logout/swtich char
