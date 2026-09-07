import React, { useState, useEffect } from 'react';
import { MessageCircle, Sparkles, X, ArrowRight, ShieldCheck, User, Phone, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { trackWhatsAppClick, trackExitPopupSubmission, trackLeadSubmission } from '../lib/analytics';

export const FloatingWidgets: React.FC = () => {
  const { branding, settings, setIsCustomTripModalOpen, unlockPackage } = useApp();

  // Exit intent state
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [exitName, setExitName] = useState('');
  const [exitMobile, setExitMobile] = useState('');
  const [exitSubmitting, setExitSubmitting] = useState(false);
  const [exitSuccess, setExitSuccess] = useState(false);
  const [exitError, setExitError] = useState<string | null>(null);

  useEffect(() => {
    // Check if exit intent was already shown in this session
    const hasSeenExitPopup = sessionStorage.getItem('travstories_exit_shown');
    if (hasSeenExitPopup) return;

    // Desktop only exit intent listener (mouse moving out of top window)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && window.innerWidth >= 1024) {
        setShowExitPopup(true);
        sessionStorage.setItem('travstories_exit_shown', 'true');
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('floating_button');
    const msg = encodeURIComponent("Hi TravStories, I am on your website and would like assistance planning my Kerala trip.");
    window.open(`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  const handleMobileStickyCta = () => {
    setIsCustomTripModalOpen(true);
  };

  const handleExitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setExitError(null);

    if (!exitName.trim()) {
      setExitError('Please enter your name.');
      return;
    }

    const cleaned = exitMobile.replace(/[^0-9]/g, '');
    if (cleaned.length < 10) {
      setExitError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    try {
      setExitSubmitting(true);
      const res = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: exitName.trim(),
          mobile: cleaned.slice(-10),
          inquiryType: 'EXIT_POPUP',
          travelDate: 'Flexible',
          travellers: '2'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      trackExitPopupSubmission();
      trackLeadSubmission(data.leadId || 'exit', 'EXIT_POPUP');
      unlockPackage(undefined, { name: exitName.trim(), mobile: cleaned.slice(-10) });

      setExitSuccess(true);
      setTimeout(() => {
        setShowExitPopup(false);
      }, 2000);
    } catch (err: any) {
      setExitError(err.message || 'Something went wrong');
    } finally {
      setExitSubmitting(false);
    }
  };

  return (
    <>
      {/* 1. FLOATING WHATSAPP BUTTON */}
      <aside aria-label="Quick contact" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={handleWhatsAppClick}
          className="group flex items-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-white/20"
          aria-label="Chat on WhatsApp with Kerala Travel Expert"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 fill-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full" />
          </div>
          <span className="hidden sm:inline font-bold text-xs sm:text-sm tracking-wide">
            Chat on WhatsApp
          </span>
        </button>
      </aside>

      {/* 2. MOBILE STICKY CTA */}
      <aside aria-label="Mobile quick action" className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 shadow-lg flex items-center gap-3">
        <button
          onClick={handleMobileStickyCta}
          className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white text-center shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          style={{ backgroundColor: branding.primaryColor || '#047857' }}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Plan My Kerala Trip</span>
        </button>

        <a
          href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`}
          className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 active:scale-95 shrink-0 border border-neutral-200"
          aria-label="Call TravStories Kerala Expert"
        >
          <Phone className="w-5 h-5 text-emerald-700" />
        </a>
      </aside>

      {/* 3. EXIT INTENT POPUP (Desktop only, frequency controlled) */}
      {showExitPopup && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-xs hidden lg:flex items-center justify-center p-4 animate-fade-in">
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
            
            <button
              onClick={() => setShowExitPopup(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner */}
            <div className="bg-emerald-950 text-white p-7 relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Exclusive Visitor Offer</span>
              </div>
              <h3 className="text-2xl font-extrabold font-heading text-white">
                Still Planning Your Kerala Trip?
              </h3>
              <p className="text-xs text-neutral-300 mt-1">
                Don't leave empty-handed! Get a free custom Kerala route map & instant wholesale quote sent straight to your WhatsApp.
              </p>
            </div>

            {/* Content */}
            <div className="p-7">
              {exitSuccess ? (
                <div className="text-center py-6 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-neutral-900">Itinerary On The Way!</h4>
                  <p className="text-xs text-neutral-600">
                    We'll share the customized Kerala travel plan with you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleExitSubmit} className="space-y-4">
                  {exitError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs">
                      {exitError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">Your Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anjali Gupta"
                        value={exitName}
                        onChange={(e) => setExitName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">WhatsApp / Mobile Number</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500 border-r border-neutral-200 pr-2">
                        🇮🇳 +91
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit number"
                        value={exitMobile}
                        onChange={(e) => setExitMobile(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                        className="w-full pl-22 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={exitSubmitting}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ backgroundColor: branding.primaryColor || '#047857' }}
                  >
                    <span>{exitSubmitting ? 'Sending Request...' : 'Get Free Travel Plan'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>No spam guarantee. Only genuine travel assistance.</span>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
