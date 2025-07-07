import { FaEllipsisVertical } from "react-icons/fa6";
import React, { useState } from "react";

import Tags from "./TaskCardSubComponents/Tags";
import Menu from "./TaskCardSubComponents/Menu";
import Header from "./TaskCardSubComponents/Header";

export default function TaskCard({
    card,
    noteMenuOpen, 

    // Handlers
    handleNoteMenuToggle, 
    handleTaskClick, 
    handleFavoriteToggle,
    handleCreateTag,
}: any) {
    // console.log(card);
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
            onClick={() => handleTaskClick(card)}
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