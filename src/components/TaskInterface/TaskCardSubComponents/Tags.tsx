'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag } from '@/context/TagsProvider'; // Adjust the import path as necessary
import { FaPlus } from 'react-icons/fa';
import { useTags } from '@/context/TagsProvider'; // Importing the Tags context

import { useHandleRemoveTag, useHandleCreateTag, useHandleAddExistingTag } from '@/utils/TagFunctions';

export default function Tags({
    isInputOpen,
    setIsInputOpen,
    newTag,
    setNewTag,
    card,
}: any) {
    const { tags } = useTags(); // Get all tags from the TagsProvider context
    const availableTags = tags.filter(
        (tag: Tag) => !card.tags.some((t: Tag) => t.id === tag.id)
    );

    const tagVariants = {
        rest: { opacity: 1, scale: 1, x: 0 },
        hover: { opacity: 1, scale: 1, x: 0 },
        initial: { opacity: 0, scale: 0.6, x: 20 },
        exit: { opacity: 0, scale: 0.6, x: -20 },
    };
    const handleRemoveTag = useHandleRemoveTag();
    const handleCreateTag = useHandleCreateTag();
    const handleAddExistingTag = useHandleAddExistingTag();
    return (
        <div className='flex items-center justify-start'>
            <div className='flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar'>
                <AnimatePresence initial={false}>
                    {card.tags.map((tag: Tag, index: number) => (
                        <motion.span
                            key={tag.id ?? index}
                            className={`text-white p-1 ${tag.color} rounded cursor-default`}
                            variants={tagVariants}
                            initial="initial"
                            animate="rest"
                            exit="exit"
                            whileHover="hover"
                            onClick={e => e.stopPropagation()}
                        >
                            {tag.title}
                            <motion.button
                                type="button"
                                className="whitespace-nowrap overflow-hidden cursor-default"
                                onClick={() => handleRemoveTag(card.id, tag.id)}
                                variants={{
                                    rest: { width: 0, opacity: 0 },
                                    hover: { width: 16, opacity: 1 },
                                }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                                <span className="text-xs ml-1">X</span>
                            </motion.button>
                        </motion.span>
                    ))}
                </AnimatePresence>
                <div className="relative" style={{ minWidth: 32 }}>
                    <AnimatePresence mode="wait" initial={false}>
                        {isInputOpen ? (
                            <motion.div>
                                <motion.input
                                    key="tag-input"
                                    type="text"
                                    value={newTag}
                                    placeholder="Add a tag"
                                    className="
                                p-1 bg-zinc-100 text-amber-600 rounded-lg focus:outline-none w-full 
                                dark:bg-zinc-900
                                "
                                    onChange={e => setNewTag(e.target.value)}
                                    onClick={e => e.stopPropagation()}
                                    onKeyDown={e => {
                                        if (e.key === "Enter") {
                                            handleCreateTag(card.id, newTag);
                                            setIsInputOpen(false);
                                            setNewTag('');
                                        }
                                    }}
                                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    autoFocus
                                    style={{ minWidth: 80, maxWidth: 120 }}
                                />
                                {availableTags.length > 0 && (
                                    <div>
                                        {availableTags.map((tag: Tag) => (
                                            <button
                                                key={tag.id}
                                                className={`flex w-full items-center px-2 py-1 text-xs ${tag.color} rounded hover:bg-zinc-100 dark:hover:bg-zinc-700`}
                                                onClick={() => {
                                                    handleAddExistingTag(card.id, tag); // WILL NEED NEW HANDLER FOR ADDING TAGS (NOT CREATING THEM)
                                                    setIsInputOpen(false);
                                                    setNewTag('');
                                                }}
                                                type="button"
                                            >
                                                {tag.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.button
                                type="button"
                                className="flex items-center p-1 text-amber-600 rounded-lg overflow-hidden focus:outline-none cursor-default"
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
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
