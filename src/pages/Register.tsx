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

const Register: React.FC = () => {
    const { register } = useAuth();
    const { setTheme } = useTheme();
    const router = useRouter();

    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setTheme("dark");
    }, [setTheme]);


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,18}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must be 6-18 characters long and contain at least one letter, one number, and one special character.');
            setIsLoading(false);
            return;
        }

        if (!email.includes('@')) {
            setError('Invalid email address.');
            setIsLoading(false);
            return;
        } // In the future check if email is already in use

        if (username.length < 3 || username.length > 20) {
            setError('Username must be between 3 and 20 characters long.');
            setIsLoading(false);
            return;
        }
        // In the future check if username is already taken

        // Call API to register user
        const result = await register(username, email, password);
        if (result.success) {
            setSuccess('Registration successful! Redirecting...');
            router.push('/user-dashboard');
        } else {
            setError(result.error || 'Registration failed.');
        }
        setIsLoading(false);
    };

    return (
        <Layout>
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
                <div className="
                    flex flex-col text-center justify-center z-10 px-12
                ">
                    <NotoLogo />
                </div>
                <div className='flex items-center justify-center z-10'>
                    <form
                        onSubmit={handleRegister}
                        className="
                            flex flex-col space-y-2 bg-foreground/90 py-4 px-8 rounded-lg w-5/6 z-10
                            md:w-2/6 md:space-y-4
                    ">
                        <div>
                            <div className='flex flex-col items-center mb-4'>
                                <h1 className="text-lg md:text-2xl font-bold">Register</h1>
                                {error && <p className="text-red-500 text-center px-24 pb-4">{error}</p>}
                                {success && <p className="text-green-500">{success}</p>}
                            </div>
                            <label className="block text-sm font-medium">Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded bg-background text-default"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email:</label>
                            <input
                                type="email"
                                value={email}
                                autoComplete='email'
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded bg-background text-default"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded bg-background text-default"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Confirm Password:</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded bg-background text-default"
                            />
                        </div>
                        <button
                            type="submit"
                            className="p-2 text-sm md:text-base bg-pop text-white rounded hover:scale-102 transition-transform duration-300"
                        >
                            Register
                        </button>
                        <p className="text-center text-sm md:text-base">
                            Already have an account? <Link href="/login" className="text-pop hover:underline">Login here</Link>
                        </p>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default Register;