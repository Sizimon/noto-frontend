'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

interface SidebarLinkProps {
    href: string;
    children: React.ReactNode;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, children }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <li
            className='relative overflow-hidden'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: hovered ? '100%' : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute left-0 top-0 h-full bg-amber-600 z-0"
            />
            <Link
                href={href}
                className="relative z-10 block px-4 py-2 transition-colors duration-150"
            >
                {children}
            </Link>
        </li>
    )
};

interface NavigationProps {
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
    sidebarRef: React.RefObject<HTMLDivElement | null>;
}

const Navigation: React.FC<NavigationProps> = ({
    sidebarOpen,
    onToggleSidebar,
    sidebarRef,
}) => {
    const { logout } = useAuth();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { isAuthenticated } = useAuth();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    return (
        <div
            ref={sidebarRef}
            className={`
                fixed top-0 left-0 h-full z-30
                bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-white
                transition-all duration-300
                ${sidebarOpen ? 'w-64' : 'w-0'}
                md:flex md:flex-col md: justify-between
            `}
        >
            <div>
                {/* Navigation Links */}
                <nav className={`p-4 ${sidebarOpen ? 'block' : 'hidden'}`}>
                    <ul className="space-y-2">
                        { isAuthenticated ? (
                        <ul className="space-y-2">
                            <SidebarLink href="/">Home</SidebarLink>
                            <SidebarLink href="/about">About</SidebarLink>
                        </ul>
                        ) : (
                        <ul className="space-y-2">
                            <SidebarLink href="/">Home</SidebarLink>
                            <SidebarLink href="/about">About</SidebarLink>
                            <SidebarLink href="/login">Login</SidebarLink>
                            <SidebarLink href="/register">Register</SidebarLink>
                        </ul>
                        )}
                    </ul>
                </nav>
            </div>

            {/* Dark Mode Toggle & Logout */}
            <div className={`text-center ${sidebarOpen ? 'flex flex-col items-center justify-center' : 'hidden'} mb-8`}>
                <div className="w-4/6">
                    <button
                        className='space-y-2 p-4 mb-4 w-full bg-zinc-300 dark:bg-zinc-900 rounded cursor-pointer transition-all duration-300 hover:bg-zinc-200 hover:dark:bg-zinc-800'
                        onClick={toggleTheme}
                    >
                        Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
                    </button>
                    {isAuthenticated ? (
                        <button
                            className='space-y-2 p-4 mb-8 w-full text-white bg-amber-600 rounded cursor-pointer transition-all duration-300 hover:bg-amber-500'
                            onClick={logout}
                        >
                            Logout
                        </button>
                    ) : (
                        <p className="text-sm">
                            You are not logged in, login <a href="/login" className="text-amber-600 hover:underline">here.</a>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Navigation;