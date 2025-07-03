'use client';
import React from 'react';
import Favorite from './Favorite';

export default function Header({
    card,
}: any) {
    return (
        <>
            <div className='flex items-center justify-center col-span-1 py-2 h-full'>
                <Favorite
                    card={card}
                />
            </div>

            <div className='flex items-center justify-start w-full col-span-5 p-2 h-full'>
                <h2 title={card.title} className='text-base truncate'>{card.title}</h2>
            </div>
        </>
    );
}