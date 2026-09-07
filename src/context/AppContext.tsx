import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandingData, SettingsData, PackageItem } from '../types';

interface AppContextType {
  branding: BrandingData;
  settings: SettingsData;
  packages: PackageItem[];
  isLoading: boolean;
  unlockedPackages: Record<string, boolean>; // packageId -> boolean or global unlocked
  isGloballyUnlocked: boolean;
  userLeadInfo: { name: string; mobile: string } | null;
  unlockPackage: (packageId?: string, userInfo?: { name: string; mobile: string }) => void;
  activePackageForInquiry: PackageItem | null;
  setActivePackageForInquiry: (pkg: PackageItem | null) => void;
  activePackageForDetails: PackageItem | null;
  setActivePackageForDetails: (pkg: PackageItem | null) => void;
  isCustomTripModalOpen: boolean;
  setIsCustomTripModalOpen: (open: boolean) => void;
  refreshPublicData: () => Promise<void>;
}

const defaultBranding: BrandingData = {
  id: 'brand-1',
  companyName: 'TravStories',
  logoUrl: '',
  primaryColor: '#047857',
  secondaryColor: '#0284c7',
  accentColor: '#f97316',
  tagline: 'Handcrafted Kerala Journeys',
  footerDescription: "Kerala's premier experiential travel company. We curate handcrafted holidays featuring misty hills, tranquil backwaters, authentic houseboats, and serene beaches.",
  instagramUrl: 'https://instagram.com/travstories',
  facebookUrl: 'https://facebook.com/travstories',
  youtubeUrl: 'https://youtube.com/@travstories'
};

const defaultSettings: SettingsData = {
  phoneNumber: '+91 98765 43210',
  whatsappNumber: '+919876543210',
  contactEmail: 'sales.travstories@gmail.com',
  officeAddress: 'Marine Drive, Kochi, Kerala 682031, India'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingData>(defaultBranding);
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lead gating state
  const [unlockedPackages, setUnlockedPackages] = useState<Record<string, boolean>>({});
  const [isGloballyUnlocked, setIsGloballyUnlocked] = useState(false);
  const [userLeadInfo, setUserLeadInfo] = useState<{ name: string; mobile: string } | null>(null);

  // Modals state
  const [activePackageForInquiry, setActivePackageForInquiry] = useState<PackageItem | null>(null);
  const [activePackageForDetails, setActivePackageForDetails] = useState<PackageItem | null>(null);
  const [isCustomTripModalOpen, setIsCustomTripModalOpen] = useState(false);

  // Load saved session unlock info
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('travstories_lead_session');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.mobile) {
          setUserLeadInfo(parsed);
          setIsGloballyUnlocked(true);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const refreshPublicData = async () => {
    try {
      setIsLoading(true);
      const [bRes, sRes, pRes] = await Promise.all([
        fetch('/api/public/branding'),
        fetch('/api/public/settings'),
        fetch('/api/public/packages')
      ]);

      if (bRes.ok) {
        const bData = await bRes.json();
        setBranding(bData);
        // Apply dynamic brand colors to document root
        if (bData.primaryColor) {
          document.documentElement.style.setProperty('--brand-primary', bData.primaryColor);
        }
        if (bData.secondaryColor) {
          document.documentElement.style.setProperty('--brand-secondary', bData.secondaryColor);
        }
        if (bData.accentColor) {
          document.documentElement.style.setProperty('--brand-accent', bData.accentColor);
        }
      }

      if (sRes.ok) {
        const sData = await sRes.json();
        setSettings(sData);
      }

      if (pRes.ok) {
        const pData = await pRes.json();
        setPackages(pData);
      }
    } catch (err) {
      console.error('Failed to load public data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPublicData();
  }, []);

  const unlockPackage = (packageId?: string, userInfo?: { name: string; mobile: string }) => {
    setIsGloballyUnlocked(true);
    if (packageId) {
      setUnlockedPackages(prev => ({ ...prev, [packageId]: true }));
    }
    if (userInfo) {
      setUserLeadInfo(userInfo);
      try {
        localStorage.setItem('travstories_lead_session', JSON.stringify(userInfo));
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        branding,
        settings,
        packages,
        isLoading,
        unlockedPackages,
        isGloballyUnlocked,
        userLeadInfo,
        unlockPackage,
        activePackageForInquiry,
        setActivePackageForInquiry,
        activePackageForDetails,
        setActivePackageForDetails,
        isCustomTripModalOpen,
        setIsCustomTripModalOpen,
        refreshPublicData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
