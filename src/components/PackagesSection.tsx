import React from 'react';
import { PackageItem } from '../types';
import { PackageCard } from './PackageCard';
import { Sparkles, ShieldCheck, Compass, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PackagesSectionProps {
  selectedTag: string;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({ selectedTag }) => {
  const { packages, isLoading, setIsCustomTripModalOpen } = useApp();

  // Filter packages based on active tag
  const filteredPackages = packages.filter((pkg) => {
    if (!selectedTag || selectedTag === 'ALL') return true;
    const s = selectedTag.toLowerCase();
    const name = pkg.name.toLowerCase();
    const dest = pkg.destinations.toLowerCase();
    const desc = pkg.shortDescription.toLowerCase();
    const tag = (pkg.tag || '').toLowerCase();

    if (s === 'honeymoon') {
      return tag.includes('honeymoon') || name.includes('honeymoon') || desc.includes('romantic');
    }
    if (s === 'family') {
      return tag.includes('family') || name.includes('family') || desc.includes('family');
    }
    if (s === 'classic') {
      return name.includes('thekkady') || dest.includes('thekkady');
    }
    if (s === 'houseboat') {
      return name.includes('houseboat') || desc.includes('houseboat') || dest.includes('alleppey');
    }
    if (s === 'luxury') {
      return tag.includes('luxury') || name.includes('luxury') || pkg.price >= 30000;
    }
    if (s === 'budget') {
      return pkg.price < 15000;
    }
    if (s === 'nature') {
      return name.includes('wayanad') || desc.includes('nature') || desc.includes('caves');
    }
    if (s === 'beach') {
      return name.includes('beach') || dest.includes('kovalam') || dest.includes('marari');
    }
    return true;
  });

  return (
    <section className="py-16 sm:py-24 bg-white" id="packages">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Itineraries</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900 tracking-tight">
              Trending Kerala Tour Packages
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base mt-2">
              Handcrafted holiday circuits including deluxe accommodations, daily breakfast, private AC car with personal chauffeur, and complete Kerala sightseeing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500">
              Showing <strong className="text-neutral-900 font-bold">{filteredPackages.length}</strong> verified itineraries
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-neutral-100 rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        )}

        {/* Packages Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}

        {/* Empty Filter State */}
        {!isLoading && filteredPackages.length === 0 && (
          <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200 p-8 max-w-lg mx-auto">
            <Compass className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-neutral-800 mb-1">No packages found for this filter</h3>
            <p className="text-xs text-neutral-500 mb-4">
              Our travel specialists can design a 100% custom itinerary matching your exact requirements!
            </p>
            <button
              onClick={() => setIsCustomTripModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-all cursor-pointer"
            >
              Request Custom Kerala Itinerary
            </button>
          </div>
        )}

        {/* Assurance footer banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h4 className="text-base font-bold text-neutral-900">
                Transparent Pricing Guarantee • No Hidden Costs
              </h4>
              <p className="text-xs text-neutral-600">
                All packages include toll fees, interstate taxes, driver bata, private vehicle, and handpicked hotels.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCustomTripModalOpen(true)}
            className="whitespace-nowrap px-5 py-3 rounded-xl bg-white border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold shadow-xs hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            <span>Customize Any Package</span>
          </button>
        </div>

      </div>
    </section>
  );
};
