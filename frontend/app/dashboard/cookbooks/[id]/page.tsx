import { CookbookDetail } from '@/components/cookbooks/CookbookDetail';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function CookbookDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <div className="ml-64 pt-16">
        <CookbookDetail />
      </div>
    </div>
  );
}
