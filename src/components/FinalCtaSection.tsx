import React from 'react';
import { ArrowRight, Phone, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { trackHeroCtaClick } from '../lib/analytics';

export const FinalCtaSection: React.FC = () => {
  const { branding, settings, setIsCustomTripModalOpen } = useApp();

  const handleCta = () => {
    trackHeroCtaClick('final_cta_consultation');
    setIsCustomTripModalOpen(true);
  };

  return (
    <section className="relative overflow-hidden bg-emerald-950 text-white py-20 sm:py-28">
      {/* Background imagery & tropical tones */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1920&auto=format&fit=crop"
          alt="Kerala backwaters at sunset"
          className="w-full h-full object-cover object-center opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-emerald-900/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-xs">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Handcrafted Memories • Local Kerala Team</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight leading-tight">
          Your Kerala Story Is Waiting
        </h2>

        <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          From misty mountains and rolling tea valleys to peaceful backwaters, tell us where you want to go and our Kerala travel experts will help you plan the journey.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={handleCta}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-neutral-950 shadow-xl hover:opacity-95 transition-all active:scale-98 cursor-pointer"
            style={{ backgroundColor: branding.accentColor || '#f97316' }}
          >
            <span className="text-white">Get Free Kerala Trip Consultation</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>

          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20TravStories,%20I%20want%20to%20plan%20my%20Kerala%20trip`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xs transition-all active:scale-98"
          >
            <MessageSquare className="w-5 h-5 text-emerald-300" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Reassurance items */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-300">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Fast 30-minute quote</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Wholesale direct rates</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Dedicated local coordinator</span>
          </span>
        </div>

      </div>
    </section>
  );
};
