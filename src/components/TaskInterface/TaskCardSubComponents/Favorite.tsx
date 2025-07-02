'use client';
import React from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Favorite({
    card,
    handleFavoriteToggle
}: any) {
    return (
        <div className='flex flex-row items-center space-x-2'>
            <span className='flex items-center'>
                <motion.button
                    className="cursor-default"
                    whileTap={{ scale: 0.7 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle(card.id);
                    }}
                >
                    {card.is_favorite ? (
                        <FaStar className='text-yellow-500 text-xl' />
                    ) : (
                        <FaRegStar className='text-yellow-500 text-xl' />
                    )}
                </motion.button>
            </span>
        </div>
    );
}