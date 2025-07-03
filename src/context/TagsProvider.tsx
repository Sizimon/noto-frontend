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
    pendingTags: Tag[];
    removedTags: Tag[];
    refreshTags: () => Promise<void>;
    addPendingTag: (tag: Tag) => void;
    clearPendingTags: (tagId: string | number) => void;
    addRemovedTag: (tag: Tag) => void;
    clearRemovedTags: () => void;
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export const TagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [pendingTags, setPendingTags] = useState<Tag[]>([]);
    const [removedTags, setRemovedTags] = useState<Tag[]>([]);

    const addPendingTag = (tag: Tag) => setPendingTags(prev => [...prev, tag]);
    const clearPendingTags = (tagId: string | number) =>
        setPendingTags(prev => prev.filter(tag => tag.id !== tagId));
    const addRemovedTag = (tag: Tag) => setRemovedTags(prev => [...prev, tag]);
    const clearRemovedTags = () => setRemovedTags([]);

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