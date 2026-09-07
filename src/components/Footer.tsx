import React from 'react';
import { Compass, Phone, Mail, MapPin, Instagram, Facebook, Youtube, ShieldCheck, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { branding, settings } = useApp();

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-800 text-sm" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-14">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-2.5">
              {branding.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt={branding.companyName || 'TravStories.com'}
                  className="h-10 w-auto object-contain brightness-110"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: branding.primaryColor || '#047857' }}
                  >
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold font-heading tracking-tight text-white">
                    {branding.companyName || 'TravStories'}<span className="text-amber-500">.com</span>
                  </span>
                </div>
              )}
            </a>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              {branding.footerDescription ||
                "Kerala's premier experiential travel company. We curate handcrafted holidays featuring misty hills, tranquil backwaters, authentic houseboats, and serene beaches."}
            </p>

            {/* Social media links */}
            <div className="flex items-center gap-3 pt-2">
              {branding.instagramUrl && (
                <a
                  href={branding.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {branding.facebookUrl && (
                <a
                  href={branding.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {branding.youtubeUrl && (
                <a
                  href={branding.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Popular Kerala Tours */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-white font-heading">
              Kerala Packages
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#packages" className="hover:text-emerald-400 transition-colors">
                  Kochi – Munnar – Alleppey Tour
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-emerald-400 transition-colors">
                  Kerala Honeymoon Special
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-emerald-400 transition-colors">
                  Family Backwater Vacation
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-emerald-400 transition-colors">
                  Wayanad Nature Escape
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-emerald-400 transition-colors">
                  Luxury Ayurvedic Resort Tour
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Travel Services */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-white font-heading">
              Our Services
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services" className="hover:text-emerald-400 transition-colors">
                  Kerala Tour Packages
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-emerald-400 transition-colors">
                  Kerala Hotel Bookings
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-emerald-400 transition-colors">
                  Private Car & Driver Rentals
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-emerald-400 transition-colors">
                  Alleppey Houseboat Bookings
                </a>
              </li>
              <li>
                <a href="#custom-trip" className="hover:text-emerald-400 transition-colors">
                  Custom Itinerary Planning
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-white font-heading">
              Contact & Support
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.officeAddress || 'Marine Drive, Kochi, Kerala 682031'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {settings.phoneNumber}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">
                  {settings.contactEmail}
                </a>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Kochi Local Office • 24/7 Available</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Copyright, Legal and Admin Access */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} {branding.companyName || 'TravStories.com'}. All rights reserved.</p>
          
          <div className="flex items-center space-x-6 text-neutral-500">
            <a href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-neutral-300 transition-colors">Terms & Conditions</a>
            <span>•</span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Admin CMS</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
