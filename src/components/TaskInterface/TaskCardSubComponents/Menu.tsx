'use client';
import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';

import { useHandleDeleteTask } from '@/utils/TaskFunctions'; // Importing the hook to handle task deletion

export default function Menu({
    card,
    handleNoteMenuToggle
}: any) {
    const handleDeleteTask = useHandleDeleteTask();

    return (
        <div
            className="absolute right-0 top-10 bg-background shadow-xl rounded-xl w-44 z-50 border border-zinc-200 dark:border-zinc-800 cursor-default"
            onClick={e => e.stopPropagation()}
            onMouseLeave={() => handleNoteMenuToggle('')}
        >
            <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 uppercase tracking-wider">
                Note Actions
            </div>
            <div className="flex flex-col py-1">
                {/* Example future action */}
                <button
                    className="flex items-center gap-2 px-4 py-2 text-default hover:bg-foreground transition rounded-none text-sm cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent the click from propagating to the card
                        handleDeleteTask(card.id)
                        handleNoteMenuToggle(''); // Close the menu after deletion
                    }}
                >
                    <FaRegTrashAlt className="text-red-400" />
                    Delete
                </button>
                {/* Add more actions here */}
                {/* <button className="...">Edit</button> */}
                {/* <button className="...">Duplicate</button> */}
            </div>
        </div>
    )
}