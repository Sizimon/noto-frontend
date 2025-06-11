'use client';

import { AuthProvider, useAuth } from './AuthProvider';
import { TasksProvider } from './TasksProvider';

function InnerProviders({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;

  return isAuthenticated ? (
    <TasksProvider>
      {children}
    </TasksProvider>
  ) : (
    children
  );
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <InnerProviders>
        {children}
      </InnerProviders>
    </AuthProvider>
    );
};
