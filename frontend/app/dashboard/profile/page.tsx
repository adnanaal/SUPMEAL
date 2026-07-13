import { UserProfile } from '@/components/user/UserProfile';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function ProfilePage() {
  // Mock user data - will be replaced with actual user data from auth
  const user = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    avatar: undefined,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <div className="ml-64 pt-16 p-6">
        <UserProfile user={user} />
      </div>
    </div>
  );
}
