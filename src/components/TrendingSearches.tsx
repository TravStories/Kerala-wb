import React from 'react';

interface TrendingSearchesProps {
  onSelectTag: (tag: string) => void;
  activeTag: string;
}

export const TrendingSearches: React.FC<TrendingSearchesProps> = ({ onSelectTag, activeTag }) => {
  const items = [
    { label: 'All Kerala Packages', icon: '✨', key: 'ALL' },
    { label: 'Kerala Honeymoon Package', icon: '🌿', key: 'Honeymoon' },
    { label: 'Kerala Family Tour', icon: '👨‍👩‍👧', key: 'Family' },
    { label: 'Munnar – Thekkady – Alleppey', icon: '⛰', key: 'Classic' },
    { label: 'Kerala Houseboat Experience', icon: '🚤', key: 'Houseboat' },
    { label: 'Kerala Luxury Vacation', icon: '🌴', key: 'Luxury' },
    { label: 'Budget Kerala Tour', icon: '💰', key: 'Budget' },
    { label: 'Wayanad Nature Escape', icon: '🏞', key: 'Nature' },
    { label: 'Kerala Beach Holiday', icon: '🏖', key: 'Beach' },
  ];

  const handleClick = (key: string) => {
    onSelectTag(key);
    const el = document.getElementById('packages');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white border-b border-neutral-100 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Trending Searches</span>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-neutral-900">
              Popular Ways People Explore Kerala
            </h2>
          </div>
          <span className="text-xs text-neutral-500 hidden sm:inline">
            Click any circuit or travel theme to filter packages
          </span>
        </div>

        {/* Scrollable / Wrap intent chips */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {items.map((item) => {
            const isActive = activeTag === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleClick(item.key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm scale-102'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
