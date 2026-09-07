import React from 'react';
import { Palmtree, Hotel, Car, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TravelServicesSection: React.FC = () => {
  const { branding, setIsCustomTripModalOpen } = useApp();

  const services = [
    {
      id: 'packages',
      title: 'Kerala Tour Packages',
      desc: 'Customized holidays for couples, families and friend groups with complete sightseeing, verified hotels, and private transportation.',
      icon: Palmtree,
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop',
      features: [
        'Honeymoon & Romantic Getaways',
        'Multi-city Family Holidays',
        'Private Alleppey Houseboats',
        'Customized Day-by-Day Route'
      ],
      cta: 'Explore Packages'
    },
    {
      id: 'hotels',
      title: 'Hotel & Resort Bookings',
      desc: 'Comfortable stays from budget-friendly verified hotels to 5-star backwater luxury pool villas and hillside treehouses.',
      icon: Hotel,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop',
      features: [
        'Verified Hygiene & Cleanliness',
        'Scenic Mountain & Lake Views',
        'Exclusive Direct Wholesale Rates',
        'Complimentary Buffet Breakfast'
      ],
      cta: 'Enquire for Hotels'
    },
    {
      id: 'cars',
      title: 'Private Car Rentals with Driver',
      desc: 'Reliable, sanitized private cars and professional chauffeurs who know every Kerala mountain curve and hidden scenic spot.',
      icon: Car,
      image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=600&auto=format&fit=crop',
      features: [
        'Sedans (Dzire/Etios) & Innova Crysta',
        'Professional, Courteous Chauffeurs',
        'All Tolls, Parking & Fuel Included',
        'Airport & Railway Station Pickup'
      ],
      cta: 'Book Private Car'
    }
  ];

  const handleEnquire = (serviceTitle: string) => {
    setIsCustomTripModalOpen(true);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-neutral-200/70" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Complete Travel Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900 mt-1 mb-3">
            Our Kerala Travel Services
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Everything you need for a seamless Kerala holiday under one roof with transparent pricing and dedicated local ground support.
          </p>
        </div>

        {/* 3 Visually Distinct Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="bg-neutral-50/70 rounded-3xl overflow-hidden border border-neutral-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-neutral-200">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-emerald-800 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="absolute bottom-4 left-4 right-4 text-xl font-bold font-heading text-white">
                    {srv.title}
                  </h3>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                      {srv.desc}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-neutral-200/70">
                      {srv.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                          <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleEnquire(srv.title)}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    style={{ backgroundColor: branding.primaryColor || '#047857' }}
                  >
                    <span>Enquire Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
