import React from 'react';
import { Mountain, Waves, Trees, Compass, Sunset, Home, UtensilsCrossed, Camera } from 'lucide-react';

export const WhyVisitKerala: React.FC = () => {
  const experiences = [
    {
      title: 'Misty Hill Stations',
      desc: 'Wake up to clouds resting gently over Munnar & Wayanad peaks at 6,000+ feet.',
      icon: Mountain,
      bg: 'bg-emerald-50 text-emerald-800'
    },
    {
      title: 'Peaceful Backwaters',
      desc: 'Sail through 900+ km of palm-fringed interconnected lagoons, canals and lakes.',
      icon: Waves,
      bg: 'bg-sky-50 text-sky-800'
    },
    {
      title: 'Endless Tea Plantations',
      desc: 'Rolling emerald velvet slopes that carpet the Western Ghats as far as the eye can see.',
      icon: Trees,
      bg: 'bg-teal-50 text-teal-800'
    },
    {
      title: 'Wildlife Adventures',
      desc: 'Spot wild elephants, Nilgiri Tahr, and exotic birds in Periyar and Eravikulam reserves.',
      icon: Compass,
      bg: 'bg-amber-50 text-amber-800'
    },
    {
      title: 'Beautiful Beaches',
      desc: 'Golden sands and red laterite cliffs of Kovalam, Varkala, and peaceful Marari coastline.',
      icon: Sunset,
      bg: 'bg-orange-50 text-orange-800'
    },
    {
      title: 'Unique Houseboat Stays',
      desc: 'Handcrafted wooden Kettuvallam houseboats with air-conditioned bedrooms and private chefs.',
      icon: Home,
      bg: 'bg-indigo-50 text-indigo-800'
    },
    {
      title: 'Authentic Kerala Cuisine',
      desc: 'Fresh Karimeen pollichathu, coconut-infused curries, appam, and traditional banana leaf Sadya.',
      icon: UtensilsCrossed,
      bg: 'bg-rose-50 text-rose-800'
    },
    {
      title: 'Picture-Perfect Landscapes',
      desc: 'Athirappilly waterfalls, misty reservoirs, and spice estates ready for postcard photos.',
      icon: Camera,
      bg: 'bg-cyan-50 text-cyan-800'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-neutral-50/60 border-b border-neutral-200/60" id="why-kerala">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
            God’s Own Country
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900 mt-1 mb-3">
            Why Kerala Should Be Your Next Trip
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            From the cool mist of Western Ghats to serene tropical canals, Kerala offers India’s most rejuvenating vacation experiences in one compact, scenic state.
          </p>
        </div>

        {/* 8 Experience Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${exp.bg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2 font-heading">
                  {exp.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {exp.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
