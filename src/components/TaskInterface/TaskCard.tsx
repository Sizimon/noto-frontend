import { FaRegStickyNote, FaRegStar, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";
import React from "react";

export default function TaskCard({
    card, noteMenuOpen, handleNoteMenuToggle, handleTaskClick, handleFavoriteToggle
}: any) {
    return (
        <div
            key={card.id}
            className={`
                ${card.id === noteMenuOpen ? 'z-20' : 'hover:shadow-xl'}
                grid grid-flow-col grid-cols-16 items-center text-center mb-4 rounded-lg shadow-lg bg-zinc-200 w-full
                transition-all duration-300 ease-in-out
                dark:bg-zinc-900 
                md:w-10/12
                `}
            onClick={() => handleTaskClick(card)}
        >
            <div className='grid grid-flow-col grid-cols-8 col-span-8 items-center text-center w-full h-full bg-white text-amber-600 rounded-l-lg
            dark:bg-zinc-800 dark:text-amber-600
            '>
                <div className='
                flex items-center justify-center col-span-1 py-2 h-full
            
            '>
                    {card.type === 'note' && <FaRegStickyNote className='text-2xl md:text-3xl' />}
                </div>
                <div className='
                flex items-center justify-start w-full col-span-7 p-2 h-full
            '>
                    <h2 className='text-lg font-bold truncate'>{card.title}</h2>
                </div>
            </div>
            <div className='relative flex flex-row justify-between items-center text-xs p-2 bg-white text-zinc-600 w-full col-span-8 h-full rounded-r-lg
            dark:text-zinc-300 dark:bg-zinc-800
            '>
                <div className='flex flex-row items-center space-x-2'>
                    <span className='flex items-center'>
                        <button 
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the click from propagating to the card (card has onClick which opens the note)
                                handleFavoriteToggle(card.id);
                            }}
                        >
                            <FaRegStar className='text-yellow-500 text-xl' /></button>
                        <span className='ml-1'>{card.is_favorite ? 'Favorite' : 'Not Favorite'}</span>
                    </span>
                    {card.tags && card.tags.length > 0 && (
                        <span className='flex items-center'>
                            Tags: {card.tags.join(', ')}
                        </span>
                    )}
                </div>
                <button
                    className='text-amber-600 p-1 rounded-full cursor-pointer'
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent the click from propagating to the card (card has onClick which opens the note)
                        handleNoteMenuToggle(card.id);
                    }}
                >
                    <FaEllipsisVertical  className="text-xl"/>
                </button>
                {card.id === noteMenuOpen && (
                    <div
                        className='absolute right-0 top-10 bg-zinc-100 shadow-lg rounded-lg p-4 w-32 z-30
                        dark:bg-zinc-900'
                        onClick={(e) => e.stopPropagation()} // Prevent click from closing the menu
                        onMouseLeave={() => handleNoteMenuToggle('')} // Close menu on mouse leave
                    >
                        <ul className='space-y-4'>
                            <span 
                                className='flex flex-row justify-center items-center cursor-pointer hover:text-amber-600'
                                
                            >
                                <li>Set Favorite</li><FaRegStar className='inline-block ml-1' />
                            </span>
                            <span className='flex flex-row justify-center items-center cursor-pointer hover:text-amber-600'>
                                <li>Add Tags</li><FaRegEdit className='inline-block ml-1' />
                            </span>
                            <span className='flex flex-row justify-center items-center cursor-pointer hover:text-amber-600'>
                                <li>Delete Note</li><FaRegTrashAlt className='inline-block ml-1' />
                            </span>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}