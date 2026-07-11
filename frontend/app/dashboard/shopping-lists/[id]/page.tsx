import { ShoppingListDetail } from '@/components/shopping-lists/ShoppingListDetail';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function ShoppingListDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <div className="ml-64 pt-16">
        <ShoppingListDetail />
      </div>
    </div>
  );
}
