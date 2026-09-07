import React from 'react';
import { Clock, MapPin, Check, ArrowRight, Sparkles, Shield, IndianRupee } from 'lucide-react';
import { PackageItem } from '../types';
import { useApp } from '../context/AppContext';
import { trackPackageClick, trackPackageModalOpen } from '../lib/analytics';

interface PackageCardProps {
  pkg: PackageItem;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  const {
    branding,
    isGloballyUnlocked,
    unlockedPackages,
    setActivePackageForInquiry,
    setActivePackageForDetails
  } = useApp();

  const isUnlocked = isGloballyUnlocked || !!unlockedPackages[pkg.id];

  const handleAction = () => {
    trackPackageClick(pkg.id, pkg.name);

    if (isUnlocked) {
      // Already submitted lead in this session: open full details directly
      setActivePackageForDetails(pkg);
    } else {
      // Show lead gating modal
      trackPackageModalOpen(pkg.id, pkg.name);
      setActivePackageForInquiry(pkg);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
      {/* Image Container with Badge */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {pkg.tag && (
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: branding.accentColor || '#f97316' }}
            >
              <Sparkles className="w-3 h-3" />
              <span>{pkg.tag}</span>
            </span>
          )}
          {pkg.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-700 text-white shadow-sm">
              Trending
            </span>
          )}
        </div>

        {/* Duration badge at bottom-right of image */}
        <div className="absolute bottom-3 right-3 bg-neutral-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-medium text-white flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{pkg.duration}</span>
        </div>

        {/* Unlocked Indicator if user already submitted details */}
        {isUnlocked && (
          <div className="absolute bottom-3 left-3 bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-white flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span>Unlocked</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Destination Route */}
          <div className="flex items-start gap-1.5 text-xs font-medium text-emerald-800 mb-2">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="line-clamp-1">{pkg.destinations}</span>
          </div>

          {/* Package Title */}
          <h3 className="text-lg font-bold font-heading text-neutral-900 leading-snug group-hover:text-emerald-800 transition-colors">
            {pkg.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
            {pkg.shortDescription}
          </p>

          {/* Basic Itinerary Preview */}
          <div className="mt-3.5 pt-3 border-t border-neutral-100 bg-neutral-50/80 rounded-xl p-3">
            <div className="text-[11px] uppercase tracking-wider font-bold text-neutral-500 mb-1">
              Route Preview
            </div>
            <p className="text-xs text-neutral-700 line-clamp-2">
              {pkg.basicItinerary}
            </p>
          </div>
        </div>

        {/* Inclusions summary checkmarks */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600">
          <div className="flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Handpicked Hotels</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Private AC Car & Chauffeur</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-neutral-500 font-medium">Starting from</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-neutral-900 font-heading">
                ₹{pkg.price.toLocaleString('en-IN')}
              </span>
              {pkg.originalPrice && (
                <span className="text-xs text-neutral-400 line-through">
                  ₹{pkg.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-neutral-400">per person • incl. taxes</span>
          </div>

          <button
            onClick={handleAction}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-95 transition-all active:scale-95 cursor-pointer"
            style={{ backgroundColor: branding.primaryColor || '#047857' }}
          >
            <span>{isUnlocked ? 'View Full Itinerary' : 'View Complete Package'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
