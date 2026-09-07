export interface PackageItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  duration: string;
  image: string;
  destinations: string;
  shortDescription: string;
  basicItinerary: string;
  completeItinerary: Array<{ day: number; title: string; desc: string; meals?: string; stay?: string }>;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  hotelInformation: string;
  transportationInformation: string;
  featured?: boolean;
  isFeatured?: boolean;
  published?: boolean;
  isPublished?: boolean;
  tag?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadItem {
  id: string;
  name: string;
  mobile: string;
  packageId?: string;
  packageName?: string;
  inquiryType: 'PACKAGE_DETAIL' | 'CUSTOM_TRIP' | 'SERVICE_INQUIRY' | 'EXIT_POPUP';
  travelDate?: string;
  travellers?: string;
  notes?: string;
  status: 'New' | 'Contacted' | 'Interested' | 'Converted' | 'Lost';
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandingData {
  id?: string;
  companyName: string;
  companyTagline?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  tagline?: string;
  footerDescription: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
}

export type BrandingConfig = BrandingData;

export interface SettingsData {
  phoneNumber: string;
  whatsappNumber: string;
  contactEmail: string;
  officeAddress?: string;
  notificationEmail?: string;
  emailAlertsEnabled?: boolean;
}

export type SystemSettings = SettingsData;

export interface AdminFullSettings extends SettingsData {
  id: string;
  notificationEmail: string;
  updatedAt: string;
}

export interface TestimonialItem {
  id: string;
  customerName: string;
  travellerType: string;
  destination: string;
  review: string;
  rating: number;
  date: string;
  avatarUrl?: string;
}

export interface DashboardStats {
  totalLeads: number;
  todayLeads: number;
  totalPackages: number;
  publishedPackages: number;
  statusCounts: {
    New: number;
    Contacted: number;
    Interested: number;
    Converted: number;
    Lost: number;
  };
  recentLeads: LeadItem[];
}
