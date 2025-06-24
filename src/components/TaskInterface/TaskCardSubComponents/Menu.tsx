'use client';
import React from 'react';
import { FaRegStar, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';


export default function Menu({
    handleNoteMenuToggle
}: any) {
    return (
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
    )
}