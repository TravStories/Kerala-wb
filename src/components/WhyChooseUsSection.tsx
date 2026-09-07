import React from 'react';
import { Sliders, Hotel, Car, MapPinned, BadgePercent, Headphones, ShieldCheck, Award } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const points = [
    {
      title: 'Customized Travel Plans',
      desc: 'No rigid templates. We tweak itineraries, pacing, and sightseeing to suit your personal style and budget.',
      icon: Sliders
    },
    {
      title: 'Handpicked Hotels & Resorts',
      desc: 'Every stay is personally inspected for cleanliness, view, safety, and warm Kerala hospitality.',
      icon: Hotel
    },
    {
      title: 'Reliable Car & Professional Driver',
      desc: 'Sanitized private AC vehicles with experienced, patient chauffeurs who double up as friendly local guides.',
      icon: Car
    },
    {
      title: 'Local Destination Knowledge',
      desc: 'Based right here in Kerala, our team knows the best tea viewpoints, quietest backwater canals, and hidden gems.',
      icon: MapPinned
    },
    {
      title: 'Transparent Pricing Guarantee',
      desc: 'No sudden hidden surprises. Fuel, toll taxes, driver allowance, and accommodation taxes are always included.',
      icon: BadgePercent
    },
    {
      title: 'Dedicated 24/7 Travel Support',
      desc: 'Your dedicated trip manager is available on call and WhatsApp throughout your trip from arrival to drop-off.',
      icon: Headphones
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-neutral-900 text-white" id="why-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            The TravStories Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mt-1 mb-3">
            Why Travel Kerala With TravStories?
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            We don't just sell standard tickets and hotel vouchers. We craft memorable, stress-free Kerala stories that stay with you forever.
          </p>
        </div>

        {/* 6 Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="bg-neutral-800/80 rounded-2xl p-6 sm:p-7 border border-white/10 hover:border-emerald-500/50 transition-all duration-200 flex flex-col group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-heading text-white mb-2">
                  {pt.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
