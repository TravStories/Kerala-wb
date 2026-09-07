import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, User, Phone, Calendar, Users, Heart, Users2, Compass, AlertCircle, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { trackCustomTripInquiry, trackLeadSubmission } from '../lib/analytics';

export const CustomTripModal: React.FC = () => {
  const { branding, isCustomTripModalOpen, setIsCustomTripModalOpen, unlockPackage } = useApp();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dates, setDates] = useState('');
  const [travellers, setTravellers] = useState('2');
  const [travellerType, setTravellerType] = useState<'Couple' | 'Family' | 'Friends/Group'>('Couple');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isCustomTripModalOpen) return null;

  const validateIndianMobile = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const regex = /^(?:\+91|0)?([6-9]\d{9})$/;
    return regex.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (!mobile.trim() || !validateIndianMobile(mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          mobile: mobile.trim(),
          inquiryType: 'CUSTOM_TRIP',
          travelDate: dates || 'Flexible',
          travellers: `${travellers} Pax (${travellerType})`,
          notes: notes.trim(),
          honeypot
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry.');

      trackCustomTripInquiry();
      trackLeadSubmission(data.leadId || 'lead', 'CUSTOM_TRIP');
      unlockPackage(undefined, { name: name.trim(), mobile: mobile.trim() });

      setIsSuccess(true);
      setTimeout(() => {
        setIsCustomTripModalOpen(false);
        setIsSuccess(false);
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => setIsCustomTripModalOpen(false)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-emerald-950 text-white p-6 sm:p-7">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
            Free Trip Consultation
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
            Plan My Kerala Trip
          </h3>
          <p className="text-xs text-neutral-300 mt-1">
            Connect directly with our local travel designers in Kochi for a customized itinerary & best wholesale rates.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 font-heading">
                Thank You, {name}!
              </h4>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                We have received your Kerala travel preferences. A travel specialist will send your personalized itinerary and pricing directly to your WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Honeypot anti-spam */}
              <input
                type="text"
                name="honeypot"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500 border-r border-neutral-200 pr-2">
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    className="w-full pl-22 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Travel Dates / Month</label>
                  <input
                    type="text"
                    placeholder="e.g. November 2026"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Number of Travellers</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Adults"
                    value={travellers}
                    onChange={(e) => setTravellers(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">Traveller Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Couple', 'Family', 'Friends/Group'] as const).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setTravellerType(type)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 cursor-pointer ${
                        travellerType === type
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {type === 'Couple' && <Heart className="w-3.5 h-3.5" />}
                      {type === 'Family' && <Users className="w-3.5 h-3.5" />}
                      {type === 'Friends/Group' && <Users2 className="w-3.5 h-3.5" />}
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Special Preferences / Requests</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Need hotel with pool, private car, Kerala houseboat cruise..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ backgroundColor: branding.primaryColor || '#047857' }}
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Get Free Custom Plan'}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero spam • Expert advice directly from Kerala</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
