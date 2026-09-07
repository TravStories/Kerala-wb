import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles, MapPin, Calendar, Users, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { trackHeroCtaClick } from '../lib/analytics';

export const HeroSection: React.FC = () => {
  const { branding, setIsCustomTripModalOpen } = useApp();

  const handleExplorePackages = () => {
    trackHeroCtaClick('hero_explore_packages');
    const el = document.getElementById('packages');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePlanMyTrip = () => {
    trackHeroCtaClick('hero_plan_my_trip');
    setIsCustomTripModalOpen(true);
  };

  return (
    <section className="relative overflow-hidden bg-neutral-900 text-white">
      {/* Background Image with Layered Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1920&auto=format&fit=crop"
          alt="Munnar Tea Plantations in Kerala"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Soft tropical dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-900/75 to-neutral-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Narrative */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Kerala Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>God’s Own Country • Kerala Specialists</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-heading">
              Discover Kerala, <br className="hidden sm:inline" />
              <span className="text-emerald-400">One Beautiful Story</span> at a Time.
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-neutral-200 max-w-2xl font-normal leading-relaxed">
              Handcrafted Kerala tour packages for couples, families and groups. Explore misty hills, peaceful backwaters, wildlife, golden beaches, and authentic traditional houseboats with your dedicated private car and driver.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={handleExplorePackages}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-white shadow-lg shadow-emerald-900/50 hover:opacity-95 transition-all active:scale-98 cursor-pointer"
                style={{ backgroundColor: branding.primaryColor || '#047857' }}
              >
                <span>Explore Kerala Packages</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handlePlanMyTrip}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all active:scale-98 cursor-pointer"
              >
                <span>Plan My Trip (Free Quote)</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 sm:pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5 text-neutral-200 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Customized Itineraries</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-200 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Hotel & Car Included</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-200 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Local Travel Experts</span>
              </div>
            </div>
          </div>

          {/* Right Hero Quick Lead Trigger Card */}
          <div className="lg:col-span-4">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-2xl border border-white/20 text-neutral-900">
              <div className="space-y-1 mb-5">
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-800">Fast 2-Min Inquiry</span>
                <h2 className="text-xl font-bold font-heading text-neutral-900">Get Personalized Kerala Plan</h2>
                <p className="text-xs text-neutral-500">Custom itinerary • Best wholesale rates • 100% Free</p>
              </div>

              <div className="space-y-3.5">
                <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/80 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div className="text-left">
                    <div className="text-[11px] text-neutral-500 font-medium">Popular Circuit</div>
                    <div className="text-xs font-bold text-neutral-800">Munnar – Thekkady – Alleppey</div>
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/80 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div className="text-left">
                    <div className="text-[11px] text-neutral-500 font-medium">Ideal Duration</div>
                    <div className="text-xs font-bold text-neutral-800">4 to 7 Days Flexible</div>
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/80 flex items-center gap-3">
                  <Users className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div className="text-left">
                    <div className="text-[11px] text-neutral-500 font-medium">Travel Style</div>
                    <div className="text-xs font-bold text-neutral-800">Honeymoon • Family • Friends</div>
                  </div>
                </div>

                <button
                  onClick={handlePlanMyTrip}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  style={{ backgroundColor: branding.primaryColor || '#047857' }}
                >
                  <span>Build My Custom Kerala Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero spam • Direct callback from Kochi specialist</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
