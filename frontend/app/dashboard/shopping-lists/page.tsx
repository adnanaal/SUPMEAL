import { ShoppingLists } from '@/components/shopping-lists/ShoppingLists';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function ShoppingListsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <div className="ml-64 pt-16">
        <ShoppingLists />
      </div>
    </div>
  );
}
