import React, { useState } from 'react';
import { Settings as SettingsIcon, Mail, Phone, MessageSquare, MapPin, Instagram, Facebook, Youtube, Save, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SystemSettings } from '../../types';

interface AdminSettingsProps {
  adminToken: string;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ adminToken }) => {
  const { settings, updateSettings, branding, updateBranding } = useApp();

  // Notification & contact fields
  const [notificationEmail, setNotificationEmail] = useState(settings.notificationEmail || 'sales.travstories@gmail.com');
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(settings.emailAlertsEnabled !== false);
  const [phoneNumber, setPhoneNumber] = useState(settings.phoneNumber || '+91 98470 12345');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '+91 98470 12345');
  const [contactEmail, setContactEmail] = useState(settings.contactEmail || 'sales.travstories@gmail.com');
  const [officeAddress, setOfficeAddress] = useState(settings.officeAddress || 'Marine Drive, Kochi, Kerala 682031');

  // Social URLs (saved with branding)
  const [instagramUrl, setInstagramUrl] = useState(branding.instagramUrl || 'https://instagram.com/travstories');
  const [facebookUrl, setFacebookUrl] = useState(branding.facebookUrl || 'https://facebook.com/travstories');
  const [youtubeUrl, setYoutubeUrl] = useState(branding.youtubeUrl || 'https://youtube.com/@travstories');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const updatedSettings: Partial<SystemSettings> = {
      notificationEmail,
      emailAlertsEnabled,
      phoneNumber,
      whatsappNumber,
      contactEmail,
      officeAddress
    };

    try {
      // 1. Save settings
      const resSettings = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify(updatedSettings)
      });

      if (!resSettings.ok) throw new Error('Failed to update system settings');
      const dataSettings = await resSettings.json();
      updateSettings(dataSettings);

      // 2. Save social links into branding
      const resBranding = await fetch('/api/admin/branding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({
          instagramUrl,
          facebookUrl,
          youtubeUrl
        })
      });

      if (resBranding.ok) {
        const dataBranding = await resBranding.json();
        updateBranding(dataBranding);
      }

      setSuccessMsg('Settings saved successfully! Email alerts and phone numbers updated.');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-neutral-900">
          Admin Settings & Lead Notifications
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Configure where inquiries are routed, customer contact numbers, WhatsApp links, and social accounts.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-6 sm:p-8 space-y-8">
        
        {successMsg && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl p-3.5 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-3.5 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SECTION 1: Lead Notification Settings */}
        <div className="space-y-4">
          <div className="border-b border-neutral-100 pb-2">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-700" />
              <span>Lead Notification Email Settings</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Every customer inquiry submitted on the website sends an instant lead alert here.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Admin Notification Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                placeholder="sales.travstories@gmail.com"
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Configured: sales.travstories@gmail.com (Dynamic, never hardcoded)
              </span>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlertsEnabled}
                  onChange={(e) => setEmailAlertsEnabled(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-700 w-4 h-4"
                />
                <div>
                  <span className="block text-xs font-bold text-neutral-800">Send Instant Email Alerts</span>
                  <span className="text-[11px] text-neutral-500">Log notification whenever a visitor submits inquiry</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 2: Customer Contact Settings */}
        <div className="space-y-4">
          <div className="border-b border-neutral-100 pb-2">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>Contact Details & WhatsApp</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Displayed in the navbar, header, floating button, and footer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98470 12345"
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 98470 12345"
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">Public Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="sales.travstories@gmail.com"
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">Office Address</label>
              <input
                type="text"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                placeholder="Marine Drive, Kochi, Kerala 682031"
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Social Media Settings */}
        <div className="space-y-4">
          <div className="border-b border-neutral-100 pb-2">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Instagram className="w-4 h-4 text-emerald-700" />
              <span>Social Media Profiles</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Links shown in the footer and social badges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">Instagram URL</label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">Facebook URL</label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">YouTube Channel URL</label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
