'use client';

import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Tag } from '@/context/Tags/TagsProvider';

export default function MobileTagDropdown({ card, handleRemoveTag, anchorRef }: any) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = React.useState<{ top: number, left: number }>({ top: 0, left: 0 });

    useEffect(() => {
        if (anchorRef?.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            let left = rect.left + window.scrollX;
            const menuWidth = 160; // w-40 = 160px
            const viewportWidth = window.innerWidth;
            // If the menu would overflow, adjust left
            if (left + menuWidth > viewportWidth - 8) { // 8px margin
                left = viewportWidth - menuWidth - 8;
            }
            setCoords({
                top: rect.bottom + window.scrollY,
                left,
            });
        }
    }, [anchorRef]);

    return createPortal(
        <motion.div
            ref={menuRef}
            style={{
                position: 'absolute',
                top: coords.top,
                left: coords.left,
                zIndex: 9999,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="absolute left-0 top-full z-50 bg-background rounded-xl shadow-lg mt-2 border-1 border-zinc-200 dark:border-zinc-800
                flex flex-col gap-1 max-h-[160px] overflow-hidden w-36"
        >
            <div className="sticky top-0 p-2 border-b bg-background border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 uppercase tracking-wider z-10">
                Note Tags
            </div>
            <div className='py-1 px-2 overflow-y-auto'>
                {card.tags.map((tag: Tag) => (
                    <div
                        key={tag.id}
                        className={`flex items-center justify-between mb-1 px-2 py-1 rounded ${tag.color} text-xs text-white`}
                    >
                        <span className="truncate">{tag.title}</span>
                        <button
                            type="button"
                            className="ml-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTag(card.id, tag.id);
                            }}
                        >
                            <span className="text-xs">X</span>
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>,
        typeof window !== 'undefined' ? document.body : (null as any) // Ensure the portal is only created in the browser
    );
}