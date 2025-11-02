import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import CropRecommendation from "@/components/recommendations/recommendation-card";

export default function RecommendationsPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Sticky Stylish Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <DashboardHeader
          title="Crop Recommendation Engine"
          subtitle="Generate AI-powered recommendations for your next planting season."
        />
      </div>

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <CropRecommendation />
      </main>
    </div>
  );
}
