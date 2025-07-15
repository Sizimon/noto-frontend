'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthProvider';
import { ClipLoader } from 'react-spinners';
import DarkModeToggle from '@/theme/DarkModeToggle';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { isLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    const closeSidebar = () => {
        setSidebarOpen(false);
    }

    useEffect(() => {
        if (!sidebarOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                closeSidebar();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen]);

    return (
        <div className="flex-1 h-screen relative">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <ClipLoader color="#fbbf24" size={64} />
                </div>
            )}
            {/* Mobile Hamburger Button */}
            <button
                className="absolute top-4 left-4 z-30 p-2 text-default rounded cursor-pointer"
                onClick={toggleSidebar}
            >
                {/* Hamburger icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <div className="absolute top-4 right-4 z-30">
                <DarkModeToggle />
            </div>

            <Navigation
                sidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
                sidebarRef={sidebarRef}
            />
            <main
                className={`flex transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'}`}
            >
                {children}
            </main>
        </div>
    );
};

export default Layout;