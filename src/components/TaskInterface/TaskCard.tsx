import { FaEllipsisVertical } from "react-icons/fa6";
import React, { useState } from "react";

import Tags from "./TaskCardSubComponents/Tags";
import Menu from "./TaskCardSubComponents/Menu";
import Header from "./TaskCardSubComponents/Header";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

export function handleTaskClick(card: any, router: any, setUser: (user: any) => void) {
    // Navigate to the task details page
    router.push(`/tasks/${card.id}`);

    // Update localStorage with the last viewed task
    const userStorage = localStorage.getItem('user');
    let user = userStorage ? JSON.parse(userStorage) : null;
    if (user) {
        if (!Array.isArray(user.lastViewedTasks)) user.lastViewedTasks = [];

        user.lastViewedTasks = user.lastViewedTasks.filter((id: string) => id !== card.id); // Remove the task if it already exists
        user.lastViewedTasks.unshift(card.id); // Add the task to the front of the array
        if (user.lastViewedTasks.length > 10) user.lastViewed.pop(); // Limit to the last 10 viewed tasks
        localStorage.setItem('user', JSON.stringify(user)); // Update the user in local storage
        setTimeout(() => setUser({ ...user }), 750); //  750ms DELAY | Update the user state in context
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
    // console.log(card);
    const { setUser } = useAuth(); // Context hook to access user data
    const router = useRouter(); // Next.js router for navigation
    const [isInputOpen, setIsInputOpen] = useState(false); // State to manage the visibility of the input for adding tags
    const [newTag, setNewTag] = useState<string>(''); // State to hold the new tag input
    return (
        
        <div // MAIN TASK CARD CONTAINER (CLICKABLE TO OPEN NOTE EDITOR)
            key={card.id}
            className={`
                ${card.id === noteMenuOpen ? 'z-20' : 'hover:shadow-xl'}
                grid grid-flow-col grid-cols-16 
                items-center text-center mb-4 rounded-lg shadow-lg bg-zinc-200 w-full cursor-pointer
                transition-all duration-300 ease-in-out
                dark:bg-zinc-900 
                md:w-10/12
                `}
            onClick={() => handleTaskClick(card, router, setUser)} // Click handler to open the note editor
        >
            <div 
                className='grid grid-flow-col grid-cols-6 col-span-6 items-center text-center w-full h-full bg-white text-amber-600 rounded-l-lg
              dark:bg-zinc-800 dark:text-amber-600'>
                <Header 
                    card={card}
                    handleFavoriteToggle={handleFavoriteToggle}
                 />
            </div>
            <div className='relative flex flex-row justify-between items-center text-xs p-2 bg-white text-zinc-600 w-full col-span-10 h-full rounded-r-lg
            dark:text-zinc-300 dark:bg-zinc-800'>
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
                    className='text-amber-600 p-1 rounded-full cursor-pointer'
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