'use client';

import React, { useState, useEffect } from "react";
import { FaSortAlphaDown, FaRegClock, FaStar, FaCaretDown } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

import { Tag } from '@/context/Tags/TagsProvider'; // Importing the Tag type from TagsProvider context
import { Task } from '@/context/Tasks/TasksProvider'; // Importing the Task type from TasksProvider context
import { useTags } from "@/context/Tags/TagsProvider";
import { useTasks } from "@/context/Tasks/TasksProvider";
import { useHandleDeleteTag } from "@/utils/TagFunctions";


export default function SortAndTagsMenu({
    openMenu, // State to control which menu is open ('sort' or 'tags')
    searchInput, // Search input value to filter tasks
    handleSortMenuToggle, // Function to toggle the sort menu visibility
    handleTagsMenuToggle, // Function to toggle the tags menu visibility
    setFilteredTasks, // Function to update the filtered tasks in the parent component
}: any) {
    // CONTEXT HOOKS
    const { allTasks } = useTasks(); // Get all tasks from the TasksProvider context
    const { tags } = useTags(); // Get all tags from the TagsProvider context
    // ------------------------------------------

    const [sortOrder, setSortOrder] = useState<string>('alphabetical'); // Current sort order state
    const [selectedTags, setSelectedTags] = useState<number[]>([]); // State to hold selected tags for filtering tasks
    // console.log(selectedTags);
    // console.log(allTasks);
    const handleDeleteTag = useHandleDeleteTag(); // Hook to handle tag deletion


    // Function to sort tasks based on the selected order
    const sortTasks = (tasks: Task[], order: string) => {
        switch (order) {
            case 'alphabetical':
                return tasks.sort((a, b) => a.title.localeCompare(b.title));
            case 'date':
                return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            case 'favorite':
                return tasks.filter(task => task.is_favorite);
            default:
                return tasks; // If no valid order is specified, return the tasks as is
        }
    }

    // Effect to filter and sort tasks whenever the dependencies change
    useEffect(() => {
        // Whenever allTasks or sortOrder changes, we re-filter and sort the tasks
        let tagFilteredTasks = allTasks;
        if (selectedTags.length > 0) {
            tagFilteredTasks = allTasks.filter(task =>
                task.tags && selectedTags.some(tagId => task.tags?.some((tag: Tag) => tag.id === tagId))
            );
        }

        const searchTermFilteredTasks = tagFilteredTasks.filter(task =>
            task.title.toLowerCase().includes(searchInput.toLowerCase())
        );

        const sortedTasks = sortTasks([...searchTermFilteredTasks], sortOrder);
        setFilteredTasks(sortedTasks ?? []);

    }, [allTasks, searchInput, sortOrder, selectedTags]);

    return (
        <div className='flex flex-row items-center justify-center space-x-4'>
            {/* Sort */}
            <div className="relative items-center gap-2">
                <button
                    className="flex text-sm items-center font-semibold uppercase text-default cursor-pointer hover:text-pop transition-all duration-300"
                    onClick={handleSortMenuToggle}
                >
                    Sort
                    <FaCaretDown />
                </button>

                {openMenu === 'sort' && (
                    <div
                        className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-2 w-52 md:w-60 bg-background rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-0"
                        onMouseLeave={handleSortMenuToggle}
                    >
                        {/* Heading */}
                        <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 uppercase tracking-wider">
                            Sort Options
                        </div>
                        <div className="flex flex-col gap-2 px-2 py-2">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="alphabetical"
                                    className="accent-pop"
                                    checked={sortOrder === 'alphabetical'}
                                    onChange={() => setSortOrder('alphabetical')}
                                />
                                <FaSortAlphaDown className="text-pop" />
                                <span>Alphabetical</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="date"
                                    className="accent-pop"
                                    checked={sortOrder === 'date'}
                                    onChange={() => setSortOrder('date')}
                                />
                                <FaRegClock className="text-pop" />
                                <span>Newest First</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="favorite"
                                    className="accent-pop"
                                    checked={sortOrder === 'favorite'}
                                    onChange={() => setSortOrder('favorite')}
                                />
                                <FaStar className="text-pop" />
                                <span>Favorites Only</span>
                            </label>
                        </div>
                    </div>
                )}
            </div>
            {/* Tags */}
            <div className="relative items-center gap-2">
                <button
                    className="flex text-sm items-center font-semibold uppercase text-default cursor-pointer
                    hover:text-pop transition-all duration-300
                    "
                    onClick={handleTagsMenuToggle}
                >
                    Tags
                    <FaCaretDown />
                </button>
                {openMenu === 'tags' && (
                    <div
                        className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-2 max-h-[200px] overflow-y-auto w-52 md:w-60 bg-background rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-0"
                        onMouseLeave={handleTagsMenuToggle}
                    >
                        {/* Heading */}
                        <div className="sticky top-0 px-4 py-2 border-b bg-background border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 uppercase tracking-wider z-50">
                            Tag Filters
                        </div>
                        <div className="flex flex-col gap-1 px-2 py-2">
                            {tags.length > 0 ? (
                                tags.map((tag: any) => (
                                    <div key={tag.id} className="flex items-center group">
                                        <label
                                            key={tag.id}
                                            className="flex w-full items-center gap-2 cursor-pointer rounded px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedTags.includes(tag.id)}
                                                onChange={() => {
                                                    if (selectedTags.includes(tag.id)) {
                                                        setSelectedTags(selectedTags.filter((id) => id !== tag.id));
                                                    } else {
                                                        setSelectedTags([...selectedTags, tag.id]);
                                                    }
                                                }}
                                                className="accent-pop"
                                            />
                                            <span
                                                className={`flex truncate px-2 py-1 rounded text-xs text-default ${tag.color}`}
                                            >
                                                {tag.title}
                                            </span>
                                        </label>
                                        <button
                                            type="button"
                                            className="ml-2 text-base text-red-400 opacity-60 cursor-pointer group-hover:opacity-100 hover:text-red-600 transition"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTag(tag.id);
                                            }}
                                            tabIndex={0}
                                        >
                                            <FaRegTrashCan />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-zinc-400 px-2">No tags available</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}