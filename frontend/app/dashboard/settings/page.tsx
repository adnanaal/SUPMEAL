import { Settings } from '@/components/settings/Settings';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <div className="ml-64 pt-16 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
        </div>
        <Settings />
      </div>
    </div>
  );
}
