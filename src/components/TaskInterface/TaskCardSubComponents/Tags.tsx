'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from '@/context/TasksProvider'; // Adjust the import path as necessary

export default function Tags({
    card,
}: any) {
    return (
        <div>
            {card.tags.map((tag: Tag, index: number) => (
                <motion.span
                    key={index}
                    className={`px-2 py-1 ${tag.color} rounded cursor-default`}
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
    )
}