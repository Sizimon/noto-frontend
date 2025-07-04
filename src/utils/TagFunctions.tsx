'use client';

import { useTasks } from '../context/TasksProvider';
import { useTags } from '../context/TagsProvider';
import { Tag } from '../context/TagsProvider';

export function useHandleAddExistingTag() {
    const { allTasks, setAllTasks } = useTasks();
    const { addPendingTag } = useTags();

    return (taskId: number, tag: Tag) => {
        if (!tag || !tag.id || !tag.title) return;

        addPendingTag(taskId, tag);

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

export function useHandleRemoveTag() {
    const { allTasks, setAllTasks } = useTasks();
    const { addRemovedTag } = useTags();

    return (taskId: number, tagId: number) => {
        const updatedTasks = allTasks.map(task => {
            if (task.id === taskId) {
                const originalTags = task.tags || [];
                const newTags = originalTags.filter((tag: Tag) => tag.id !== tagId) || [];
                const removedTag = originalTags.find((tag: Tag) => tag.id === tagId);
                if (removedTag) addRemovedTag(taskId, removedTag);
                return { ...task, tags: newTags, dirty: true };
            }
            return task;
        });
        setAllTasks(updatedTasks);
    };
};

export function useHandleCreateTag() {
    const { allTasks, setAllTasks } = useTasks();
    const { tags, pendingTags, addPendingTag } = useTags();

    const colors = [
        'bg-amber-600', 'bg-blue-600', 'bg-green-600', 'bg-red-600', 'bg-purple-600',
        'bg-pink-600', 'bg-yellow-600', 'bg-teal-600', 'bg-indigo-600', 'bg-gray-600',
        'bg-orange-600', 'bg-lime-600', 'bg-cyan-600', 'bg-violet-600', 'bg-fuchsia-600'
    ]

    return (taskId: number, tagTitle: string) => {
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