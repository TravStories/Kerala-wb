import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrendingSearches } from './components/TrendingSearches';
import { PackagesSection } from './components/PackagesSection';
import { DestinationsSection } from './components/DestinationsSection';
import { WhyVisitKerala } from './components/WhyVisitKerala';
import { TravelServicesSection } from './components/TravelServicesSection';
import { CustomTripSection } from './components/CustomTripSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { TravelPlanningGuide } from './components/TravelPlanningGuide';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { FloatingWidgets } from './components/FloatingWidgets';
import { LeadModal } from './components/LeadModal';
import { PackageDetailModal } from './components/PackageDetailModal';
import { CustomTripModal } from './components/CustomTripModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPortal } from './components/admin/AdminPortal';
import { PackageItem } from './types';

const MainAppContent: React.FC = () => {
  const { branding } = useApp();

  // Admin routing state
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return window.location.hash.includes('admin') || window.location.pathname.startsWith('/admin');
  });
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('travstories_admin_token');
  });

  // Package modal states
  const [gatingPkg, setGatingPkg] = useState<PackageItem | null>(null);
  const [activeDetailPkg, setActiveDetailPkg] = useState<PackageItem | null>(null);

  // Sync hash changes (e.g. user types #admin or clicks Admin in footer)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.includes('admin')) {
        setIsAdminMode(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenAdmin = () => {
    window.location.hash = '#admin';
    setIsAdminMode(true);
  };

  const handleBackToWebsite = () => {
    window.location.hash = '';
    setIsAdminMode(false);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('travstories_admin_token');
    setAdminToken(null);
  };

  // If Admin mode is requested:
  if (isAdminMode) {
    if (!adminToken) {
      return (
        <AdminLogin
          onLoginSuccess={(token) => setAdminToken(token)}
          onBackToWebsite={handleBackToWebsite}
        />
      );
    }
    return (
      <AdminPortal
        adminToken={adminToken}
        onLogout={handleAdminLogout}
        onBackToWebsite={handleBackToWebsite}
      />
    );
  }

  // Public Travel Website
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-emerald-700 selection:text-white flex flex-col font-sans">
      
      {/* Header & Navigation */}
      <Navbar onOpenAdmin={handleOpenAdmin} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero Section with fast quote lead generation */}
        <HeroSection />

        {/* 2. Trending Searches Quick Filter Pills */}
        <TrendingSearches />

        {/* 3. Kerala Tour Packages Section (with Lead Gating) */}
        <PackagesSection
          onOpenLeadGate={(pkg) => setGatingPkg(pkg)}
          onOpenDetail={(pkg) => setActiveDetailPkg(pkg)}
        />

        {/* 4. Top Kerala Destinations */}
        <DestinationsSection />

        {/* 5. Sensory & Cultural Storytelling: Why Visit Kerala */}
        <WhyVisitKerala />

        {/* 6. Complete Travel Services: Packages, Hotels, Car Rentals */}
        <TravelServicesSection />

        {/* 7. Custom Kerala Trip Planner Form */}
        <CustomTripSection />

        {/* 8. The TravStories Advantage / Why Choose Us */}
        <WhyChooseUsSection />

        {/* 9. In-depth Kerala Travel Planning Guide & Seasonality */}
        <TravelPlanningGuide />

        {/* 10. Real Customer Reviews & Feedback */}
        <TestimonialsSection />

        {/* 11. Frequently Asked Questions (with FAQ Schema) */}
        <FaqSection />

        {/* 12. Final High-Impact Conversion Call to Action */}
        <FinalCtaSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Floating WhatsApp CTA, Mobile Sticky CTA & Desktop Exit Intent Popup */}
      <FloatingWidgets />

      {/* Lead Gating Modal (Before unlocking day-wise itinerary & rates) */}
      {gatingPkg && (
        <LeadModal
          pkg={gatingPkg}
          onClose={() => setGatingPkg(null)}
          onSuccess={(unlockedPkg) => {
            setGatingPkg(null);
            setActiveDetailPkg(unlockedPkg);
          }}
        />
      )}

      {/* Complete Unlocked Package Details Modal */}
      {activeDetailPkg && (
        <PackageDetailModal
          pkg={activeDetailPkg}
          onClose={() => setActiveDetailPkg(null)}
        />
      )}

      {/* Global Custom Trip Request Modal */}
      <CustomTripModal />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
