"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import ChevronIcon from "../dropdown/chevronIcon";
import Dropdown from "../dropdown/dropdown";
import { QueueCard } from "./queue";

// Define types for Card and ColumnProps

interface ColumnProps {
  title: string;
  headingColor: string;
  cards: QueueCard[];
  column: string;
  setCards: Dispatch<SetStateAction<QueueCard[]>>;
}

export interface Button {
  label: string;
  onClick: () => void; // The onClick function
}

const QueueContainer = ({ cards, setCards }: { cards: QueueCard[], setCards: React.Dispatch<React.SetStateAction<QueueCard[]>> }) => {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const toggleSelectCard = (id: string) => {
    setSelectedCards((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id); // Deselect if already selected
      } else {
        return [...prevSelected, id]; // Select if not selected
      }
    });
  };

  const handleRemoveSelectedCards = () => {
    setCards((prevCards) => prevCards.filter((card) => !selectedCards.includes(card.id))); // Remove selected cards
    setSelectedCards([]); // Clear selected cards after removal
  };

  return (
    <Dropdown
      title="Queue"
      icon={<ChevronIcon isOpen={false} />}
      content={
        <Board 
          cards={cards} 
          setCards={setCards} 
          selectedCards={selectedCards} 
          toggleSelectCard={toggleSelectCard} 
        />
      }
      buttons={
        selectedCards.length > 0 // Show the "Remove" button only if there are selected cards
          ? [
              {
                label: "Remove",
                onClick: handleRemoveSelectedCards, // Attach removal function
              },
            ]
          : undefined
      }
    />
  );
};

const Board = ({ cards, setCards, selectedCards, toggleSelectCard }: { cards: QueueCard[]; setCards: Dispatch<SetStateAction<QueueCard[]>>; selectedCards: string[]; toggleSelectCard: (id: string) => void }) => {
  return (
    <div className="flex h-full w-full gap-3">
      <Column
        title="Queue"
        column="queue"
        headingColor="text-neutral-500"
        cards={cards}
        setCards={setCards}
        selectedCards={selectedCards}
        toggleSelectCard={toggleSelectCard}
      />
    </div>
  );
};

const Column = ({
  cards,
  column,
  setCards,
  selectedCards,
  toggleSelectCard,
}: ColumnProps & { selectedCards: string[]; toggleSelectCard: (id: string) => void }) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: QueueCard) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");
    setActive(false);
    clearHighlights();
    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";
    if (before !== cardId) {
      let copy = [...cards];
      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };
      copy = copy.filter((c) => c.id !== cardId);
      const moveToBack = before === "-1";
      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;
        copy.splice(insertAtIndex, 0, cardToTransfer);
      }
      setCards(copy);
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

  const getNearestIndicator = (e: React.DragEvent<HTMLElement>, indicators: HTMLElement[]) => {
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
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`)) as HTMLElement[];
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-full shrink-0">
      <div className="flex items-center justify-between"></div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/0"}`}
      >
        {filteredCards.map((c) => {
          return (
            <Card
              key={c.id}
              {...c}
              handleDragStart={handleDragStart}
              isSelected={selectedCards.includes(c.id)}  // Pass the selected state to Card
              toggleSelectCard={toggleSelectCard}  // Pass the toggle function to Card
            />
          );
        })}
        <DropIndicator beforeId={null} column={column} />
      </div>
    </div>
  );
};

interface CardProps {
  title: string;
  id: string;
  column: string;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, card: QueueCard) => void;
  isSelected: boolean;
  toggleSelectCard: (id: string) => void;
}

const Card = ({ title, id, column, handleDragStart, isSelected, toggleSelectCard }: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        onClick={() => toggleSelectCard(id)} // Handle card selection toggle on click
        className={`cursor-grab rounded border p-3 active:cursor-grabbing ${isSelected ? 'bg-neutral-700' : 'bg-neutral-800'}`}
      >
        <p className="text-sm text-neutral-100">{title}</p>
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

// TODO: Buttons to do (Modify (import/export, add/remove to queue), deploy (send to cloud, rate limit this)
// TODO: Move add/remove card to where queue is
// TODO: Attach a skill to Card (to display icon, as well as lvl target/duration)

export default QueueContainer;