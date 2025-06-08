'use client';

import React, { useState } from 'react';
import Layout from '@/Layout';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


const Login: React.FC = () => {
    const { login } = useAuth();
    const router = useRouter();
    const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
        // Simulate login
        try {
            const success = await login(usernameOrEmail, password);
            if (success) {
                setSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    router.push('/user-dashboard');
                }, 2000);
            } else {
                setError('Invalid username/email or password.');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="grid grid-cols-2 grid-flow-col dark:text-white items-center justify-center h-screen bg-white dark:bg-zinc-800">
                <div className="flex flex-col items-center justify-center text-center px-24">
                    <h1 className='text-6xl'>In<span className='text-amber-600'>Time</span>Tasks</h1>
                    <p className='text-2xl'>Helping you stay on track, quick & easy, your workflow tool & notebook.</p>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <h1 className="text-2xl font-bold mb-4">Login</h1>
                    {error && <p className="text-red-500 text-center px-24 pb-4">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <form onSubmit={handleLogin} className="flex flex-col space-y-4 bg-zinc-100 dark:bg-zinc-950 p-8 rounded-lg w-4/6">
                        <div>
                            <label className="block text-sm font-medium">Username/Email:</label>
                            <input
                                type="text"
                                value={usernameOrEmail}
                                onChange={(e) => setUsernameOrEmail(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
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
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder='Password'
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500"
                        >
                            Login
                        </button>
                        <p className='text-center'>
                            Don't have an account? <Link href="/register" className="text-amber-600 hover:underline">Register here</Link>
                        </p>
                        <p className='text-center'>
                            <Link href="/forgot-password" className="text-amber-600 hover:underline">Forgot Password?</Link>
                        </p>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default Login;