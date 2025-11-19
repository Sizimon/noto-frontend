'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CiMenuBurger } from "react-icons/ci";
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/Auth/AuthProvider';
import { ClipLoader } from 'react-spinners';
import DarkModeToggle from '@/theme/DarkModeToggle';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
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
                <CiMenuBurger className='w-6 h-6 uwq:w-10 uwq:h-10' />
            </button>
            {isAuthenticated && (
                    <div className="absolute top-4 right-4 z-30">
                    <DarkModeToggle />
                </div>
            )}
            <Navigation
                sidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
                sidebarRef={sidebarRef}
            />
            <main
                className={`flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'}`}
            >
                {children}
            </main>
        </div>
    );
};

export default Layout;