'use client';

import React, { useState, useRef, use, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag } from '@/context/Tags/TagsProvider';
import { FaPlus } from 'react-icons/fa';
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
            <div className='flex space-x-2 w-full md:overflow-x-auto md:no-scrollbar'>
                {/* Tags or Input */}
                <div className="flex-1 relative">
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
                                        flex w-full md:w-2/6 justify-start p-1 bg-foreground text-amber-600 rounded-lg focus:outline-none text-base
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
                                {/* Mobile: chips + dropdown */}
                                <div className="flex flex-row items-center gap-1 md:hidden relative">
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
                                                className="px-2 py-1 bg-gray-700 rounded-full text-base text-white cursor-pointer"
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
                                {/* Desktop: all tags as chips */}
                                <div className="hidden md:flex items-center overflow-x-auto whitespace-nowrap no-scrollbar gap-1">
                                    <AnimatePresence initial={false}>
                                        {card.tags.map((tag: Tag) => (
                                            <motion.span
                                                key={tag.id}
                                                className={`text-white px-2 py-1 ${tag.color} rounded-full cursor-default`}
                                                variants={tagVariants}
                                                initial="initial"
                                                animate="rest"
                                                exit="exit"
                                                whileHover="hover"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                {tag.title}
                                                <motion.button
                                                    type="button"
                                                    className="ml-1 inline md:hidden"
                                                    onClick={() => handleRemoveTag(card.id, tag.id)}
                                                >
                                                    <span className="text-xs">X</span>
                                                </motion.button>
                                                <motion.button
                                                    type="button"
                                                    className="hidden md:inline"
                                                    variants={{
                                                        rest: { width: 0, opacity: 0 },
                                                        hover: { width: 16, opacity: 1 },
                                                    }}
                                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                                    onClick={() => handleRemoveTag(card.id, tag.id)}
                                                >
                                                    <span className="text-xs">X</span>
                                                </motion.button>
                                            </motion.span>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
                {/* Add Tag Button */}
                <motion.button
                    type="button"
                    className="flex items-center p-1 text-pop rounded-lg overflow-hidden focus:outline-none cursor-default"
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsInputOpen(!isInputOpen);
                    }}
                >
                    <motion.span
                        variants={{
                            rest: { rotate: 0 },
                            hover: { rotate: 360 },
                        }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center"
                    >
                        <FaPlus className="text-sm" />
                    </motion.span>
                    <motion.span
                        variants={{
                            rest: { width: 0, opacity: 0, marginLeft: 0 },
                            hover: { width: "auto", opacity: 1, marginLeft: 8 },
                        }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="whitespace-nowrap overflow-hidden"
                        style={{ display: "inline-block" }}
                    >
                        Add Tags
                    </motion.span>
                </motion.button>
            </div>
        </div>
    );
}