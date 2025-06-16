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
    createTag: (id: string, tag: string) =>
        apiRequest(`/tasks/${id}/tags`, {
            method: 'POST',
            body: JSON.stringify({ tag }),
        })
    };

export const userAPI = {
    updateLastViewed: (data: [any]) => apiRequest('/user/last-viewed', {
        method: 'PUT',
        body: JSON.stringify({ lastViewed: data}),
    }),
};
