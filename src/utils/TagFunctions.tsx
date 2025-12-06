'use client';
import { useCallback } from 'react';
import { useTasks } from '../context/Tasks/TasksProvider';
import { useTags } from '../context/Tags/TagsProvider';
import { Tag } from '../context/Tags/TagsProvider';
import { tasksAPI } from '../connections/api';

const colors = [
    'bg-amber-600', 'bg-blue-600', 'bg-green-600', 'bg-red-600', 'bg-purple-600',
    'bg-pink-600', 'bg-yellow-600', 'bg-teal-600', 'bg-indigo-600', 'bg-gray-600',
    'bg-orange-600', 'bg-lime-600', 'bg-cyan-600', 'bg-violet-600', 'bg-fuchsia-600'
];

// Function to pick a random color for a new tag
// This function checks the existing tags and pending tags to ensure that the color is unique.
function pickColor(tags: Tag[]): string | undefined {
    const usedColors = [
        ...tags.map(tag => tag.color),
    ];
    const availableColors = colors.filter(color => !usedColors.includes(color));
    if (availableColors.length === 0) {
        console.error('No available colors left.');
        return undefined;
    }
    return availableColors[Math.floor(Math.random() * availableColors.length)];
}

// Function to handle creating a new tag for a task
// This function checks if the tag title is valid, generates a random color for the tag,
// and adds the tag to both the task and the pending tags in context.
// It also ensures that the total number of tags does not exceed 15.
export function useHandleCreateTag() {
    const { setAllTasks } = useTasks();
    const { tags, setTags, pendingTags } = useTags();

    return async (taskId: number, tagTitle: string) => {
        if (tags.length + Object.values(pendingTags).flat().length >= 15) {
            alert('You cannot have more than 15 tags.');
            return;
        }
        if (!tagTitle || tagTitle.trim() === '') return;
        if (tagTitle.length > 15) {
            alert('Tag title is too long.');
            return;
        }
        try {
            const newTag = await tasksAPI.createTag(taskId, {
                title: tagTitle.toUpperCase(),
                color: pickColor(tags)
            });

            if (!newTag) {
                console.error('Failed to create tag.');
                return;
            }

            // Update the tags state with the new tag
            // This ensures that the tag is available in the UI immediately.
            setTags(prev => [...prev, newTag.tag]);

            // Update the task's tags in the context state
            // This ensures that the task reflects the new tag immediately.
            setAllTasks(prev =>
                prev.map(task =>
                    task.id === taskId
                        ? { ...task, tags: [...(task.tags || []), newTag.tag] }
                        : task
                )
            );
        } catch (error) {
            console.error('Error creating tag:', error);
            alert('Failed to create tag. Please try again.');
            return;
        }
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


// export function useHandleRemoveTag() {
//     const { allTasks, setAllTasks } = useTasks();
//     const { pendingTags, addRemovedTag, clearPendingTags } = useTags();

//     return (taskId: number, tagId: number) => {
//         const task = allTasks.find(task => task.id === taskId);
//         const originalTags = task?.tags || [];

//         // If the tag is in pending tags, clear it (undo pending add)
//         if (pendingTags[taskId]?.some((tag: Tag) => tag.id === tagId)) {
//             clearPendingTags(taskId, tagId);
//         } else {
//             // Otherwise, mark it for removal (to be synced)
//             const tagToRemove = originalTags.find((tag: Tag) => tag.id === tagId);
//             if (tagToRemove) {
//                 addRemovedTag(taskId, tagToRemove);
//             }
//         }

//         // Remove the tag from the task's tags array and mark task as dirty
//         const newTags = originalTags.filter((tag: Tag) => tag.id !== tagId);
//         const updatedTasks = allTasks.map(task =>
//             task.id === taskId
//                 ? { ...task, tags: newTags, dirty: true }
//                 : task
//         );
//         setAllTasks(updatedTasks);
//     };
// }

export function useHandleRemoveTag() {
    const { clearPendingTags, addRemovedTag } = useTags();
    const { allTasks, setAllTasks } = useTasks();

    return useCallback(async (taskId: number, tagId: number) => {
        console.log('🏷️ Removing tag:', { taskId, tagId }); // Add this
        
        // Find the tag to mark as removed
        const task = allTasks.find(t => t.id === taskId);

        if (!task || !task.tags) {
            console.warn('Task or tags not found:', { taskId, hasTask: !!task, hasTags: !!task?.tags });
            return;
        }

        const tagToRemove = task?.tags.find(t => t.id === tagId);
        
        if (!tagToRemove) {
            console.warn('Tag not found in task:', { taskId, tagId });
            return;
        }

        // Immediate UI update
        setAllTasks(prev => prev.map(t => 
            t.id === taskId 
                ? { 
                    ...t, 
                    tags: (t.tags || []).filter(tag => tag.id !== tagId), 
                    dirty: true 
                  }
                : t
        ));

        // Mark for server sync
        addRemovedTag(taskId, tagToRemove);
        clearPendingTags(taskId, tagId);
        
        console.log('🏷️ Tag marked for removal:', { taskId, tagId, tagTitle: tagToRemove.title }); // Add this
    }, [allTasks, setAllTasks, addRemovedTag, clearPendingTags]);
}

// Function to handle deleting a tag
// This function removes the tag from the context state and attempts to delete it from the server.
// It filters out the tag by its ID and updates the tags state accordingly.
// Full deletion will be handled immediately, and will not use the sync mechanism.
export function useHandleDeleteTag() {
    const { tags, setTags } = useTags();

    return async (tagId: number) => {
        if (!tagId) return;

        // Update the tags state by filtering out the tag with the specified ID
        // This ensures that the tag is removed from the UI immediately. (NEED TO ALSO DELETE THE TAG FROM ALL TASKS IT IS ATTACHED TOO ON THE UI)
        const updatedTags = tags.filter(tag => tag.id !== tagId);
        setTags(updatedTags);
        try {
            await tasksAPI.deleteTag(tagId);
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    };
}
