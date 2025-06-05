import React, { useState, useRef, useEffect } from 'react';
import Navigation from '@/components/Navigation';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
            {/* Mobile Hamburger Button */}
            <button
                className="absolute top-4 left-4 z-30 p-2 text-zinc-900 dark:text-white rounded cursor-pointer"
                onClick={toggleSidebar}
            >
                {/* Hamburger icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

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