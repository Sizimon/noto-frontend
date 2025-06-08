'use client';

import React, { useState } from 'react';
import Layout from '@/Layout';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Register: React.FC = () => {
    const { register } = useAuth();
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();


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

        if (username.length < 3) {
            setError('Username must be at least 3 characters long.');
            setIsLoading(false);
            return;
        }
        // In the future check if username is already taken

        // Call API to register user
        try {
            const success = await register(username, email, password);
            if (success) {
                setSuccess('Registration successful! Redirecting...');
                setTimeout(() => {
                    router.push('/user-dashboard');
                }, 2000);
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row md:grid-flow-col dark:text-white h-screen bg-white dark:bg-zinc-800">
                <div className="flex flex-col justify-center text-center px-12 md:px-24">
                    <h1 className='text-4xl md:text-6xl'>In<span className='text-amber-600'>Time</span>Tasks</h1>
                    <p className='text-lg md:text-2xl'>Helping you stay on track, quick & easy, your workflow tool & notebook.</p>
                </div>
                <div className='flex flex-col items-center md:justify-center'>
                    <h1 className="text-2xl font-bold mb-4">Register</h1>
                    {error && <p className="text-red-500 text-center px-24 pb-4">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <form onSubmit={handleRegister} className="flex flex-col space-y-4 bg-zinc-100 dark:bg-zinc-950 p-8 rounded-lg w-5/6 md:w-4/6">
                        <div>
                            <label className="block text-sm font-medium">Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email:</label>
                            <input
                                type="email"
                                value={email}
                                autoComplete='email'
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Confirm Password:</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500"
                        >
                            Register
                        </button>
                        <p className="text-center">
                            Already have an account? <Link href="/login" className="text-amber-600 hover:underline">Login here</Link>
                        </p>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default Register;