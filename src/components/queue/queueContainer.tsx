"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import ChevronIcon from "../dropdown/chevronIcon";
import Dropdown from "../dropdown/dropdown";
import { Task } from "./queue"; // Import Task type from the previous file

// Define types for Task and ColumnProps

interface ColumnProps {
  title: string;
  headingColor: string;
  tasks: Task[]; // Using Task[] directly instead of QueueCard[]
  setTasks: Dispatch<SetStateAction<Task[]>>; // Changed from QueueCard[] to Task[]
}

export interface Button {
  label: string;
  onClick: () => void; // The onClick function
}

const QueueContainer = ({
  tasks,
  setTasks,
}: {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const toggleSelectTask = (id: string) => {
    setSelectedTasks((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id); // Deselect if already selected
      } else {
        return [...prevSelected, id]; // Select if not selected
      }
    });
  };

  const handleRemoveSelectedTasks = () => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => !selectedTasks.includes(task.id))
    ); // Remove selected tasks
    setSelectedTasks([]); // Clear selected tasks after removal
  };

  return (
    <Dropdown
      title="Queue"
      icon={<ChevronIcon isOpen={false} />}
      content={
        <Board
          tasks={tasks}
          setTasks={setTasks}
          selectedTasks={selectedTasks}
          toggleSelectTask={toggleSelectTask}
        />
      }
      buttons={
        selectedTasks.length > 0 // Show the "Remove" button only if there are selected tasks
          ? [
              {
                label: "Remove",
                onClick: handleRemoveSelectedTasks, // Attach removal function
              },
            ]
          : undefined
      }
    />
  );
};

const Board = ({
  tasks,
  setTasks,
  selectedTasks,
  toggleSelectTask,
}: {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  selectedTasks: string[];
  toggleSelectTask: (id: string) => void;
}) => {
  return (
    <div className="flex h-full w-full gap-3">
      <Column
        title="Queue"
        headingColor="text-neutral-500"
        tasks={tasks}
        setTasks={setTasks}
        selectedTasks={selectedTasks}
        toggleSelectTask={toggleSelectTask}
      />
    </div>
  );
};

const Column = ({
  tasks,
  setTasks,
  selectedTasks,
  toggleSelectTask,
}: ColumnProps & {
  selectedTasks: string[];
  toggleSelectTask: (id: string) => void;
}) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const taskId = e.dataTransfer.getData("taskId");
    setActive(false);
    clearHighlights();
    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";
    if (before !== taskId) {
      let copy = [...tasks];
      const taskToTransfer = copy.find((t) => t.id === taskId);
      if (!taskToTransfer) return;
      copy = copy.filter((t) => t.id !== taskId);
      const moveToBack = before === "-1";
      if (moveToBack) {
        copy.push(taskToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;
        copy.splice(insertAtIndex, 0, taskToTransfer);
      }
      setTasks(copy);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = () => {
    const indicators = getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: React.DragEvent<HTMLElement>) => {
    const indicators = getIndicators();
    clearHighlights();
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (
    e: React.DragEvent<HTMLElement>,
    indicators: HTMLElement[]
  ) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
    return el;
  };

  const getIndicators = (): HTMLElement[] => {
    return Array.from(
      document.querySelectorAll(`[data-column="queue"]`)
    ) as HTMLElement[];
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  return (
    <div className="w-full shrink-0">
      <div className="flex items-center justify-between"></div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {tasks.map((task) => {
          if (!task.skill) {
            return null; // If task.skill is undefined or null, don't render anything for this task.
          }

          return (
            <Card
              skillName={task.skill.skillName} // Safely access task.skill.skillName
              {...task}
              key={task.id}
              handleDragStart={handleDragStart}
              isSelected={selectedTasks.includes(task.id)} // Pass the selected state to Card
              toggleSelectTask={toggleSelectTask} // Pass the toggle function to Card
            />
          );
        })}
        <DropIndicator beforeId={null} column="queue" />
      </div>
    </div>
  );
};

interface CardProps {
  skillName: string;
  level?: number;
  duration?: number;
  pluginName: string;
  id: string;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  isSelected: boolean;
  toggleSelectTask: (id: string) => void;
}

const Card = ({
  skillName,
  level,
  duration,
  pluginName,
  id,
  handleDragStart,
  isSelected,
  toggleSelectTask,
}: CardProps) => {
  const text =
    skillName +
    " " +
    (level
      ? "to level " + level
      : duration
      ? "for " + duration + " minutes"
      : "too N/A ") +
    " via " +
    pluginName;
  return (
    <>
      <DropIndicator beforeId={id} column="queue" />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { skillName, id })}
        onClick={() => toggleSelectTask(id)} // Handle card selection toggle on click
        className={`cursor-grab rounded border p-3 active:cursor-grabbing ${
          isSelected ? "bg-neutral-700" : "bg-neutral-800"
        }`}
      >
        <p className="text-sm text-neutral-100">{text}</p>
      </motion.div>
    </>
  );
};

interface DropIndicatorProps {
  beforeId?: string | null;
  column: string;
}

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

export default QueueContainer;
