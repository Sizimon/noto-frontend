import React, { createContext, useContext, useState, useEffect } from 'react';
import { tasksAPI } from '@/connections/api';

export interface Tag {
    id: string; // Unique identifier for the tag
    dirty?: boolean; // Optional property to indicate if the tag has unsaved changes
    title: string;
    color: string;
}

interface TagsContextType {
    tags: Tag[];
    pendingTags: { [taskId: string]: Tag[] };
    removedTags: { [taskId: string]: Tag[] };
    refreshTags: () => Promise<void>;
    addPendingTag: (taskId: string, tag: Tag) => void;
    clearPendingTags: (taskId: string, tagId: string) => void;
    addRemovedTag: (taskId: string, tag: Tag) => void;
    clearRemovedTags: (taskId: string) => void;
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export const TagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [pendingTags, setPendingTags] = useState<{ [taskId: string]: Tag[] }>({});
    const [removedTags, setRemovedTags] = useState<{ [taskId: string]: Tag[] }>({});

    const addPendingTag = (taskId: string, tag: Tag) =>
  setPendingTags(prev => ({
    ...prev,
    [taskId]: prev[taskId] ? [...prev[taskId], tag] : [tag],
  }));

const clearPendingTags = (taskId: string, tagId: string) =>
  setPendingTags(prev => ({
    ...prev,
    [taskId]: prev[taskId]?.filter(tag => tag.id !== tagId) || [],
  }));

const addRemovedTag = (taskId: string, tag: Tag) =>
  setRemovedTags(prev => ({
    ...prev,
    [taskId]: prev[taskId] ? [...prev[taskId], tag] : [tag],
  }));

const clearRemovedTags = (taskId: string) =>
  setRemovedTags(prev => ({
    ...prev,
    [taskId]: [],
  }));

    const refreshTags = async () => {
        const data = await tasksAPI.getAllTags();
        setTags(data); // Adjust according to your API response
    };

    useEffect(() => { refreshTags(); }, []);

    return (
        <TagsContext.Provider value={{
            tags,
            pendingTags,
            removedTags,
            refreshTags,
            addPendingTag,
            clearPendingTags,
            addRemovedTag,
            clearRemovedTags
        }}>
            {children}
        </TagsContext.Provider>
    );
};

export const useTags = () => {
    const context = useContext(TagsContext);
    if (!context) throw new Error('useTags must be used within a TagsProvider');
    return context;
};