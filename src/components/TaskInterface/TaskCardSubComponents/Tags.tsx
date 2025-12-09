'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag } from '@/context/Tags/TagsProvider';
import { useTags } from '@/context/Tags/TagsProvider';
import SuggestedTags from './SuggestedTags';
import MobileTagDropdown from './MobileTagDropdown';
import { useHandleRemoveTag, useHandleCreateTag } from '@/utils/TagFunctions';

export default function Tags({
    isInputOpen,
    setIsInputOpen,
    newTag,
    setNewTag,
    card,
}: any) {
    const { tags } = useTags();
    const availableTags = tags.filter(
        (tag: Tag) => !card.tags.some((t: Tag) => t.id === tag.id)
    );
    const [showMobileDropdown, setShowMobileDropdown] = useState(false);
    const handleRemoveTag = useHandleRemoveTag();
    const handleCreateTag = useHandleCreateTag();
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const tagVariants = {
        rest: { opacity: 1, scale: 1, x: 0 },
        hover: { opacity: 1, scale: 1, x: 0 },
        initial: { opacity: 0, scale: 0.6, x: 20 },
        exit: { opacity: 0, scale: 0.6, x: -20 },
    };

    // Mobile: show up to 2 tags, then +N Tags
    const maxMobileVisible = 1;
    const visibleMobileTags = card.tags.slice(0, maxMobileVisible);
    const hiddenMobileCount = card.tags.length - maxMobileVisible;

    useEffect(() => {
        if (hiddenMobileCount === 0) {
            setShowMobileDropdown(false);
        }
    }, [hiddenMobileCount]);

    return (
        <div className='flex items-center justify-start'>
            <div className='flex space-x-2 w-full'>
                {/* Tags or Input */}
                <div className="flex relative w-full">
                    <AnimatePresence mode="wait" initial={false}>
                        {isInputOpen ? (
                            <>
                                <motion.input
                                    ref={inputRef}
                                    key="tag-input"
                                    type="text"
                                    value={newTag}
                                    placeholder="Add a tag"
                                    className="
                                        flex w-full justify-start p-1 bg-foreground text-amber-600 rounded-lg focus:outline-none
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
                                />
                                <AnimatePresence>
                                    {availableTags.length > 0 && (
                                        <SuggestedTags
                                            card={card}
                                            availableTags={availableTags}
                                            setIsInputOpen={setIsInputOpen}
                                            setNewTag={setNewTag}
                                            anchorRef={inputRef}
                                        />
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <>
                                {/* Universal Tags Display */}
                                <div className="flex flex-row items-center gap-1 relative">
                                    {visibleMobileTags.map((tag: Tag) => (
                                        <span
                                            key={tag.id}
                                            className={`text-white px-2 py-1 ${tag.color} rounded-full cursor-default whitespace-nowrap overflow-hidden`}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            {tag.title}
                                            <button
                                                type="button"
                                                className="ml-1"
                                                onClick={() => handleRemoveTag(card.id, tag.id)}
                                            >
                                                <span className="text-xs">X</span>
                                            </button>
                                        </span>
                                    ))}
                                    {hiddenMobileCount > 0 && (
                                        <span
                                            ref={dropdownRef}
                                            key="more"
                                            className="px-2 py-1 bg-gray-700 rounded-full text-xs text-white cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowMobileDropdown(v => !v);
                                            }}
                                        >
                                            +{hiddenMobileCount}
                                        </span>
                                    )}
                                    <AnimatePresence>
                                        {showMobileDropdown && (
                                            <MobileTagDropdown
                                                card={card}
                                                handleRemoveTag={handleRemoveTag}
                                                anchorRef={dropdownRef}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}