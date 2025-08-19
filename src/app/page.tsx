'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/Auth/AuthProvider';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/user-dashboard');
      } else {
        router.replace('/landing');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-lvh">
        <div>Loading...</div>
      </div>
    );
  }
  return null;
}

// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/Auth/AuthProvider';
// import Landing from '@/sections/Landing';

// export default function Home() {
//   const { isAuthenticated, isLoading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoading) {
//       if (isAuthenticated && typeof window !== 'undefined') {
//         router.push('/landing');
//       }
//     }
//   }, [isAuthenticated, isLoading, router]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-lvh">
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   // If authenticated, redirect to dashboard
//   if (isAuthenticated) {
//     if (typeof window !== 'undefined') {
//       router.push('/user-dashboard');
//     }
//     return null;
//   }

//   return <Landing />;
// }
