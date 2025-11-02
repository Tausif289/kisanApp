import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import MarketPrice from "@/components/market-price/market-price-list";

export default function MarketPricePage() {
  return (
    <div className="flex flex-col h-full">
      {/* ✅ Sticky & Stylish Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <DashboardHeader
          title="Market Prices"
          subtitle="View real-time market prices for various crops across different locations."
        />
      </div>

      {/* ✅ Scrollable Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <MarketPrice />
      </main>
    </div>
  );
}

