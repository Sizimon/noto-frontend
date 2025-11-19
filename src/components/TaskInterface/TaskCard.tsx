import { FaEllipsisVertical } from "react-icons/fa6";
import React, { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";

import { Task } from "@/context/Tasks/TasksProvider";

import Tags from "./TaskCardSubComponents/Tags";
import Menu from "./TaskCardSubComponents/Menu";
import Header from "./TaskCardSubComponents/Header";
import { useAuth } from "@/context/Auth/AuthProvider";
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
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (

        <div // MAIN TASK CARD CONTAINER (CLICKABLE TO OPEN NOTE EDITOR)
            key={card.id}
            className={`
                ${card.id === noteMenuOpen ? 'z-20' : 'hover:shadow-xl'}
                grid grid-flow-col grid-cols-16 px-2 md:px-0 
                items-center text-center mb-4 rounded-lg shadow-lg bg-background w-full cursor-pointer
                transition-all duration-300 ease-in-out
                
                `}
            onClick={() => handleTaskClick(card, router, user, setUser)} // Click handler to open the note editor
        >
            <div className='flex flex-row col-span-6 items-center justify-start text-center w-full h-full bg-background text-pop rounded-l-lg px-4'>
                <Header
                    card={card}
                    handleFavoriteToggle={handleFavoriteToggle}
                />
            </div>
            <div className="flex flex-row items-center overflow-x-auto justify-start col-span-6 h-full text-xs no-scrollbar">
                <Tags
                    card={card}
                    isInputOpen={isInputOpen}
                    setIsInputOpen={setIsInputOpen}
                    newTag={newTag}
                    setNewTag={setNewTag}
                    handleCreateTag={handleCreateTag}
                />
            </div>
            <div className='relative flex flex-row justify-end items-center text-xs p-2 bg-background text-default min-w-0 col-span-4 h-full rounded-r-lg'>
                <div className="flex flex-row space-x-4 items-center justify-center">
                    <motion.button
                        type="button"
                        className="flex items-center p-1 text-pop rounded-lg overflow-hidden focus:outline-none cursor-default"
                        whileHover="hover"
                        initial="rest"
                        animate="rest"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsInputOpen(!isInputOpen);
                        }}
                    >
                        <motion.span
                            variants={{
                                rest: { rotate: 0 },
                                hover: { rotate: 360 },
                            }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center"
                        >
                            <FaPlus className="text-sm" />
                        </motion.span>
                        <motion.span
                            variants={{
                                rest: { width: 0, opacity: 0, marginLeft: 0 },
                                hover: { width: "auto", opacity: 1, marginLeft: 8 },
                            }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="whitespace-nowrap overflow-hidden"
                            style={{ display: "inline-block" }}
                        >
                            Add Tags
                        </motion.span>
                    </motion.button>
                    <button
                        ref={buttonRef}
                        className='text-pop p-1 rounded-full cursor-pointer'
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent the click from propagating to the card (card has onClick which opens the note)
                            handleNoteMenuToggle(card.id);
                        }}
                    >
                        <FaEllipsisVertical className="text-xl" />
                    </button>
                </div>
                {card.id === noteMenuOpen && (
                    <Menu // NOTE MENU COMPONENT
                        handleNoteMenuToggle={handleNoteMenuToggle}
                        card={card}
                        anchorRef={buttonRef}
                    />
                )}
            </div>
        </div>
    );
}