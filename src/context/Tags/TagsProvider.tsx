'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { tasksAPI } from '@/connections/api';

export interface Tag {
  id: number; // Unique identifier for the tag
  dirty?: boolean; // Optional property to indicate if the tag has unsaved changes
  title: string;
  color: string;
}

interface TagsContextType {
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>; // Function to update the tags state
  pendingTags: { [taskId: number]: Tag[] };
  setPendingTags: React.Dispatch<React.SetStateAction<{ [taskId: number]: Tag[] }>>; // Function to update pending tags
  removedTags: { [taskId: number]: Tag[] };
  setRemovedTags: React.Dispatch<React.SetStateAction<{ [taskId: number]: Tag[] }>>; // Function to update removed tags
  refreshTags: () => Promise<void>;
  addPendingTag: (taskId: number, tag: Tag) => void;
  clearPendingTags: (taskId: number, tagId: number) => void;
  addRemovedTag: (taskId: number, tag: Tag) => void;
  clearRemovedTags: (taskId: number, tagId: number) => void;
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export const TagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [pendingTags, setPendingTags] = useState<{ [taskId: number]: Tag[] }>({});
  const [removedTags, setRemovedTags] = useState<{ [taskId: number]: Tag[] }>({});

  const addPendingTag = (taskId: number, tag: Tag) => // Expects the taskId and tag object
    setPendingTags(prev => ({
      ...prev, // Spread the previous state
      // If the taskId already exists, append the new tag; otherwise, create a new
      [taskId]: prev[taskId] ? [...prev[taskId], tag] : [tag],
    }));

  const clearPendingTags = (taskId: number, tagId: number) => // Expects the taskId and tagId to remove
    setPendingTags(prev => ({
      ...prev, // Spread the previous state
      // Filter out the tag with the specified tagId for the given taskId
      [taskId]: prev[taskId]?.filter(tag => tag.id !== tagId) || [],
    }));

  const addRemovedTag = (taskId: number, tag: Tag) => // Expects the taskId and tag object to be removed
    setRemovedTags(prev => ({
      ...prev, // Spread the previous state
      // If the taskId already exists, append the new tag; otherwise, create a new
      // array with the tag. This allows tracking which tags are marked for removal.
      [taskId]: prev[taskId] ? [...prev[taskId], tag] : [tag],
    }));

  const clearRemovedTags = (taskId: number, tagId: number) => // Expects the taskId and tagId to remove
    setRemovedTags(prev => ({
      ...prev,
      [taskId]: prev[taskId]?.filter(tag => tag.id !== tagId) || [], // Filter out the tag with the specified id
    }));

  const refreshTags = async () => {
    const data = await tasksAPI.getAllTags();
    setTags(data); // Adjust according to your API response
  };

  useEffect(() => { refreshTags(); }, []);

  return (
    <TagsContext.Provider value={{
      tags,
      setTags,
      pendingTags,
      setPendingTags,
      removedTags,
      setRemovedTags,
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