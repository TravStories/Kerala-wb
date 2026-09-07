import React, { useState } from 'react';
import { Palette, Image as ImageIcon, Save, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandingConfig } from '../../types';

interface AdminBrandingProps {
  adminToken: string;
}

export const AdminBranding: React.FC<AdminBrandingProps> = ({ adminToken }) => {
  const { branding, updateBranding } = useApp();

  const [companyName, setCompanyName] = useState(branding.companyName || 'TravStories');
  const [tagline, setTagline] = useState(branding.companyTagline || 'Authentic Kerala Travel Experiences');
  const [logoUrl, setLogoUrl] = useState(branding.logoUrl || '');
  const [primaryColor, setPrimaryColor] = useState(branding.primaryColor || '#047857');
  const [secondaryColor, setSecondaryColor] = useState(branding.secondaryColor || '#064e3b');
  const [accentColor, setAccentColor] = useState(branding.accentColor || '#f97316');
  const [footerDesc, setFooterDesc] = useState(branding.footerDescription || '');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const updated: Partial<BrandingConfig> = {
      companyName,
      companyTagline: tagline,
      logoUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      footerDescription: footerDesc
    };

    try {
      const res = await fetch('/api/admin/branding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify(updated)
      });

      if (!res.ok) throw new Error('Failed to update branding settings');

      const data = await res.json();
      updateBranding(data);
      setSuccessMsg('Branding and color palette updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating branding');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-neutral-900">
          Company Branding & Visual Identity
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Customize company logo, brand color accents, tagline, and footer representation.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-6 sm:p-8 space-y-6">
        
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

        {/* Brand Name & Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1">Company Name</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1">Company Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Logo URL & Live Preview */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-neutral-800">
            Company Logo URL (Optional, or uses sleek typographic mark)
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
            {logoUrl && (
              <div className="h-10 px-3 bg-neutral-100 rounded-xl flex items-center border border-neutral-200">
                <img src={logoUrl} alt="Preview" className="h-6 w-auto object-contain" referrerPolicy="no-referrer" />
              </div>
            )}
          </div>
        </div>

        {/* Color Customization */}
        <div>
          <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-emerald-700" />
            <span>Brand Colors & CSS Variables</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Primary Color */}
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
              <span className="block text-xs font-bold text-neutral-700">Primary Color (Emerald)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-neutral-300 p-0.5"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-24 p-1.5 text-xs font-mono rounded-lg border border-neutral-300"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
              <span className="block text-xs font-bold text-neutral-700">Secondary Color (Deep)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-neutral-300 p-0.5"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-24 p-1.5 text-xs font-mono rounded-lg border border-neutral-300"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
              <span className="block text-xs font-bold text-neutral-700">Accent Color (CTA Orange)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-neutral-300 p-0.5"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-24 p-1.5 text-xs font-mono rounded-lg border border-neutral-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Description */}
        <div>
          <label className="block text-xs font-bold text-neutral-800 mb-1">
            Footer Bio & Company Description
          </label>
          <textarea
            rows={3}
            value={footerDesc}
            onChange={(e) => setFooterDesc(e.target.value)}
            placeholder="Kerala's premier experiential travel company..."
            className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Branding Changes'}</span>
        </button>

      </form>
    </div>
  );
};
