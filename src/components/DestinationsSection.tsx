import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DestinationsSection: React.FC = () => {
  const { branding, setIsCustomTripModalOpen } = useApp();

  const destinations = [
    {
      name: 'Munnar',
      tagline: 'Misty Hills & Endless Tea Gardens',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop',
      alt: 'Munnar tea plantation slopes',
      altDesc: 'Rolling green tea estates and waterfalls'
    },
    {
      name: 'Alleppey',
      tagline: "Float Through Kerala's Magical Backwaters",
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&auto=format&fit=crop',
      alt: 'Alleppey traditional houseboat on calm backwaters',
      altDesc: 'Traditional wooden houseboats and palm canals'
    },
    {
      name: 'Thekkady',
      tagline: 'Wildlife, Forests & Adventure',
      image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=600&auto=format&fit=crop',
      alt: 'Periyar Lake wildlife reserve in Thekkady',
      altDesc: 'Periyar Tiger Reserve and spice plantations'
    },
    {
      name: 'Wayanad',
      tagline: 'Where Nature Feels Untouched',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
      alt: 'Wayanad lush misty mountains and lakes',
      altDesc: 'Prehistoric caves, waterfalls and bamboo forests'
    },
    {
      name: 'Varkala',
      tagline: 'Cliffs, Beaches & Beautiful Sunsets',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
      alt: 'Red laterite cliff beach at Varkala',
      altDesc: 'Unique red cliffs meeting the Arabian sea'
    },
    {
      name: 'Kovalam',
      tagline: 'Golden Sands & Lighthouse Panoramas',
      image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=600&auto=format&fit=crop',
      alt: 'Kovalam crescent beach and lighthouse',
      altDesc: 'Famous lighthouse beach and calm swimming coves'
    },
    {
      name: 'Kochi',
      tagline: 'Colonial Heritage & Chinese Fishing Nets',
      image: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?q=80&w=600&auto=format&fit=crop',
      alt: 'Fort Kochi Chinese fishing nets at sunset',
      altDesc: 'Portuguese churches, spice bazaars & art cafes'
    },
    {
      name: 'Athirappilly',
      tagline: 'The Majestic Niagara of India',
      image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=600&auto=format&fit=crop',
      alt: 'Athirappilly thundering waterfalls in Chalakudy river',
      altDesc: '80-foot thundering forest waterfall'
    }
  ];

  const handleExploreDestination = (destName: string) => {
    // Scroll to packages and select relevant filter or open custom plan
    const el = document.getElementById('packages');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-24 bg-neutral-50" id="destinations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Iconic Landscapes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900 mt-1 mb-3">
            Top Kerala Destinations to Explore
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Every corner of Kerala has a unique charm — from cool misty tea hills to tranquil palm-lined canals and sun-kissed beaches.
          </p>
        </div>

        {/* 8 Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.name}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all duration-300 group flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 overflow-hidden bg-neutral-100">
                <img
                  src={dest.image}
                  alt={dest.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mb-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>Kerala, India</span>
                  </div>
                  <h3 className="text-xl font-bold font-heading text-white">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Tagline & Action */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-neutral-600 font-medium leading-relaxed italic">
                  "{dest.tagline}"
                </p>
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 font-medium">
                    {dest.altDesc}
                  </span>
                  <button
                    onClick={() => handleExploreDestination(dest.name)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
                  >
                    <span>View Tours</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
