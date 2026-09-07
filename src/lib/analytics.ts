/**
 * Analytics and Conversion Tracking Engine
 * Dispatches events to Google Analytics (gtag), Meta Pixel (fbq), and debug console
 */

export interface AnalyticsEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  try {
    // 1. Log for debugging and observability
    console.log(`📊 [Analytics Event] ${eventName}:`, params);

    // 2. Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }

    // 3. Meta Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('trackCustom', eventName, params);
    }
  } catch (err) {
    console.warn('Analytics tracking error:', err);
  }
};

// Convenience helpers
export const trackHeroCtaClick = (ctaType: string) => {
  trackEvent('hero_cta_click', { cta_type: ctaType, destination: 'Kerala' });
};

export const trackPackageClick = (packageId: string, packageName: string) => {
  trackEvent('package_click', { package_id: packageId, package_name: packageName });
};

export const trackPackageModalOpen = (packageId: string, packageName: string) => {
  trackEvent('package_inquiry_modal_open', { package_id: packageId, package_name: packageName });
};

export const trackLeadSubmission = (leadId: string, type: string, packageName?: string) => {
  trackEvent('lead_form_submission', { lead_id: leadId, inquiry_type: type, package_name: packageName });
};

export const trackWhatsAppClick = (source: string) => {
  trackEvent('whatsapp_click', { click_source: source });
};

export const trackCustomTripInquiry = () => {
  trackEvent('custom_trip_inquiry', { form_type: 'custom_trip_section' });
};

export const trackExitPopupSubmission = () => {
  trackEvent('exit_popup_submission', { form_type: 'exit_intent' });
};
