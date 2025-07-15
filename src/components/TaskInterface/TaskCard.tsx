import { FaEllipsisVertical } from "react-icons/fa6";
import React, { useState } from "react";

import { Task } from "@/context/TasksProvider";

import Tags from "./TaskCardSubComponents/Tags";
import Menu from "./TaskCardSubComponents/Menu";
import Header from "./TaskCardSubComponents/Header";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

export function handleTaskClick(
    card: Task,
    router: any,
    user: any,
    setUser: (user: any) => void
) {
    // Navigate to the task details page
    router.push(`/tasks/${card.id}`);

    // Update lastViewedTasks in context (and optionally backend)
    if (user) {
        const cardId = card.id;
        let lastViewedTasks = Array.isArray(user.lastViewedTasks) 
        ? [...user.lastViewedTasks] 
        : [];
        lastViewedTasks = lastViewedTasks.filter((id: number) => id !== cardId);
        lastViewedTasks.unshift(cardId);
        if (lastViewedTasks.length > 10) lastViewedTasks = lastViewedTasks.slice(0, 10);

        const updatedUser = { ...user, lastViewedTasks };
        setUser(updatedUser);
        console.log(lastViewedTasks);
    }
}

export default function TaskCard({
    card,
    noteMenuOpen, 

    // Handlers
    handleNoteMenuToggle, 
    handleFavoriteToggle,
    handleCreateTag,
}: any) {
    console.log(card);
    const { user, setUser } = useAuth(); // Context hook to access user data
    const router = useRouter(); // Next.js router for navigation
    const [isInputOpen, setIsInputOpen] = useState(false); // State to manage the visibility of the input for adding tags
    const [newTag, setNewTag] = useState<string>(''); // State to hold the new tag input
    console.log(card.type)
    return (
        
        <div // MAIN TASK CARD CONTAINER (CLICKABLE TO OPEN NOTE EDITOR)
            key={card.id}
            className={`
                ${card.id === noteMenuOpen ? 'z-20' : 'hover:shadow-xl'}
                grid grid-flow-col grid-cols-16 
                items-center text-center mb-4 rounded-lg shadow-lg bg-background w-full cursor-pointer
                transition-all duration-300 ease-in-out
                md:w-10/12
                `}
            onClick={() => handleTaskClick(card, router, user, setUser)} // Click handler to open the note editor
        >
            <div 
                className='grid grid-flow-col grid-cols-6 col-span-6 items-center text-center w-full h-full bg-background text-pop rounded-l-lg'>
                <Header 
                    card={card}
                    handleFavoriteToggle={handleFavoriteToggle}
                 />
            </div>
            <div className='relative flex flex-row justify-between items-center text-xs p-2 bg-background text-default w-full col-span-10 h-full rounded-r-lg'>
                <div className="flex-1 flex-row mx-2 space-x-2"> 
                        <Tags 
                            card={card} 
                            isInputOpen={isInputOpen} 
                            setIsInputOpen={setIsInputOpen} 
                            newTag={newTag} 
                            setNewTag={setNewTag} 
                            handleCreateTag={handleCreateTag}
                        />
                </div>
                <button
                    className='text-pop p-1 rounded-full cursor-pointer'
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent the click from propagating to the card (card has onClick which opens the note)
                        handleNoteMenuToggle(card.id);
                    }}
                >
                    <FaEllipsisVertical className="text-xl" />
                </button>
                {card.id === noteMenuOpen && (
                    <Menu // NOTE MENU COMPONENT
                        handleNoteMenuToggle={handleNoteMenuToggle}
                        card={card}
                    />
                )}
            </div>
        </div>
    );
}