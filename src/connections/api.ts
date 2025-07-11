const API_BASE_URL = 'http://localhost:5006/api';

// API REQUEST WRAPPER
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include', // Always send cookies for authentication
        ...options,
    };

    try {
        console.log(`Making API request to: ${API_BASE_URL}${endpoint}`, config);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // console.log('response status:', response.status);
        // console.log('response headers:', response.headers);

        if (response.status === 401) {
            // Redirect to login
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.href = '/login';
                return;
            }
        }

        if (!response.ok) {
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                console.error('API error response:', errorData);
                throw new Error(errorData.error || errorData.message || 'API request failed');
            } else {
                const text = await response.text();
                console.error('Non-JSON error response:', text);
                throw new Error(`Server error: ${response.status} - ${response.statusText}`);
            }
        }

        return response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }

};


// AUTH API ENDPOINTS
export const authAPI = {
    login: (usernameOrEmail: string, password: string) =>
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ usernameOrEmail, password }),
        }),
    register: (username: string, email: string, password: string) =>
        apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
        }),
    me: () =>
        apiRequest('/auth/me', {
            method: 'GET',
            credentials: 'include', // Include cookies for session management
        }),
    logout: () =>
        apiRequest('/auth/logout', {
            method: 'POST',
            credentials: 'include', // Include cookies for session management
        })
};

export const tasksAPI = {
    // TASKS API's
    create: (type: string) => 
        apiRequest('/tasks', {
            method: 'POST',
            body: JSON.stringify({ type }),
            credentials: 'include', // Include cookies for session management
        }),
    getAll: () =>
        apiRequest('/tasks/fetch', {
            method: 'GET',
            credentials: 'include', // Include cookies for session management
        }),
    edit: (id: number, data: any) =>
        apiRequest(`/tasks/edit/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            credentials: 'include', // Include cookies for session management
        }),
    delete: (id: number) =>
        apiRequest(`/tasks/delete/${id}`, {
            method: 'DELETE',
            credentials: 'include', // Include cookies for session management
        }),

    // TAGS API's
    getAllTags: () =>
        apiRequest('/tags/fetch', {
            method: 'GET',
            credentials: 'include', // Include cookies for session management
        }),
    createTag: (taskId: number, data: any) =>
        apiRequest(`/tasks/${taskId}/tags`, {
            method: 'POST',
            body: JSON.stringify(data),
            credentials: 'include', // Include cookies for session management
        }),
    addExistingTag: (taskId: number, tagId: number) =>
        apiRequest(`/tasks/${taskId}/tags/existing/${tagId}`, {
            method: 'POST',
            credentials: 'include', // Include cookies for session management
        }),
    removeTag: (taskId: number, tagId: number) =>
        apiRequest(`/tasks/${taskId}/tags/${tagId}`, {
            method: 'DELETE',
            credentials: 'include', // Include cookies for session management
        }),
    deleteTag: (tagId: number) =>
        apiRequest(`/tags/${tagId}`, {
            method: 'DELETE',
            credentials: 'include', // Include cookies for session management
        }),
    };

export const userAPI = {
    updateLastViewed: (data: [any]) => apiRequest('/user/last-viewed', {
        method: 'PUT',
        body: JSON.stringify({ lastViewedTasks: data}),
        credentials: 'include', // Include cookies for session management
    }),
};
