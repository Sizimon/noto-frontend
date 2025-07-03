import React, { useState, useEffect } from "react";
import { FaCaretDown } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

import { Tag } from '@/context/TagsProvider'; // Importing the Tag type from TagsProvider context
import { Task } from '@/context/TasksProvider'; // Importing the Task type from TasksProvider context
import { useTags } from "@/context/TagsProvider";
import { useTasks } from "@/context/TasksProvider";


export default function SortAndTagsMenu({
    searchInput,
    sortMenuOpen, // State boolean to control the visibility of the sort menu
    handleSortMenuToggle, // Function to toggle the sort menu visibility
    tagsMenuOpen, // State boolean to control the visibility of the tags menu
    handleTagsMenuToggle, // Function to toggle the tags menu visibility
    setFilteredTasks, // Function to update the filtered tasks in the parent component
}: any) {
    // CONTEXT HOOKS
    const { allTasks } = useTasks(); // Get all tasks from the TasksProvider context
    const { tags } = useTags(); // Get all tags from the TagsProvider context
    // ------------------------------------------
    
    const [sortOrder, setSortOrder] = useState<string>('alphabetical'); // Current sort order state
    const [selectedTags, setSelectedTags] = useState<string[]>([]); // State to hold selected tags for filtering tasks
    // console.log(selectedTags);
    // console.log(allTasks);


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
                    className="flex text-sm items-center font-semibold uppercase text-black cursor-pointer hover:text-amber-600 transition-all duration-300 dark:text-white"
                    onClick={handleSortMenuToggle}
                >
                    Sort
                    <FaCaretDown />
                </button>
                {sortMenuOpen && (
                    <div
                        className="absolute z-50 left-0 top-full mt-2 w-32 bg-zinc-100 text-black rounded shadow-lg p-2
                        dark:bg-zinc-800 dark:text-white
                        md:w-48
                        "
                        onMouseLeave={handleSortMenuToggle}
                    >
                        <label className="flex items-center gap-1 text-xs">
                            <input type="radio" name="sort" value="alphabetical" className="accent-amber-600"
                                checked={sortOrder === 'alphabetical'}
                                onChange={() => setSortOrder('alphabetical')} /> A-Z
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                            <input type="radio" name="sort" value="date" className="accent-amber-600"
                                checked={sortOrder === 'date'}
                                onChange={() => setSortOrder('date')} /> Date Created
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                            <input type="radio" name="sort" value="favorite" className="accent-amber-600"
                                checked={sortOrder === 'favorite'}
                                onChange={() => setSortOrder('favorite')} /> Filter by favorites.
                        </label>
                    </div>
                )}
            </div>
            {/* Tags */}
            <div className="relative items-center gap-2">
                <button
                    className="flex text-sm items-center font-semibold uppercase text-black cursor-pointer
                    hover:text-amber-600 transition-all duration-300
                    dark:text-white
                    "
                    onClick={handleTagsMenuToggle}
                >
                    Tags
                    <FaCaretDown />
                </button>
                {tagsMenuOpen && (
                    <div
                        className="absolute z-50 left-0 top-full mt-2 w-32 bg-zinc-200 dark:bg-zinc-800 py-2 text-white rounded shadow-lg
                        dark:text-white
                        md:w-64
                        "
                        onMouseLeave={handleTagsMenuToggle}
                    >
                        <div className="flex flex-col gap-1 px-2 py-1">
                            {tags.length > 0 ? (
                                tags.map((tag: any) => (
                                    <div key={tag.id}
                                        className="flex items-center group">
                                        <label
                                            key={tag.id}
                                            className="flex w-full items-center gap-2 cursor-pointer rounded px-2 py-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
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
                                                className="accent-amber-600"
                                            />
                                            <span
                                                className={`flex truncate px-2 py-1 rounded text-xs text-white ${tag.color}`}
                                            >
                                                {tag.title}
                                            </span>
                                        </label>
                                        <button
                                            type="button"
                                            className="ml-2 text-base text-red-400 opacity-60 cursor-pointer group-hover:opacity-100 hover:text-red-600 transition"
                                            // onClick={() => handleDeleteTag(tag.id)}
                                            tabIndex={0}
                                        >
                                            <FaRegTrashCan />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-500 px-2">No tags available</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}