import React, { useState } from 'react';
import { X, Lock, CheckCircle2, ShieldCheck, Sparkles, Phone, User, Calendar, Users, AlertCircle } from 'lucide-react';
import { PackageItem } from '../types';
import { useApp } from '../context/AppContext';
import { trackLeadSubmission } from '../lib/analytics';

interface LeadModalProps {
  pkg: PackageItem;
  onClose: () => void;
  onSuccess: (pkg: PackageItem) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({ pkg, onClose, onSuccess }) => {
  const { branding, unlockPackage } = useApp();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [travelMonth, setTravelMonth] = useState('Next 30 Days');
  const [travellers, setTravellers] = useState('2 Adults');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam hidden field

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateIndianMobile = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const regex = /^(?:\+91|0)?([6-9]\d{9})$/;
    return regex.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!mobile.trim()) {
      setError('Please enter your mobile number.');
      return;
    }

    if (!validateIndianMobile(mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          mobile: mobile.trim(),
          packageId: pkg.id,
          inquiryType: 'PACKAGE_DETAIL',
          travelDate: travelMonth,
          travellers,
          honeypot
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit inquiry. Please check your details.');
      }

      // Track analytics
      trackLeadSubmission(data.leadId || 'lead', 'PACKAGE_DETAIL', pkg.name);

      // Unlock globally and for this package
      unlockPackage(pkg.id, { name: name.trim(), mobile: mobile.trim() });

      setIsSuccess(true);

      // Transition to full package view after brief success feedback
      setTimeout(() => {
        onSuccess(pkg);
      }, 1000);

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-emerald-950 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-48 opacity-15 pointer-events-none">
            <img
              src={pkg.image}
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-300 text-[11px] font-semibold">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Unlock Complete Itinerary & Rates</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white line-clamp-2">
              {pkg.name}
            </h3>

            <p className="text-xs text-neutral-300 flex items-center gap-2 pt-1">
              <span>{pkg.duration}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Starting ₹{pkg.price.toLocaleString('en-IN')}/person</span>
            </p>
          </div>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900 font-heading">
              Inquiry Received & Details Unlocked!
            </h4>
            <p className="text-xs text-neutral-600">
              Opening your complete day-by-day itinerary, hotel details, and included transportation...
            </p>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
            
            {/* Value proposition note */}
            <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200/70 text-xs text-emerald-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                Enter your details to instantly view the <strong>complete day-wise schedule, handpicked hotel list, inclusions</strong>, and personalized quote.
              </span>
            </div>

            {/* Error banner */}
            {error && (
              <div className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-3 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Honeypot anti-spam field hidden from humans */}
            <input
              type="text"
              name="honeypot"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-neutral-500 border-r border-neutral-200 pr-2">
                  <span>🇮🇳 +91</span>
                </div>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                  className="w-full pl-22 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
              </div>
              <span className="text-[11px] text-neutral-500 mt-1 block">
                We'll send the detailed itinerary & pricing directly on WhatsApp.
              </span>
            </div>

            {/* Optional details: Travel Month & Number of Travellers */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Expected Travel
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={travelMonth}
                    onChange={(e) => setTravelMonth(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option>Next 30 Days</option>
                    <option>Next 2-3 Months</option>
                    <option>Summer Vacation</option>
                    <option>Monsoon Season</option>
                    <option>Winter / Festive</option>
                    <option>Just Planning Ahead</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Travellers
                </label>
                <div className="relative">
                  <Users className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={travellers}
                    onChange={(e) => setTravellers(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option>Couple (2 Adults)</option>
                    <option>Family (2 Adults + Kids)</option>
                    <option>Family (4+ Adults)</option>
                    <option>Friends Group (3-6)</option>
                    <option>Solo Traveler</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ backgroundColor: branding.primaryColor || '#047857' }}
              >
                {isSubmitting ? (
                  <span>Unlocking Package Details...</span>
                ) : (
                  <span>Get Complete Package Details</span>
                )}
              </button>
            </div>

            {/* Security Guarantee */}
            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privacy protected. No third-party spam. Instant unlock.</span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
