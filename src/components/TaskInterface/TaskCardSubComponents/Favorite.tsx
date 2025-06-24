'use client';
import React from 'react';
import { FaRegStar } from 'react-icons/fa';

export default function Favorite({
    card,
    handleFavoriteToggle
}: any) {
    return (
        <div className='flex flex-row items-center space-x-2'>
            <span className='flex items-center'>
                <button // BUTTON TO TOGGLE FAVORITE STATUS
                    className="cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent the click from propagating to the card (card has onClick which opens the note)
                        handleFavoriteToggle(card.id);
                    }}>
                    <FaRegStar className='text-yellow-500 text-xl' /></button>
                <span className='ml-1'>{card.is_favorite ? 'Favorite' : 'Not Favorite'}</span>
            </span>
        </div>
    )
}