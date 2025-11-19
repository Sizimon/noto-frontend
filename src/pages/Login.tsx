'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/Layout';
import { useAuth } from '@/context/Auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import DarkVeil from '@/blocks/Backgrounds/DarkVeil/DarkVeil';
import { ClipLoader } from 'react-spinners';
import NotoLogo from '@/components/Logo';


const Login: React.FC = () => {
    const { setTheme } = useTheme();
    const { login } = useAuth();
    const router = useRouter();
    const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setTheme("dark");
    }, [setTheme]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        if (!usernameOrEmail || !password) {
            setError('Please fill in all fields.');
            setIsLoading(false);
            return;
        }
        const result = await login(usernameOrEmail, password);
        if (result.success) {
            setSuccess('Login successful! Redirecting...');
            router.push('/user-dashboard');
        } else {
            setError(result.error || 'Login failed.');
        }
        setIsLoading(false);
    };

    return (
        <Layout>
            <div className="
                flex flex-col h-screen bg-background text-default w-full relative justify-center gap-2 uwq:!gap-4
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
                <div className="
                    flex flex-col text-center justify-center z-10
                ">
                    <NotoLogo />
                </div>
                <div className='flex items-center justify-center z-10'>
                    <form
                        onSubmit={handleLogin}
                        className="
                            flex flex-col space-y-2 bg-foreground/90 py-4 px-8 rounded-lg w-5/6 z-10
                            md:w-2/8 uwq:!w-1/6 md:space-y-4
                        ">
                        <div>
                            <div className='flex flex-col items-center mb-4'>
                                <h1 className="text-lg md:text-2xl font-bold">Login</h1>
                                {error && <p className="text-red-500 text-center px-24 pb-4">{error}</p>}
                                {success && <p className="text-green-500">{success}</p>}
                            </div>
                            <label className="block text-sm font-medium">Username/Email:</label>
                            <input
                                type="text"
                                value={usernameOrEmail}
                                onChange={(e) => setUsernameOrEmail(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded bg-background text-default"
                                placeholder='Username or email'
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium"
                            >Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded bg-background text-default"
                                placeholder='Password'
                            />
                        </div>
                        {isLoading ?
                            (
                                <ClipLoader
                                    color="#f59e0b"
                                    loading={isLoading}
                                    size={35}
                                    className="mx-auto"
                                />
                            ) :
                            (
                                <button
                                    type="submit"
                                    className="
                                p-2 text-sm md:text-base bg-pop text-white rounded hover:scale-102 transition-transform duration-300
                            ">
                                    Login
                                </button>
                            )
                        }
                        <p className='text-center'>
                            Don't have an account? <Link href="/register" className="text-pop hover:underline">Register here</Link>
                        </p>
                        <p className='text-center'>
                            <Link href="/forgot-password" className="text-pop hover:underline">Forgot Password?</Link>
                        </p>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default Login;