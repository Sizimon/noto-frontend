'use client';

import PrivateLayout from '@/layouts/PrivateLayout';
import { useAuth } from '@/context/Auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/landing');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) return null;

  return <PrivateLayout>{children}</PrivateLayout>;
}