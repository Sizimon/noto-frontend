'use client';
import React, { useEffect } from 'react';
import Layout from '../Layout';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/Auth/AuthProvider';
import Link from 'next/link';
import DarkVeil from '@/blocks/Backgrounds/DarkVeil/DarkVeil';
import NotoLogo from '@/components/Logo';
import AboutSection from '@/components/AboutSection';

interface LandingBtnProps {
    href: string;
    children: React.ReactNode;
}

const LandingBtn: React.FC<LandingBtnProps> = ({ href, children }) => {
    return (
        <Link
        href={href}
        className="cursor-pointer px-4 py-2 text-sm md:text-base bg-pop text-default rounded-full hover:scale-102 transition-transform duration-300">
            {children}
        </Link>
    );
}

const Landing: React.FC = () => {
    const { setTheme } = useTheme();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        setTheme("dark");
    }, [setTheme]);

    return (
        <Layout>
            {/* <div className="flex flex-col"> */}
                <div className="
                flex flex-col h-screen bg-background text-default w-full relative justify-center gap-2
            ">
                    <div className='absolute inset-0 z-0'>
                        <DarkVeil
                            speed={1}
                            hueShift={215}
                            noiseIntensity={0}
                            scanlineFrequency={1}
                            scanlineIntensity={0}
                            warpAmount={1}
                        />
                    </div>
                    <div className='flex flex-col text-center justify-center z-10 mb-2'>
                        <NotoLogo />
                    </div>
                    <div className='flex flex-col text-center justify-center z-10 px-12 mb-4'>
                        <p className="text-lg md:text-2xl italic">Organize your thoughts. Embed what matters.</p>
                    </div>
                    <div className='flex flex-row items-center justify-center z-10 space-x-4'>
                        {!isAuthenticated && (
                            <LandingBtn href="/register">Get Started</LandingBtn>
                        )}
                        <button 
                        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                        className='cursor-pointer px-4 py-2 text-sm md:text-base bg-gray-800/90 text-default rounded-full hover:scale-102 transition-transform duration-300'>
                            Learn More
                        </button>
                    </div>
                </div>
                <AboutSection />
            {/* </div> */}
        </Layout>
    );
};

export default Landing;