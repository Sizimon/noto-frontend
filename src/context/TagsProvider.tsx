import React, { createContext, useContext, useState, useEffect } from 'react';
import { tasksAPI } from '@/connections/api';

export interface Tag {
    id: string | number; // Unique identifier for the tag, can be a string or number
    dirty?: boolean; // Optional property to indicate if the tag has unsaved changes
    title: string;
    color: string;
}

const TagsContext = createContext<{ tags: Tag[]; refreshTags: () => Promise<void> } | undefined>(undefined);

export const TagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tags, setTags] = useState<Tag[]>([]);

    const refreshTags = async () => {
        const data = await tasksAPI.getAllTags();
        setTags(data.tags); // Adjust according to your API response
    };

    useEffect(() => { refreshTags(); }, []);

    return (
        <TagsContext.Provider value={{ tags, refreshTags }}>
            {children}
        </TagsContext.Provider>
    );
};

export const useTags = () => {
    const context = useContext(TagsContext);
    if (!context) throw new Error('useTags must be used within a TagsProvider');
    return context;
};