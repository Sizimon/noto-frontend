'use client';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaRegTrashAlt } from 'react-icons/fa';

import { useHandleDeleteTask } from '@/utils/TaskFunctions'; // Importing the hook to handle task deletion

export default function Menu({
    card,
    handleNoteMenuToggle,
    anchorRef,
}: any) {
    const handleDeleteTask = useHandleDeleteTask();
    const menuRef = React.useRef<HTMLDivElement>(null);
    const [coords, setCoords] = React.useState<{ top: number, left: number }>({ top: 0, left: 0 });

    useEffect(() => {
        if (anchorRef?.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
            });
        }
    }, [anchorRef]);

    return createPortal(
        <div
            ref={menuRef}
            style={{
                position: 'absolute',
                top: coords.top,
                left: coords.left,
                zIndex: 9999,
            }}
            className="bg-background shadow-xl rounded-xl w-44 border border-zinc-200 dark:border-zinc-800 cursor-default"
            onClick={e => e.stopPropagation()}
            onMouseLeave={() => handleNoteMenuToggle('')}
        >
            <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 uppercase tracking-wider">
                Note Actions
            </div>
            <div className="flex flex-col py-1">
                {/* Example future action */}
                <button
                    className="flex items-center gap-2 px-4 py-2 text-default hover:bg-foreground transition rounded-none text-sm cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent the click from propagating to the card
                        handleDeleteTask(card.id)
                        handleNoteMenuToggle(''); // Close the menu after deletion
                    }}
                >
                    <FaRegTrashAlt className="text-red-400" />
                    Delete
                </button>
                {/* Add more actions here */}
                {/* <button className="...">Edit</button> */}
                {/* <button className="...">Duplicate</button> */}
            </div>
        </div>,
        typeof window !== 'undefined' ? document.body : (null as any) // Ensure the portal is only created in the browser
    )
}