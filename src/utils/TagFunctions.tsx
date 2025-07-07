'use client';

import { useTasks } from '../context/TasksProvider';
import { useTags } from '../context/TagsProvider';
import { Tag } from '../context/TagsProvider';
import { tasksAPI } from '../connections/api';

// Function to handle creating a new tag for a task
// This function checks if the tag title is valid, generates a random color for the tag,
// and adds the tag to both the task and the pending tags in context.
// It also ensures that the total number of tags does not exceed 15.
export function useHandleCreateTag() {
    const { allTasks, setAllTasks } = useTasks();
    const { tags, pendingTags, addPendingTag } = useTags();

    const colors = [
        'bg-amber-600', 'bg-blue-600', 'bg-green-600', 'bg-red-600', 'bg-purple-600',
        'bg-pink-600', 'bg-yellow-600', 'bg-teal-600', 'bg-indigo-600', 'bg-gray-600',
        'bg-orange-600', 'bg-lime-600', 'bg-cyan-600', 'bg-violet-600', 'bg-fuchsia-600'
    ]

    return (taskId: number, tagTitle: string) => {
        if (tags.length + Object.values(pendingTags).flat().length >= 15) {
            alert('You cannot have more than 15 tags.');
            return;
        }
        if (!tagTitle || tagTitle.trim() === '') return;
        if (tagTitle.length > 15) {
            alert('Tag title is too long.');
            return;
        }

        // Combine used colors from both synced and pending tags
        const usedColors = [
            ...tags.map(tag => tag.color),
            ...Object.values(pendingTags).flat().map(tag => tag.color)
        ];
        const availableColors = colors.filter(color => !usedColors.includes(color));
        if (availableColors.length === 0) {
            console.error('No available colors left.');
            return;
        }

        const color = availableColors[Math.floor(Math.random() * availableColors.length)];

        const newTag = {
            id: Date.now(),
            dirty: true,
            title: tagTitle.toUpperCase(),
            color: color
        };

        // Add to pending tags in context
        addPendingTag(taskId, newTag);

        const updatedTasks = allTasks.map(task => {
            if (task.id === taskId) {
                const newTags = task.tags ? [...task.tags, newTag] : [newTag];
                return { ...task, tags: newTags, dirty: true };
            }
            return task;
        });
        setAllTasks(updatedTasks);
    };
}


// Function to handle adding an existing tag to a task
// This function checks if the tag is already associated with the task, and if not, adds it.
// It also handles the case where the tag was previously marked for removal, unmarking it
// and adding it back to the task's tags. (Ensures consistency before syncing with the server)
export function useHandleAddExistingTag() {
    const { allTasks, setAllTasks } = useTasks();
    const { removedTags, clearRemovedTags, addPendingTag } = useTags();

    return (taskId: number, tag: Tag) => {
        if (!tag || !tag.id || !tag.title) return;

        // If the tag was marked for removal, unmark it
        if (removedTags[taskId]?.some((t: Tag) => t.id === tag.id)) {
            clearRemovedTags(taskId, tag.id);
        } else {
            addPendingTag(taskId, tag);
        }

        const updatedTasks = allTasks.map(task => {
            if (task.id === taskId) {
                const hasTag = task.tags && task.tags.some((t: Tag) => t.id === tag.id);
                if (hasTag) return task; // If the tag already exists, do not add
                const newTags = task.tags ? [...task.tags, tag] : [tag];
                return { ...task, tags: newTags, dirty: true };
            }
            return task;
        });
        setAllTasks(updatedTasks);
    };
}

// Function to handle removing a tag from a task
// This function checks if the tag is already marked for removal in pending tags.
// If it is, it clears the pending tag. If not, it adds the tag to the removed tags.
// It then updates the task's tags by filtering out the removed tag and marks the task as dirty.
// This ensures that the UI reflects the changes immediately while keeping the data consistent.
export function useHandleRemoveTag() {
    const { allTasks, setAllTasks } = useTasks();
    const { pendingTags, addRemovedTag, clearPendingTags } = useTags();

    return (taskId: number, tagId: number) => {
        const task = allTasks.find(task => task.id === taskId);
        const originalTags = task?.tags || [];
        const removedTag = originalTags.find((tag: Tag) => tag.id === tagId);

        if (pendingTags[taskId]?.some((tag: Tag) => tag.id === tagId)) {
            clearPendingTags(taskId, tagId);
        } else if (removedTag) {
            addRemovedTag(taskId, removedTag);
        }

        const newTags = originalTags.filter((tag: Tag) => tag.id !== tagId);
        const updatedTasks = allTasks.map(task =>
            task.id === taskId
                ? { ...task, tags: newTags, dirty: true }
                : task
        );
        setAllTasks(updatedTasks);
    };
};

// Function to handle deleting a tag
// This function removes the tag from the context state and attempts to delete it from the server.
// It filters out the tag by its ID and updates the tags state accordingly.
// Full deletion will be handled immediately, and will not use the sync mechanism.
export function useHandleDeleteTag() {
    const { tags, setTags } = useTags();

    return async (tagId: number) => {
        if (!tagId) return;

        const updatedTags = tags.filter(tag => tag.id !== tagId);
        setTags(updatedTags);
        try {
            await tasksAPI.deleteTag(tagId);
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    };
}
