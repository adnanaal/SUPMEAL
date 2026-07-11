import { MealPlanner } from '@/components/meal-planning/MealPlanner';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function MealPlannerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <div className="ml-64 pt-16">
        <MealPlanner />
      </div>
    </div>
  );
}
