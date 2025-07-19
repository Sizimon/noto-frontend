import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authAPI, tasksAPI, userAPI } from '../api';

const originalLocation = window.location;

describe('api.ts', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn();
    // Mock window.location for redirect test
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { href: '', pathname: '/' };
  });

  afterEach(() => {
    vi.resetAllMocks();
    // Restore only the properties we mocked
    window.location.href = originalLocation.href;
    window.location.pathname = originalLocation.pathname;
  });

  it('returns JSON on successful response', async () => {
    const mockData = { success: true };
    (fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData),
      headers: { get: () => 'application/json' },
    });

    const result = await authAPI.me();
    expect(result).toEqual(mockData);
  });

  it('redirects to /login on 401', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({}),
      headers: { get: () => 'application/json' },
    });

    // @ts-ignore
    window.location.pathname = '/not-login';
    await authAPI.me();
    expect(window.location.href).toBe('/login');
  });

  it('throws error on non-OK JSON response', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Bad request' }),
      headers: { get: () => 'application/json' },
    });

    await expect(authAPI.me()).rejects.toThrow('Bad request');
  });

  it('throws error on non-OK non-JSON response', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: () => Promise.resolve('Server exploded'),
      headers: { get: () => 'text/plain' },
    });

    await expect(authAPI.me()).rejects.toThrow('Server error: 500 - Internal Server Error');
  });

  it('throws and logs error on fetch failure', async () => {
    const error = new Error('Network error');
    (fetch as any).mockRejectedValue(error);

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(authAPI.me()).rejects.toThrow('Network error');
    expect(errorSpy).toHaveBeenCalledWith('API request error:', error);
    errorSpy.mockRestore();
  });

  it('calls correct endpoint and method for tasksAPI.create', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 1 }),
      headers: { get: () => 'application/json' },
    });

    await tasksAPI.create('note');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5006/api/tasks',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ type: 'note' }),
      })
    );
  });

  it('calls correct endpoint and method for userAPI.updateLastViewed', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      headers: { get: () => 'application/json' },
    });

    await userAPI.updateLastViewed([{ id: 1 }]);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5006/api/user/last-viewed',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ lastViewedTasks: [{ id: 1 }] }),
      })
    );
  });
});