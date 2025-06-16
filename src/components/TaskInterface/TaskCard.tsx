import { FaRegStickyNote } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import React from "react";

export default function TaskCard({
    card, creatingTagForId, setCreatingTagForId, newTag, setNewTag, handleCreateTag, handleTaskClick
}: any) {
    return (
        <div
            key={card.id}
            className='flex flex-col items-center text-center pt-4 rounded-lg shadow-lg mb-4 bg-zinc-200 w-full cursor-pointer dark:bg-zinc-900 md:w-10/12 transition-all duration-300 hover:shadow-xl hover:scale-105'
            onClick={() => handleTaskClick(card)}
        >
            <div className='flex flex-col items-center w-full justify-between mb-4 text-amber-600'>
                <div>
                    <div className='flex items-center justify-center'>
                        {card.type === 'note' && <FaRegStickyNote className='text-2xl md:text-3xl' />}
                    </div>
                    <div className='flex items-center'>
                        <h2 className='text-lg font-bold truncate'>{card.title}</h2>
                    </div>
                </div>
            </div>
            <ul className='flex flex-row justify-start items-start space-x-4 text-xs rounded-b-lg p-2 bg-zinc-100 text-zinc-600 w-full
            dark:text-zinc-300 dark:bg-zinc-800
            '>
                {!card.tags || card.tags.length === 0 ? (
                    creatingTagForId === card.id ? (
                        <form onSubmit={e => {
                            e.preventDefault();
                            if (newTag.trim()) handleCreateTag(card.id);
                        }}>
                            <input
                                type="text"
                                value={newTag}
                                onChange={e => setNewTag(e.target.value)}
                                placeholder="Enter new tag"
                                className='border rounded p-1 text-xs border-none bg-zinc-200 dark:bg-zinc-900 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-amber-500 transition-all duration-300'
                            />
                        </form>
                    ) : (
                        <button
                            className='bg-amber-600 text-zinc-100 p-1 rounded-lg cursor-pointer'
                            onClick={e => {
                                e.stopPropagation();
                                setCreatingTagForId(card.id);
                            }}
                        >
                            <FaPlus className='inline-block mr-1' />
                            Add tags
                        </button>
                    )
                ) : (
                    <div className='flex flex-row space-x-2'>
                        {card.tags.map((tag: string, index: number) => (
                            <span key={index} className='bg-amber-600 text-white text-xs font-semibold px-2 py-1 rounded'>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </ul>
        </div>
    );
}