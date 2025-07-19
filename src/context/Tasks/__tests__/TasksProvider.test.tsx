import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TasksProvider, useTasks } from '../TasksProvider';

vi.mock('@/connections/api', () => ({
  tasksAPI: {
    getAll: vi.fn(),
  },
}));

import { tasksAPI } from '@/connections/api';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TasksProvider>{children}</TasksProvider>
);

describe('TasksProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides initial empty tasks', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    expect(result.current.allTasks).toEqual([]);
  });

  it('refreshTasks fetches and sets tasks', async () => {
    const mockTasks = [
      { id: 1, user_id: 1, title: 'Task 1', type: 'note', content: '', is_favorite: false, tags: [], createdAt: '', updatedAt: '' },
      { id: 2, user_id: 1, title: 'Task 2', type: 'note', content: '', is_favorite: false, tags: [], createdAt: '', updatedAt: '' },
    ];
    (tasksAPI.getAll as ReturnType<typeof vi.fn>).mockResolvedValue({ notepads: mockTasks });

    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      await result.current.refreshTasks();
    });

    expect(result.current.allTasks).toEqual(mockTasks);
  });

  it('setAllTasks updates the tasks state', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    const newTasks = [
        { id: 1, user_id: 1, title: 'New Task', type: 'note', content: '', is_favorite: false, tags: [], createdAt: '', updatedAt: '' },
    ];

    act(() => {
      result.current.setAllTasks(newTasks);
    });

    expect(result.current.allTasks).toEqual(newTasks);
  });

  it('refreshTasks handles API errors gracefully', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (tasksAPI.getAll as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      await result.current.refreshTasks();
    });

    expect(result.current.allTasks).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith('Error fetching tasks:', expect.any(Error));

    errorSpy.mockRestore();
  });
});