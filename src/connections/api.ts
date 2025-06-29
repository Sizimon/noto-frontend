const API_BASE_URL = 'http://localhost:5006/api';

// Utility function to get the auth token from localStorage
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

// API REQUEST WRAPPER

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        console.log(`Making API request to: ${API_BASE_URL}${endpoint}`, config);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        console.log('response status:', response.status);
        console.log('response headers:', response.headers);

        if (response.status === 401) {
            // Remove invalid token and user
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login
            if (typeof window !== 'undefined') {
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
};

export const tasksAPI = {
    create: (type: string) => 
        apiRequest('/tasks', {
            method: 'POST',
            body: JSON.stringify({ type }),
        }),

    getAll: () =>
        apiRequest('/tasks/fetch', {
            method: 'GET',
        }),
    edit: (id: string, data: any) =>
        apiRequest(`/tasks/edit/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    createTag: (taskId: string, data: any) =>
        apiRequest(`/tasks/${taskId}/tags`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    removeTag: (taskId: string, tagId: string | number) =>
        apiRequest(`/tasks/${taskId}/tags/${tagId}`, {
            method: 'DELETE',
        })
    };

export const userAPI = {
    updateLastViewed: (data: [any]) => apiRequest('/user/last-viewed', {
        method: 'PUT',
        body: JSON.stringify({ lastViewedTasks: data}),
    }),
};
