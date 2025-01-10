import { useState } from "react";
import QueueContainer from "./queueContainer";
import QueueEditorContainer from "./queueEditorContainer";


const Queue = () => {
    // State for cards
    const [cards, setCards] = useState<QueueCard[]>(DEFAULT_CARDS);
    
    return (
        <div>
        <QueueContainer cards={cards} setCards={setCards} />
        <QueueEditorContainer setCards={setCards} />
        </div>
    );
};


// TODO: MOVE QUEUE TO SEPARATE CLASS

interface QueueCard {
    id: string;
    title: string;
    column: string;
  }
  
const DEFAULT_CARDS: QueueCard[] = [
    // QUEUE
    { title: "Woodcutting to 30", id: "1", column: "queue" },
    { title: "Crafting to 50", id: "2", column: "queue" },
    { title: "Hunter to 70", id: "3", column: "queue" },
];

export default Queue;
  