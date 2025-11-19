'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/connections/api';

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    isLoading: boolean;
    user: any;
    setUser: (user: any) => void;
    initialLastViewedTasks: number[];
    setInitialLastViewedTasks: (tasks: number[]) => void;
    login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<any>(null);
    const [initialLastViewedTasks, setInitialLastViewedTasks] = useState<number[]>([]);

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            try {
                const data = await authAPI.me();
                if (data && data.user) {
                    setIsAuthenticated(true);
                    setUser({
                        ...data.user,
                        lastViewedTasks: Array.isArray(data.user.lastViewedTasks)
                            ? data.user.lastViewedTasks.map(Number)
                            : [],
                    });
                    setInitialLastViewedTasks(Array.isArray(data.user.lastViewedTasks) ? data.user.lastViewedTasks.map(Number) : []);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (usernameOrEmail: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            await authAPI.login(usernameOrEmail, password);

            const data = await authAPI.me();
            if (!data) {
                throw new Error('No user data returned from API');
            }

            setUser({
                ...data.user,
                lastViewedTasks: Array.isArray(data.user.lastViewedTasks)
                    ? data.user.lastViewedTasks.map(Number)
                    : [],
            });
            console.log('User data:', {
                ...data.user,
                lastViewedTasks: Array.isArray(data.user.lastViewedTasks)
                    ? data.user.lastViewedTasks.map(Number)
                    : [],
            });
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: (error instanceof Error ? error.message : 'Login failed') };
        }
    };

    const register = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            await authAPI.register(username, email, password);

            const data = await authAPI.me();
            if (!data) {
                throw new Error('No user data returned from API');
            }

            setUser({
                ...data.user,
                lastViewedTasks: Array.isArray(data.user.lastViewedTasks)
                    ? data.user.lastViewedTasks.map(Number)
                    : [],
            });
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: (error instanceof Error ? error.message : 'Registration failed') };
        }
    };

    const logout = async () => {
        await authAPI.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated,
            isLoading,
            user,
            setUser,
            initialLastViewedTasks,
            setInitialLastViewedTasks,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};