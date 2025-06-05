import ProtectedRoute from '@/components/ProtectedRoute';
import UserDashboard from '@/pages/UserDashboard';

export default function UserDashboardPage() {
  return (
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  );
}