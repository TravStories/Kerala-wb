import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Compass, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { trackHeroCtaClick } from '../lib/analytics';

interface NavbarProps {
  onOpenAdmin?: () => void;
  isAdminView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, isAdminView = false }) => {
  const { branding, settings, setIsCustomTripModalOpen } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePlanTripClick = () => {
    trackHeroCtaClick('navbar_plan_trip');
    setIsCustomTripModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top micro banner for trust */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Government Registered Kerala Tour Specialist</span>
            </span>
            <span className="text-emerald-400/50">•</span>
            <span className="hidden md:inline">24x7 On-Ground Kerala Support</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{settings.phoneNumber}</span>
            </a>
            {onOpenAdmin && (
              <>
                <span className="text-emerald-400/50">•</span>
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1 text-emerald-300 hover:text-white transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3 h-3" />
                  <span>Admin CMS</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/80 py-3'
            : 'bg-white py-4 border-b border-neutral-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <a href="#" className="flex items-center gap-2.5 group">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.companyName || 'TravStories.com'}
                className="h-9 md:h-11 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: branding.primaryColor || '#047857' }}
                >
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold font-heading tracking-tight text-neutral-900 group-hover:text-emerald-800 transition-colors">
                    {branding.companyName || 'TravStories'}<span className="text-amber-500">.com</span>
                  </span>
                  <span className="text-[10px] tracking-wider uppercase text-neutral-500 font-medium">
                    Kerala Travel Specialist
                  </span>
                </div>
              </div>
            )}
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a
              href="#packages"
              className="text-sm font-semibold text-neutral-700 hover:text-emerald-700 transition-colors"
            >
              Kerala Packages
            </a>
            <a
              href="#destinations"
              className="text-sm font-semibold text-neutral-700 hover:text-emerald-700 transition-colors"
            >
              Destinations
            </a>
            <a
              href="#services"
              className="text-sm font-semibold text-neutral-700 hover:text-emerald-700 transition-colors"
            >
              Services
            </a>
            <a
              href="#why-us"
              className="text-sm font-semibold text-neutral-700 hover:text-emerald-700 transition-colors"
            >
              Why TravStories
            </a>
            <a
              href="#travel-guide"
              className="text-sm font-semibold text-neutral-700 hover:text-emerald-700 transition-colors"
            >
              Trip Guide
            </a>
            <a
              href="#faqs"
              className="text-sm font-semibold text-neutral-700 hover:text-emerald-700 transition-colors"
            >
              FAQs
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20TravStories,%20I%20am%20planning%20a%20trip%20to%20Kerala`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all"
            >
              <span>WhatsApp Us</span>
            </a>

            <button
              onClick={handlePlanTripClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
              style={{ backgroundColor: branding.primaryColor || '#047857' }}
            >
              <span>Plan My Kerala Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={handlePlanTripClick}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: branding.primaryColor || '#047857' }}
            >
              Plan Trip
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <div className="flex flex-col space-y-2">
              <a
                href="#packages"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-sm font-semibold text-neutral-800 hover:text-emerald-700 border-b border-neutral-100"
              >
                Kerala Tour Packages
              </a>
              <a
                href="#destinations"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-sm font-semibold text-neutral-800 hover:text-emerald-700 border-b border-neutral-100"
              >
                Destinations (Munnar, Alleppey, Wayanad)
              </a>
              <a
                href="#services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-sm font-semibold text-neutral-800 hover:text-emerald-700 border-b border-neutral-100"
              >
                Hotels & Car Rentals
              </a>
              <a
                href="#why-us"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-sm font-semibold text-neutral-800 hover:text-emerald-700 border-b border-neutral-100"
              >
                Why TravStories
              </a>
              <a
                href="#travel-guide"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-sm font-semibold text-neutral-800 hover:text-emerald-700 border-b border-neutral-100"
              >
                Kerala Travel Guide
              </a>
              <a
                href="#faqs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-sm font-semibold text-neutral-800 hover:text-emerald-700 border-b border-neutral-100"
              >
                Frequently Asked Questions
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handlePlanTripClick}
                className="w-full py-3 rounded-xl text-sm font-bold text-white text-center shadow-md"
                style={{ backgroundColor: branding.primaryColor || '#047857' }}
              >
                Plan My Kerala Trip (Free Quote)
              </button>

              <div className="flex items-center justify-between text-xs pt-2 text-neutral-500">
                <a href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`} className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{settings.phoneNumber}</span>
                </a>
                {onOpenAdmin && (
                  <button onClick={() => { setIsMobileMenuOpen(false); onOpenAdmin(); }} className="text-emerald-700 font-medium underline">
                    Admin Portal
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
