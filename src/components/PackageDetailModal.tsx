import React, { useState } from 'react';
import { X, Check, Clock, MapPin, Sparkles, Building2, Car, ShieldAlert, Phone, MessageSquare, Download, Share2 } from 'lucide-react';
import { PackageItem } from '../types';
import { useApp } from '../context/AppContext';
import { trackWhatsAppClick } from '../lib/analytics';

interface PackageDetailModalProps {
  pkg: PackageItem;
  onClose: () => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({ pkg, onClose }) => {
  const { branding, settings } = useApp();
  const [activeTab, setActiveTab] = useState<'itinerary' | 'hotels' | 'inclusions' | 'transport'>('itinerary');

  const handleWhatsAppInquiry = () => {
    trackWhatsAppClick('package_detail_modal');
    const msg = encodeURIComponent(`Hi TravStories, I have unlocked and reviewed the package "${pkg.name}" (${pkg.duration}). I would like to book or customize this package.`);
    window.open(`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header with image background banner */}
        <div className="relative bg-neutral-900 text-white shrink-0">
          <div className="relative h-44 sm:h-56 w-full overflow-hidden">
            <img
              src={pkg.image}
              alt={pkg.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-neutral-900/80 hover:bg-neutral-900 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Package Title & Key Stats */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-700 text-white">
                Unlocked Details
              </span>
              {pkg.tag && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-neutral-950">
                  {pkg.tag}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-xs">
                {pkg.duration}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-heading text-white leading-tight">
              {pkg.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-neutral-300 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{pkg.destinations}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-neutral-200 bg-neutral-50 px-4 sm:px-6 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'itinerary'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Day-Wise Itinerary
          </button>
          <button
            onClick={() => setActiveTab('inclusions')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'inclusions'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Inclusions & Exclusions
          </button>
          <button
            onClick={() => setActiveTab('hotels')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'hotels'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Hotel & Stay Information
          </button>
          <button
            onClick={() => setActiveTab('transport')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'transport'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Transportation & Car
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: Day-Wise Itinerary */}
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              {/* Highlights Summary */}
              {pkg.highlights && pkg.highlights.length > 0 && (
                <div className="bg-emerald-50 rounded-2xl p-4 sm:p-5 border border-emerald-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>Package Highlights</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-neutral-700">
                    {pkg.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Day Timeline */}
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-neutral-200">
                {pkg.completeItinerary && pkg.completeItinerary.map((item) => (
                  <div key={item.day} className="relative pl-9 sm:pl-10">
                    {/* Day Marker Circle */}
                    <div className="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                      {item.day}
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-neutral-200/90 shadow-2xs hover:border-emerald-300 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <h4 className="text-sm sm:text-base font-bold text-neutral-900 font-heading">
                          Day {item.day}: {item.title}
                        </h4>
                        {item.stay && (
                          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full w-fit">
                            🏨 {item.stay}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                        {item.desc}
                      </p>

                      {item.meals && (
                        <div className="mt-2.5 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 flex items-center gap-1.5">
                          <span>🍽 <strong>Meals:</strong> {item.meals}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Inclusions & Exclusions */}
          {activeTab === 'inclusions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200/70">
                <h4 className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2 font-heading">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">✓</span>
                  <span>What is Included</span>
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700">
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200">
                <h4 className="text-sm font-bold text-neutral-800 mb-3 flex items-center gap-2 font-heading">
                  <span className="w-6 h-6 rounded-full bg-neutral-300 text-neutral-700 flex items-center justify-center text-xs">✕</span>
                  <span>What is Not Included</span>
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-600">
                  {pkg.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-neutral-400 font-bold">•</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Hotel Information */}
          {activeTab === 'hotels' && (
            <div className="space-y-5">
              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-neutral-900 font-heading">Hotel & Stay Category</h4>
                    <p className="text-xs text-neutral-500">Handpicked boutique & luxury properties vetted by our local team</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed bg-white p-4 rounded-xl border border-neutral-200">
                  {pkg.hotelInformation}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-600">
                <div className="bg-white p-3.5 rounded-xl border border-neutral-200">
                  <strong>⭐ Hygiene Standards:</strong> Daily sanitized rooms, fresh linens & complimentary toiletries.
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-neutral-200">
                  <strong>🍳 Daily Breakfast:</strong> Hot South Indian & Continental morning buffet spread included.
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-neutral-200">
                  <strong>📍 Prime Location:</strong> Close to scenic viewpoints, tea slopes, or tranquil backwater banks.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Transportation */}
          {activeTab === 'transport' && (
            <div className="space-y-5">
              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                    <Car className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-neutral-900 font-heading">Private Vehicle & Chauffeur</h4>
                    <p className="text-xs text-neutral-500">Comfortable AC car dedicated exclusively for your traveling party</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed bg-white p-4 rounded-xl border border-neutral-200">
                  {pkg.transportationInformation}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-600">
                <div className="bg-white p-3.5 rounded-xl border border-neutral-200">
                  <strong>🚗 Vehicles Offered:</strong> Swift Dzire / Toyota Etios (couples) or Innova Crysta (families).
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-neutral-200">
                  <strong>👨‍✈️ Professional Drivers:</strong> Courteous, non-smoking, Hindi/English & Malayalam speaking.
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-neutral-200">
                  <strong>⛽ All-Inclusive:</strong> Fuel charges, toll tax, interstate permits, and driver bata included.
                </div>
              </div>
            </div>
          )}

          {/* Important Notes */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Helpful Kerala Travel Tip:</strong> Houseboats in Alleppey operate AC from 9:00 PM to 6:00 AM in standard categories, and full-time in luxury categories. Rates are subject to festive peak dates (Christmas/New Year/Diwali).
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div>
            <div className="text-xs text-neutral-500">Starting Price</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-heading text-neutral-900">
                ₹{pkg.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-neutral-500">per person</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-xs sm:text-sm font-bold text-neutral-800 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>Call Expert</span>
            </a>

            <button
              onClick={handleWhatsAppInquiry}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md hover:opacity-95 transition-all cursor-pointer"
              style={{ backgroundColor: branding.primaryColor || '#047857' }}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Book / Customize on WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
