'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

import { gsap } from 'gsap';

interface SidebarLinkProps {
    href: string;
    children: React.ReactNode;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, children }) => {
    const [hovered, setHovered] = useState(false);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bgRef.current) {
            gsap.to(bgRef.current, {
                width: hovered ? '100%' : 0,
                duration: 0.3,
                ease: 'power1.inOut',
            });
        }
    }, [hovered]);

    // Initial background width
    useEffect(() => {
        if (bgRef.current) {
            gsap.set(bgRef.current, { width: 0 });
        }
    }, []);

    return (
        <li
            className='relative overflow-hidden'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                ref={bgRef}
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
    const { isAuthenticated } = useAuth();

    return (
        <div
            ref={sidebarRef}
            className={`
                fixed top-0 left-0 h-full z-30
                bg-foreground text-default
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

            {/* User Actions */}
            <div className={`text-center ${sidebarOpen ? 'flex flex-col items-center justify-center' : 'hidden'} mb-8`}>
                <div className="flex flex-col w-4/6 gap-2 items-center">
                    {isAuthenticated ? (
                        <button
                            className='space-y-2 p-4 mb-8 w-full text-default bg-pop rounded-full cursor-pointer transition-all duration-300 hover:bg-amber-500'
                            onClick={logout}
                        >
                            Logout
                        </button>
                    ) : (
                        <p className="text-sm">
                            You are not logged in, login <a href="/login" className="text-pop hover:underline">here.</a>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Navigation;