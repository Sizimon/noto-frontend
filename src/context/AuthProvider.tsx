'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/connections/api';

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    isLoading: boolean;
    user: any;
    setUser: (user: any) => void;
    login: (usernameOrEmail: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));
        }
        setIsLoading(false);
    }, []);

    const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
        try {
            const data = await authAPI.login(usernameOrEmail, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false; // Propagate error to caller
        }
    };

    const register = async (username: string, email: string, password: string): Promise<boolean> => {
        try {
            const data = await authAPI.register(username, email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error('Register error:', error);
            return false; // Propagate error to caller
        }
    };

    const logout = () => {
        console.log('Logging out...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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