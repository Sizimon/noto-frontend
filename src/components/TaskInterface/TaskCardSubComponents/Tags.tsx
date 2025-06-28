'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from '@/context/TasksProvider'; // Adjust the import path as necessary
import { FaPlus } from 'react-icons/fa';

export default function Tags({
    handleCreateTag,
    handleRemoveTag,
    isInputOpen,
    setIsInputOpen,
    newTag,
    setNewTag,
    card,
}: any) {
    console.log(card);
    return (
        <div className='flex items-center justify-center'>
            <div className='flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar'>
                {card.tags.map((tag: Tag, index: number) => (
                    <motion.span
                        key={index}
                        className={`
                            text-white px-2 py-1 ${tag.color} rounded cursor-default
                        `}
                        whileHover="hover"
                        initial="rest"
                        animate="rest"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent the click from propagating to the card
                        }}
                    >
                        {tag.title}
                        <motion.button
                            type="button"
                            className="whitespace-nowrap overflow-hidden ml-2 text-red-500 cursor-pointer"
                            onClick={() => {
                                handleRemoveTag(card.id, tag.id);
                            }}
                            variants={{
                                rest: { width: 0, opacity: 0, marginLeft: 0 },
                                hover: { width: "auto", opacity: 1, marginLeft: 8 },
                            }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                            X
                        </motion.button>
                    </motion.span>
                ))}
            </div>
            <motion.button
                className="text-amber-600 p-1 rounded-full"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent the click from propagating to the card
                    setIsInputOpen(!isInputOpen);
                }}
            >
                {isInputOpen ? (
                    <input
                        type="text"
                        value={newTag}
                        placeholder='Add a tag'
                        className="p-1 bg-zinc-100 rounded-lg focus:outline-none w-full
                        dark:bg-zinc-900
                        "
                        onChange={(e) => setNewTag(e.target.value)}
                        onClick={(e) => e.stopPropagation()} // Prevent the click from propagating to the card
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleCreateTag(card.id, newTag);
                                setIsInputOpen(false);
                                setNewTag(''); // Clear the input after adding the tag
                            }
                        }}
                    />
                ) : (
                    <div className="flex items-center">
                        <FaPlus className='text-sm cursor-pointer' />
                    </div>
                )}
            </motion.button>
        </div>
    )
}
