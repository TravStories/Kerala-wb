import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, MapPin, UserCheck } from 'lucide-react';
import { TestimonialItem } from '../types';

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    fetch('/api/public/testimonials')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setTestimonials(data);
      })
      .catch(e => console.warn('Failed to load testimonials:', e));
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-neutral-50/70 border-b border-neutral-200/70" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Real Travelers, Real Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900 mt-1 mb-3">
            What Our Travellers Say
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Honest feedback from honeymooners, families, and friend groups who explored Kerala with TravStories.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                  "{t.review}"
                </p>
              </div>

              {/* Author & Destination Info */}
              <div className="pt-4 border-t border-neutral-100 flex items-center gap-3">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt={t.customerName}
                    className="w-11 h-11 rounded-full object-cover border border-neutral-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                    {t.customerName.charAt(0)}
                  </div>
                )}

                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-neutral-900 font-heading">
                    {t.customerName}
                  </h4>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    {t.travellerType}
                  </div>
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{t.destination} • {t.date}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
