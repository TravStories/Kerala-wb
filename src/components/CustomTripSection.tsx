import React, { useState } from 'react';
import { Sparkles, Send, ShieldCheck, CheckCircle2, User, Phone, Calendar, Users, Heart, Users2, Compass, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { trackCustomTripInquiry, trackLeadSubmission } from '../lib/analytics';

export const CustomTripSection: React.FC = () => {
  const { branding, unlockPackage } = useApp();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [travelDates, setTravelDates] = useState('');
  const [travellers, setTravellers] = useState('2');
  const [travellerType, setTravellerType] = useState<'Couple' | 'Family' | 'Friends/Group'>('Couple');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          travelDate: travelDates || 'Flexible / Planning',
          travellers: `${travellers} Pax (${travellerType})`,
          notes: notes.trim(),
          honeypot
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }

      trackCustomTripInquiry();
      trackLeadSubmission(data.leadId || 'custom', 'CUSTOM_TRIP');
      unlockPackage(undefined, { name: name.trim(), mobile: mobile.trim() });

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-neutral-900 text-white relative overflow-hidden" id="custom-trip">
      {/* Background visual accents */}
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-700/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-sky-700/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailor-Made Holidays</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white leading-tight">
              Can’t Find Your Perfect Kerala Package?
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Tell us your travel plan and our Kerala travel experts will create a personalised itinerary for you. Whether you want extra days in Munnar, a secluded private pool villa in Marari, or a multi-room family houseboat, we make it happen.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-neutral-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-800/80 text-emerald-300 flex items-center justify-center shrink-0">
                  ✓
                </div>
                <span>100% Flexible routes, hotel grades & transport options</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-800/80 text-emerald-300 flex items-center justify-center shrink-0">
                  ✓
                </div>
                <span>Free customized day-by-day plan within 30 minutes</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-800/80 text-emerald-300 flex items-center justify-center shrink-0">
                  ✓
                </div>
                <span>Special honeymoon discounts & family package perks</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 text-neutral-900 shadow-2xl border border-white/10">
              
              {isSuccess ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-neutral-900">
                    Your Custom Trip Request is Received!
                  </h3>
                  <p className="text-sm text-neutral-600 max-w-md mx-auto">
                    Thank you, <strong>{name}</strong>! Our Kerala travel expert is preparing your customized itinerary and will reach out to <strong>+91 {mobile}</strong> via WhatsApp / Call shortly.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Submit Another Plan
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mb-2">
                    <h3 className="text-xl font-bold font-heading text-neutral-900">
                      Request Your Custom Kerala Itinerary
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Fill out this quick form — our travel designers will craft your dream escape.
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-3 text-xs flex items-center gap-2">
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

                  {/* Name and Mobile Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
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
                          placeholder="10-digit number"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                          className="w-full pl-22 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dates & Number of Travellers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Preferred Travel Dates / Month
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. Mid Oct / Diwali"
                          value={travelDates}
                          onChange={(e) => setTravelDates(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Number of Travellers
                      </label>
                      <div className="relative">
                        <Users className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. 2 Adults, 1 Child"
                          value={travellers}
                          onChange={(e) => setTravellers(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Traveller Type Selector */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                      Traveller Type
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(['Couple', 'Family', 'Friends/Group'] as const).map((type) => {
                        const isSelected = travellerType === type;
                        return (
                          <button
                            type="button"
                            key={type}
                            onClick={() => setTravellerType(type)}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                                : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                            }`}
                          >
                            {type === 'Couple' && <Heart className="w-3.5 h-3.5" />}
                            {type === 'Family' && <Users className="w-3.5 h-3.5" />}
                            {type === 'Friends/Group' && <Users2 className="w-3.5 h-3.5" />}
                            <span>{type}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Notes */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Any specific preferences? (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Want private pool villa in Munnar, vegetarian meals, airport pickup from Kochi..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ backgroundColor: branding.primaryColor || '#047857' }}
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending Request...' : 'Plan My Custom Kerala Trip'}</span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free consultation • No obligation to book • Fast response</span>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
