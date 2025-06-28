'use client';
import React from 'react';
import { FaRegStickyNote } from 'react-icons/fa';

export default function Header({ card }: any) {
    return (
        <>
            <div className='flex items-center justify-center col-span-1 py-2 h-full'>
                {card.type === 'note' && <FaRegStickyNote className='text-xl md:text-2xl' />}
            </div>
            <div className='flex items-center justify-start w-full col-span-5 p-2 h-full'>
                <h2 className='text-base truncate'>{card.title}</h2>
            </div>
        </>
    );
}