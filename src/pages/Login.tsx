'use client';

import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
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
        try {
            const success = await login(usernameOrEmail, password);
            if (success) {
                setSuccess('Login successful! Redirecting...');
                router.push('/user-dashboard');
                return;
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
            <div className="
                grid grid-col-1 grid-flow-row h-screen bg-background text-default
                md:grid-cols-2 md:grid-flow-col
            ">
                <div className="
                    flex flex-col text-center justify-end px-12 pb-12
                    md:px-24 md:justify-center
                ">
                    <h1 className='text-4xl md:text-6xl'>In<span className='text-pop'>Time</span>Tasks</h1>
                    <p className='text-lg md:text-2xl'>Helping you stay on track, quick & easy, your workflow tool & notebook.</p>
                </div>
                <div className='flex flex-col items-center justify-start md:justify-center'>
                    <h1 className="text-2xl font-bold mb-4">Login</h1>
                    {error && <p className="text-red-500 text-center px-24 pb-4">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <form
                        onSubmit={handleLogin}
                        className="
                            flex flex-col space-y-4 bg-foreground p-8 rounded-lg w-5/6
                            md:w-4/6                        ">
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
                                px-4 py-2 bg-pop text-white rounded 
                                hover:scale-102 transition-transform duration-300
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