'use client';

import { TasksProvider } from '@/context/Tasks/TasksProvider';
import { TagsProvider } from '@/context/Tags/TagsProvider';
import HistorySync from '@/components/GlobalFunctions/HistorySync';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <TasksProvider>
      <TagsProvider>
        {children}
        <HistorySync />
      </TagsProvider>
    </TasksProvider>
  );
}