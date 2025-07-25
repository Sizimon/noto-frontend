'use client';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Tag } from '@/context/Tags/TagsProvider'; // Adjust the import path as necessary
import { useHandleAddExistingTag } from '@/utils/TagFunctions';

export default function SuggestedTags({
    card,
    availableTags,
    setIsInputOpen,
    setNewTag,
    anchorRef
}: any) {
    const handleAddExistingTag = useHandleAddExistingTag();
    const menuRef = React.useRef<HTMLDivElement>(null);
    const [coords, setCoords] = React.useState<{ top: number, left: number }>({ top: 0, left: 0 });

    useEffect(() => {
        if (anchorRef?.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            let left = rect.left + window.scrollX;
            const menuWidth = 220;
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
        <div ref={menuRef} style={{ position: "absolute", top: coords.top, left: coords.left }}>
            <motion.div
                key="suggestions"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
                className="
                absolute left-0 top-full z-50 bg-background/95 rounded-xl shadow-lg mt-2 border-1 border-zinc-200 dark:border-zinc-800
                grid grid-flow-row grid-cols-2 md:grid-cols-3 gap-1 max-h-[200px] overflow-y-auto w-max max-w-[220px] md:max-w-[300px] py-1 px-1
            "
            >
                <div className="sticky top-0 col-span-2 md:col-span-3 p-2 border-b bg-background border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 uppercase tracking-wider">
                    Available Tags
                </div>
                {availableTags.map((tag: Tag) => (
                    <button
                        key={tag.id}
                        className={`
                        items-center px-3 py-1 my-0.5 rounded-lg transition cursor-pointer
                        hover:bg-${tag.color}/80 focus:bg-${tag.color}/
                        ${tag.color} text-xs text-default font-medium
                        hover:brightness-110 hover:scale-102 focus:outline-none
                        truncate
                    `}
                        style={{
                            maxWidth: "190px",
                        }}
                        title={tag.title}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddExistingTag(card.id, tag);
                            setIsInputOpen(false);
                            setNewTag('');
                        }}
                        type="button"
                    >
                        {tag.title}
                    </button>
                ))}
            </motion.div>
        </div>,
        typeof window !== 'undefined' ? document.body : (null as any) // Ensure the portal is only created in the browser
    );
}