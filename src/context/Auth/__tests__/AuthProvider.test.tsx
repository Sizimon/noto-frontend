
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider, useAuth } from '../AuthProvider';

vi.mock('../../../connections/api', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
    me: vi.fn(),
    logout: vi.fn(),
  },
}));

import { authAPI } from '../../../connections/api';

describe('AuthProvider', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

  it('sets isAuthenticated to true on successful login', async () => {
    (authAPI.login as ReturnType<typeof vi.fn>).mockResolvedValue({ user: { id: 1, username: 'Test', email: 'test@example.com', lastViewedTasks: [] } });
    (authAPI.me as ReturnType<typeof vi.fn>).mockResolvedValue({ user: { id: 1, username: 'Test', email: 'test@example.com', lastViewedTasks: [] } });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({ id: 1, username: 'Test', email: 'test@example.com', lastViewedTasks: [] });
  });

  it('sets isAuthenticated to false on failed login', async () => {
    (authAPI.login as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Invalid credentials'));
    (authAPI.me as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Not authenticated'));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login('bad@example.com', 'wrong');
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('sets isAuthenticated to true on successful register', async () => {
    (authAPI.register as ReturnType<typeof vi.fn>).mockResolvedValue({ user: { id: 2, username: 'NewUser', email: 'new@example.com', lastViewedTasks: [] } });
    (authAPI.me as ReturnType<typeof vi.fn>).mockResolvedValue({ user: { id: 2, username: 'NewUser', email: 'new@example.com', lastViewedTasks: [] } });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.register('user123', 'new@example.com', 'password');
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({ id: 2, username: 'NewUser', email: 'new@example.com', lastViewedTasks: [] });
  });

  it('sets isAuthenticated to false on failed register', async () => {
    (authAPI.register as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Registration failed'));
    (authAPI.me as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Not authenticated'));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.register('user123', 'fail@example.com', 'password');
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('logs out the user and sets isAuthenticated to false', async () => {
    (authAPI.logout as ReturnType<typeof vi.fn>).mockResolvedValue({});
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
        result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });
});