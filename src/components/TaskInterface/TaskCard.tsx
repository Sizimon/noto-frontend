import { FaRegStickyNote } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";
import React from "react";

export default function TaskCard({
    card, noteMenuOpen, handleNoteMenuToggle, handleTaskClick
}: any) {
    return (
        <div
            key={card.id}
            className={`
                ${card.id === noteMenuOpen ? 'z-20' : 'hover:shadow-xl hover:scale-[101%]'}
                grid grid-flow-col grid-cols-16 items-center text-center mb-4 rounded-lg shadow-lg bg-zinc-200 w-full
                transition-all duration-300 ease-in-out
                dark:bg-zinc-900 
                md:w-10/12
                `}
            onClick={() => handleTaskClick(card)}
        >
            <div className='flex items-center justify-center col-span-1 py-2 h-full'>
                {card.type === 'note' && <FaRegStickyNote className='text-2xl md:text-3xl' />}
            </div>
            <div className='flex items-center justify-start w-full col-span-7 p-2 h-full'>
                <h2 className='text-lg font-bold truncate'>{card.title}</h2>
            </div>
            <div className='relative flex flex-row justify-end items-center text-xs p-2 bg-amber-600 text-zinc-600 w-full col-span-8 h-full rounded-r-lg
            dark:text-zinc-300 dark:bg-zinc-800
            '>
                <button
                    className='bg-zinc-100 text-amber-600 p-1 rounded-full cursor-pointer'
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent the click from propagating to the card
                        handleNoteMenuToggle(card.id);
                    }}
                >
                    <FaEllipsisVertical />
                </button>
                {card.id === noteMenuOpen && (
                    <div className='absolute right-0 top-10 bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-2 w-32 z-30'>
                        <ul className='space-y-2'>
                            <li className='cursor-pointer hover:text-amber-600'>Edit</li>
                            <li className='cursor-pointer hover:text-amber-600'>Delete</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}