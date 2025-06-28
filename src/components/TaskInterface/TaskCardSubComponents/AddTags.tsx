'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

export default function AddTags({
    card,
    isInputOpen,
    setIsInputOpen,
    newTag,
    setNewTag,
    handleCreateTag
}: any) {
    return (
        <motion.div className='flex items-center justify-center'>
            {isInputOpen ? (
                <motion.input
                    type="text"
                    value={newTag}
                    placeholder="Add a tag"
                    className="p-1 bg-zinc-100 text-amber-600 rounded-lg focus:outline-none max-w-1/5
                    dark:bg-zinc-900
                    "
                    onChange={(e) => setNewTag(e.target.value)}
                    onClick={(e) => e.stopPropagation()} // Prevent the click from propagating to the card
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleCreateTag(card.id, newTag);
                            setIsInputOpen(false);
                            setNewTag(''); // Clear the input after adding the tag
                        }
                    }}
                    autoFocus
                />
            ) : (
                <motion.button
                    type="button"
                    className="flex items-center p-1 text-amber-600 rounded-lg overflow-hidden focus:outline-none cursor-pointer"
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent the click from propagating to the card (card has onClick which opens the note)
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
            )}
        </motion.div>
    )
}