import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

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
  featured: boolean;
  published: boolean;
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
  id: string;
  companyName: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  tagline: string;
  footerDescription: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  updatedAt: string;
}

export interface SettingsData {
  id: string;
  notificationEmail: string;
  phoneNumber: string;
  whatsappNumber: string;
  contactEmail: string;
  officeAddress?: string;
  updatedAt: string;
}

export interface AdminUserData {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
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

export interface DatabaseSchema {
  adminUsers: AdminUserData[];
  packages: PackageItem[];
  leads: LeadItem[];
  branding: BrandingData;
  settings: SettingsData;
  testimonials: TestimonialItem[];
  emailLogs: Array<{ id: string; to: string; subject: string; body: string; timestamp: string }>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'travstories-db.json');

const INITIAL_PACKAGES: PackageItem[] = [
  {
    id: 'pkg-1',
    name: 'Kochi – Munnar – Thekkady – Alleppey Classic Tour',
    slug: 'kochi-munnar-thekkady-alleppey-tour',
    price: 18499,
    originalPrice: 24999,
    duration: '6 Nights / 7 Days',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop',
    destinations: 'Kochi (1N) – Munnar (2N) – Thekkady (1N) – Alleppey Houseboat (1N) – Marari/Kochi (1N)',
    shortDescription: 'The quintessential Kerala holiday covering mist-clad tea gardens, aromatic spice plantations, Periyar wildlife reserve, and an unforgettable backwater houseboat cruise.',
    basicItinerary: 'Day 1: Kochi arrival & Fort Kochi | Day 2-3: Munnar Tea Gardens & Eravikulam | Day 4: Thekkady Wildlife Sanctuary & Spice Plantation | Day 5: Alleppey Deluxe Houseboat Backwater Cruise | Day 6: Marari Beach relaxation | Day 7: Kochi departure',
    completeItinerary: [
      {
        day: 1,
        title: 'Arrival in Kochi & Heritage Sightseeing',
        desc: 'Meet our friendly chauffeur at Cochin International Airport / Ernakulam Railway Station. Transfer to your handpicked hotel. In the afternoon, visit iconic Chinese Fishing Nets, St. Francis Church, Mattancherry Dutch Palace, and the vibrant Jewish Synagogue.',
        meals: 'Dinner included',
        stay: 'Premium Hotel in Fort Kochi / Ernakulam'
      },
      {
        day: 2,
        title: 'Scenic Drive to Munnar via Cheeyappara Waterfalls',
        desc: 'Enjoy breakfast and embark on a picturesque 4-hour drive up into the Western Ghats. Stop en route at Cheeyappara and Valara waterfalls. Check-in to your resort surrounded by lush mist-wrapped cardamom hills. Evening free for local town visit.',
        meals: 'Breakfast & Dinner',
        stay: 'Resort in Munnar'
      },
      {
        day: 3,
        title: 'Munnar Tea Estates, Eravikulam & Mattupetty Dam',
        desc: 'Full day excursion in Munnar. Visit Eravikulam National Park (home to the endangered Nilgiri Tahr), Tata Tea Museum, Mattupetty Lake & Dam, Echo Point, and Kundala Dam. Experience boating surrounded by rolling tea gardens.',
        meals: 'Breakfast & Dinner',
        stay: 'Resort in Munnar'
      },
      {
        day: 4,
        title: 'Munnar to Thekkady (Periyar Tiger Reserve)',
        desc: 'Drive to Thekkady (Periyar). Check in to your forest-edge resort. In the afternoon, visit an organic spice plantation with a guided herbal tour. Optional evening Periyar lake boating or traditional Kathakali & Kalaripayattu martial arts show.',
        meals: 'Breakfast & Dinner',
        stay: 'Jungle Resort in Thekkady'
      },
      {
        day: 5,
        title: 'Thekkady to Alleppey – Private Traditional Houseboat',
        desc: 'Board your private handcrafted Kerala houseboat (Kettuvallam) at 12:00 PM. Glide through tranquil palm-fringed backwaters, paddy fields, and lagoons. Relish authentic freshly prepared Kerala cuisine on board with personal chef and crew.',
        meals: 'Welcome Drink, Lunch, High Tea & Dinner',
        stay: 'Private Deluxe Houseboat in Alleppey'
      },
      {
        day: 6,
        title: 'Alleppey to Marari Beach & Backwater Serenity',
        desc: 'Awake to a peaceful sunrise over the backwaters. After a traditional breakfast, disembark at 9:00 AM and drive to nearby pristine Marari Beach. Relax under swaying coconut groves, witness fishing catamarans, and unwind.',
        meals: 'Breakfast & Dinner',
        stay: 'Beachside Resort in Marari / Kochi'
      },
      {
        day: 7,
        title: 'Souvenir Shopping & Departure from Kochi',
        desc: 'Savor a leisurely breakfast. Explore Lulu Mall or local spice bazaars for organic black pepper, cardamom, banana chips, and handwoven textiles. Your private chauffeur drops you at Kochi Airport/Station with beautiful Kerala memories.',
        meals: 'Breakfast included',
        stay: 'Departure'
      }
    ],
    highlights: [
      'Private AC vehicle for all 7 days with knowledgeable English/Hindi speaking driver',
      'Exclusive private Alleppey Houseboat stay with all traditional Kerala meals included',
      '2 Nights in scenic Munnar hills with tea garden views',
      'Periyar Spice Plantation guided walking tour',
      'Flexible customizable schedule tailored to your pace'
    ],
    inclusions: [
      'Accommodation for 6 Nights in handpicked 3-Star/4-Star boutique hotels & resorts',
      '1 Night in exclusive Private AC Deluxe Houseboat in Alleppey',
      'Daily delicious buffet breakfast at all hotels',
      'All meals (Lunch, Evening snacks, Dinner, Breakfast) during Houseboat stay',
      'Dedicated AC Sedan (Dzire/Etios) or AC Innova for all transfers and sightseeing',
      'Fuel charges, toll gate fees, parking charges, and driver allowances',
      '24/7 dedicated Kerala local travel expert assistance on call'
    ],
    exclusions: [
      'Airfare / Train tickets to/from Kochi',
      'Entry monument fees, national park permits, or boat tickets (paid directly)',
      'Personal expenses such as laundry, phone calls, Ayurvedic massages',
      'Optional activities: Elephant rides, Jeep safari, Cultural shows'
    ],
    hotelInformation: '3-Star Premium / 4-Star Deluxe properties with high hygiene ratings, scenic mountain/backwater views, and prompt hospitality.',
    transportationInformation: 'Private dedicated AC Sedan (for 2-3 guests) or AC Innova Crysta (for 4-6 guests) with experienced courteous local driver.',
    featured: true,
    published: true,
    tag: 'Best Seller',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pkg-2',
    name: 'Munnar & Alleppey Honeymoon Romance Special',
    slug: 'munnar-alleppey-honeymoon-package',
    price: 15999,
    originalPrice: 21999,
    duration: '4 Nights / 5 Days',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop',
    destinations: 'Kochi Arrival – Munnar (3N) – Alleppey Houseboat (1N) – Kochi Departure',
    shortDescription: 'Specially crafted for newlyweds. Misty mountain cuddles, private candlelit dinner, flower bed decoration in a tranquil Alleppey houseboat.',
    basicItinerary: 'Day 1: Kochi to Munnar scenic drive | Day 2: Munnar Tea Gardens & Echo Point | Day 3: Top Station & Candlelight Dinner | Day 4: Private Alleppey Houseboat Cruise | Day 5: Kochi departure',
    completeItinerary: [
      {
        day: 1,
        title: 'Kochi Arrival & Journey to Romantic Munnar',
        desc: 'Warm welcome by your private chauffeur. Ascend the misty Ghats, pausing at scenic viewpoints for memorable couple photos. Check in to your honeymoon room with mountain valley panorama.',
        meals: 'Welcome drink & Dinner',
        stay: 'Honeymoon Valley Resort, Munnar'
      },
      {
        day: 2,
        title: 'Munnar Tea Valley, Mattupetty & Echo Point',
        desc: 'Explore the verdant tea slopes hand-in-hand. Whisper your love at Echo Point, enjoy a romantic shikara boat ride on Kundala Lake, and visit the Rose Gardens.',
        meals: 'Breakfast & Candlelight Dinner',
        stay: 'Honeymoon Valley Resort, Munnar'
      },
      {
        day: 3,
        title: 'Eravikulam Tahr Spotting & Leisure Day',
        desc: 'Morning visit to Rajamalai peak in Eravikulam National Park. Afternoon at your resort for private spa relaxation, warm tea, and quiet romantic moments amidst misty breezes.',
        meals: 'Breakfast & Dinner',
        stay: 'Honeymoon Valley Resort, Munnar'
      },
      {
        day: 4,
        title: 'Munnar to Alleppey – Romantic Houseboat Overnight',
        desc: 'Board your private honeymoon houseboat. Enjoy welcome coconut water, freshly caught Karimeen fish fry lunch, sunset backwater cruising, special honeymoon cake, and flower bed decor.',
        meals: 'All meals + Honeymoon Cake & Flower Decor',
        stay: 'Private Honeymoon Houseboat, Alleppey'
      },
      {
        day: 5,
        title: 'Morning Cruise & Transfer to Kochi',
        desc: 'Wake up to the soft lap of water and birdsong. After breakfast, transfer back to Kochi for departure flight/train with a heart full of memories.',
        meals: 'Breakfast included',
        stay: 'Departure'
      }
    ],
    highlights: [
      'Special Honeymoon inclusions: Flower Bed decoration, Honeymoon Cake & Candlelight Dinner',
      'Exclusive private 1-bedroom AC Houseboat cruise through Alleppey backwaters',
      '3 Romantic nights in Munnar misty tea garden resort',
      'Comfortable private AC sedan dedicated exclusively for the couple'
    ],
    inclusions: [
      '4 Nights luxury accommodation (3N Munnar + 1N Private Houseboat)',
      'Complimentary Honeymoon Cake and Romantic Flower Bed decoration on Houseboat',
      '1 Romantic Candlelight Dinner in Munnar',
      'Daily breakfast at Munnar resort',
      'All meals on board Alleppey Houseboat (Lunch, High Tea, Dinner, Breakfast)',
      'Private AC Sedan throughout with courteous chauffeur',
      'All taxes, tolls, parking, and driver allowances'
    ],
    exclusions: [
      'Airfare or train tickets',
      'Sightseeing entrance tickets or optional couple Ayurvedic spa massages',
      'Personal laundry, beverages, and tips'
    ],
    hotelInformation: 'Handpicked romantic honeymoon properties with scenic balconies and special couple hospitality.',
    transportationInformation: 'Private sanitized AC Sedan (Swift Dzire/Etios) for the entire tour.',
    featured: true,
    published: true,
    tag: 'Honeymoon Special',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pkg-3',
    name: 'Complete Kerala Family Vacation (Hills, Wildlife & Beaches)',
    slug: 'complete-kerala-family-vacation',
    price: 24999,
    originalPrice: 32999,
    duration: '7 Nights / 8 Days',
    image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=1000&auto=format&fit=crop',
    destinations: 'Kochi (1N) – Munnar (2N) – Thekkady (1N) – Alleppey (1N) – Kovalam/Trivandrum (2N)',
    shortDescription: 'The ultimate family package crafted for all ages. Kids love the elephant sanctuaries and beaches, while parents relax in the misty hills and tranquil backwaters.',
    basicItinerary: 'Day 1: Kochi arrival | Day 2-3: Munnar hills & tea gardens | Day 4: Thekkady wildlife & spice plantation | Day 5: Alleppey backwaters | Day 6-7: Kovalam beach & Trivandrum temple | Day 8: Trivandrum departure',
    completeItinerary: [
      {
        day: 1,
        title: 'Arrival in Kochi & Kochi Sights',
        desc: 'Warm welcome at Kochi airport/railway station. Transfer to family-friendly hotel. Visit Marine Drive and Jewish Town.',
        meals: 'Dinner included',
        stay: 'Kochi Hotel'
      },
      {
        day: 2,
        title: 'Kochi to Munnar via Waterfalls',
        desc: 'Enjoy a scenic drive through hills, stopping at Cheeyappara waterfalls. Check in to Munnar family resort.',
        meals: 'Breakfast & Dinner',
        stay: 'Munnar Family Resort'
      },
      {
        day: 3,
        title: 'Munnar Family Sightseeing',
        desc: 'Visit Eravikulam National Park to spot mountain goats. Enjoy speed boating at Mattupetty Dam and Echo Point shouts.',
        meals: 'Breakfast & Dinner',
        stay: 'Munnar Family Resort'
      },
      {
        day: 4,
        title: 'Munnar to Thekkady Elephant & Spice Tour',
        desc: 'Scenic drive to Periyar. Guided family walk through spice farm. Optional elephant interaction and evening cultural martial arts show.',
        meals: 'Breakfast & Dinner',
        stay: 'Thekkady Jungle Resort'
      },
      {
        day: 5,
        title: 'Thekkady to Alleppey Houseboat Cruise',
        desc: 'Board your private family houseboat in Alleppey. Cruise picturesque canals with delicious traditional Kerala lunch and dinner.',
        meals: 'Lunch, Snacks & Dinner',
        stay: 'Private Houseboat, Alleppey'
      },
      {
        day: 6,
        title: 'Alleppey to Kovalam Golden Beaches',
        desc: 'Disembark and drive south along the Arabian coastline to famous Kovalam beach. Check in to beachside resort. Sunset at Lighthouse Beach.',
        meals: 'Breakfast & Dinner',
        stay: 'Kovalam Beach Resort'
      },
      {
        day: 7,
        title: 'Kovalam Beach & Trivandrum Heritage',
        desc: 'Visit Padmanabhaswamy Temple (architectural marvel), Napier Museum, and enjoy swimming and beach sports at Samudra Beach.',
        meals: 'Breakfast & Dinner',
        stay: 'Kovalam Beach Resort'
      },
      {
        day: 8,
        title: 'Departure from Trivandrum (TRV)',
        desc: 'After breakfast, checkout and transfer to Trivandrum Airport / Railway Station for journey home with fond family memories.',
        meals: 'Breakfast included',
        stay: 'Departure'
      }
    ],
    highlights: [
      'Comprehensive itinerary covering hills, forests, backwaters, and golden beaches',
      'Kid-friendly sightseeing with boat rides, elephant centers, and interactive spice gardens',
      'Spacious AC Innova Crysta for comfortable family road trips',
      'Private Alleppey Houseboat experience with dedicated family crew'
    ],
    inclusions: [
      '7 Nights accommodation in family-friendly 3/4-star verified hotels',
      '1 Night in Private Deluxe Houseboat with all meals',
      'Daily breakfast & dinner at hotels',
      'Dedicated AC Innova / Sedan with experienced driver',
      'All toll, fuel, parking, driver allowance included'
    ],
    exclusions: [
      'Flights/train tickets',
      'Entrance fees, camera fees, boat safaris',
      'Items of personal nature'
    ],
    hotelInformation: 'Carefully vetted family-oriented resorts with swimming pools and multi-cuisine restaurants.',
    transportationInformation: 'AC Innova Crysta or Tempo Traveller depending on family party size.',
    featured: true,
    published: true,
    tag: 'Family Choice',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pkg-4',
    name: 'Wayanad Nature, Caves & Rainforest Escape',
    slug: 'wayanad-nature-rainforest-escape',
    price: 11999,
    originalPrice: 16999,
    duration: '3 Nights / 4 Days',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop',
    destinations: 'Calicut (Kozhikode) Arrival – Wayanad (3N) – Calicut Departure',
    shortDescription: 'Discover the mystical rainforests of North Kerala. Edakkal prehistoric caves, Banasura Sagar earthen dam, and Chembra peak vistas.',
    basicItinerary: 'Day 1: Calicut to Wayanad ascent | Day 2: Edakkal Caves & Soochipara Falls | Day 3: Banasura Sagar Dam & Kuruva Island | Day 4: Calicut departure',
    completeItinerary: [
      {
        day: 1,
        title: 'Calicut to Wayanad Ghats',
        desc: 'Meet at Calicut Airport/Station and drive through the dramatic Thamarassery Churam 9 hairpin curves into the cool Wayanad plateau. Visit Pookode Lake and Lakkidi Viewpoint.',
        meals: 'Dinner included',
        stay: 'Wayanad Rainforest Resort'
      },
      {
        day: 2,
        title: 'Prehistoric Edakkal Caves & Soochipara Falls',
        desc: 'Trek up to Edakkal Caves with Neolithic stone carvings dating back thousands of years. In the afternoon, explore the thundering Soochipara Waterfalls nestled inside dense jungle.',
        meals: 'Breakfast & Dinner',
        stay: 'Wayanad Rainforest Resort'
      },
      {
        day: 3,
        title: 'Banasura Sagar Dam & Kuruva Island',
        desc: 'Visit Banasura Sagar, India’s largest earthen dam. Enjoy speedboat rides over misty reservoirs. Afternoon walk in the riverine bamboo forests of Kuruva Dweep.',
        meals: 'Breakfast & Dinner',
        stay: 'Wayanad Rainforest Resort'
      },
      {
        day: 4,
        title: 'Calicut Beach & Departure',
        desc: 'Drive back down to Calicut. Savor authentic Malabar Biryani and Kozhikodan Halwa. Transfer to Calicut Airport/Railway station.',
        meals: 'Breakfast included',
        stay: 'Departure'
      }
    ],
    highlights: [
      'Stay in eco-resorts amidst coffee & cardamom estates',
      'Exploration of the ancient Edakkal Neolithic cave engravings',
      'Speed boating at Banasura Sagar Dam with mountain backdrops',
      'Ideal for nature lovers, photographers, and young weekend travelers'
    ],
    inclusions: [
      '3 Nights accommodation in premium Wayanad nature resort',
      'Daily breakfast and dinner',
      'Dedicated AC vehicle for all transfers and sightseeing',
      'Driver allowances, parking, and toll fees'
    ],
    exclusions: ['Transit to Calicut', 'Activities & park entrance charges'],
    hotelInformation: 'Eco-resorts nestled among tea and coffee estates with jungle walking trails.',
    transportationInformation: 'Private AC Sedan with driver.',
    featured: false,
    published: true,
    tag: 'Adventure & Nature',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pkg-5',
    name: 'Athirappilly Niagara & Alleppey Backwaters Short Break',
    slug: 'athirappilly-alleppey-short-break',
    price: 12499,
    originalPrice: 17499,
    duration: '3 Nights / 4 Days',
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1000&auto=format&fit=crop',
    destinations: 'Kochi Arrival – Athirappilly Waterfalls (1N) – Alleppey Houseboat (1N) – Marari/Kochi (1N)',
    shortDescription: 'Witness India’s majestic Niagara at Athirappilly and sail through the serene Alleppey backwaters on a quick rejuvenating 4-day escape.',
    basicItinerary: 'Day 1: Kochi to Athirappilly Waterfalls | Day 2: Athirappilly to Alleppey Houseboat cruise | Day 3: Alleppey to Marari beach & Fort Kochi | Day 4: Kochi departure',
    completeItinerary: [
      {
        day: 1,
        title: 'Kochi to Athirappilly Waterfalls',
        desc: 'Pick up from Kochi. Scenic drive to Athirappilly, where Bahubali was filmed. Trek down to the base of the thundering 80-foot falls. Check into forest resort.',
        meals: 'Dinner included',
        stay: 'Rainforest Resort, Athirappilly'
      },
      {
        day: 2,
        title: 'Athirappilly to Alleppey Houseboat Check-in',
        desc: 'Drive to Alleppey. Board your luxury private houseboat at noon. Relax as the vessel sails through backwater channels and lagoons.',
        meals: 'Lunch, Tea & Dinner on Houseboat',
        stay: 'Private Houseboat, Alleppey'
      },
      {
        day: 3,
        title: 'Alleppey to Marari Beach & Kochi Heritage',
        desc: 'After morning breakfast on board, head to Marari Beach and Fort Kochi. Stroll through art cafes and see Chinese fishing nets at sunset.',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel in Kochi / Marari'
      },
      {
        day: 4,
        title: 'Departure from Kochi',
        desc: 'Enjoy morning breakfast and souvenir shopping before drop-off at Cochin Airport or Ernakulam Railway Station.',
        meals: 'Breakfast included',
        stay: 'Departure'
      }
    ],
    highlights: [
      'Stand before the mighty 80-foot Athirappilly waterfalls',
      'Overnight cruise in a private Alleppey houseboat',
      'Perfect short getaway for working professionals and couples'
    ],
    inclusions: [
      '3 Nights premium accommodation',
      'All meals on Alleppey Houseboat',
      'Daily breakfast at hotels',
      'Private AC Sedan with courteous chauffeur'
    ],
    exclusions: ['Airfare/Train fare', 'Personal expenses'],
    hotelInformation: 'Forest-facing and backwater boutique properties.',
    transportationInformation: 'AC Sedan with experienced driver.',
    featured: false,
    published: true,
    tag: 'Quick Escape',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pkg-6',
    name: 'Luxury Ayurvedic Wellness & Kumarakom Backwaters',
    slug: 'luxury-ayurvedic-kumarakom-beach',
    price: 34999,
    originalPrice: 44999,
    duration: '5 Nights / 6 Days',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop',
    destinations: 'Kochi (1N) – Kumarakom (2N) – Marari Luxury Beach Resort (2N)',
    shortDescription: 'Ultimate luxury and rejuvenation. Experience 5-star lakeside resorts in Kumarakom, authentic Kerala Ayurvedic Abhyanga massages, and serene private beach villas in Marari.',
    basicItinerary: 'Day 1: Kochi luxury check-in | Day 2-3: Kumarakom luxury lake resort & bird sanctuary | Day 4-5: Marari private beach villa & Ayurvedic wellness | Day 6: Kochi departure',
    completeItinerary: [
      {
        day: 1,
        title: 'Arrival in Kochi & Heritage Luxury',
        desc: 'VIP pick-up in premium SUV. Check in to a 5-star heritage property. Evening sunset yacht cruise on Cochin harbour.',
        meals: 'Dinner included',
        stay: '5-Star Heritage Hotel, Kochi'
      },
      {
        day: 2,
        title: 'Kochi to Kumarakom Lake Resort',
        desc: 'Scenic drive to Kumarakom on the banks of Vembanad Lake. Check in to a luxury lake-view villa with traditional Kerala architecture and private plunge pool.',
        meals: 'Breakfast & Dinner',
        stay: '5-Star Lake Resort, Kumarakom'
      },
      {
        day: 3,
        title: 'Kumarakom Bird Sanctuary & Sunset Cruise',
        desc: 'Early morning bird sanctuary boat ride. Afternoon complimentary traditional Ayurvedic full-body herbal oil massage. Evening private sunset cruise.',
        meals: 'Breakfast & Dinner',
        stay: '5-Star Lake Resort, Kumarakom'
      },
      {
        day: 4,
        title: 'Kumarakom to Marari Private Beach Villa',
        desc: 'Transfer to Marari. Check in to private thatched roof cottage facing the ocean. Unwind with yoga by the beach and fresh organic farm cuisine.',
        meals: 'Breakfast & Dinner',
        stay: 'Luxury Beach Resort, Marari'
      },
      {
        day: 5,
        title: 'Marari Beach Relaxation & Wellness',
        desc: 'Full day of blissful relaxation. Ayurvedic rejuvenation therapy, beach strolls, organic culinary class, and private candlelight dinner on the sand.',
        meals: 'Breakfast & Candlelight Beach Dinner',
        stay: 'Luxury Beach Resort, Marari'
      },
      {
        day: 6,
        title: 'Kochi Departure',
        desc: 'Farewell breakfast overlooking the Arabian Sea. Private transfer to Kochi airport with personalized souvenir gift box.',
        meals: 'Breakfast included',
        stay: 'Departure'
      }
    ],
    highlights: [
      'Stay in world-renowned 5-star lake and beach resorts (Kumarakom Lake Resort / Marari Beach Resort style)',
      'Complimentary authentic Ayurvedic wellness therapy included',
      'Private sunset cruise on Vembanad Lake',
      'Chauffeured luxury SUV for all transfers'
    ],
    inclusions: [
      '5 Nights in 5-star luxury villas and heritage suites',
      'Daily gourmet breakfast & bespoke dinners',
      '1 Complimentary 60-min Authentic Ayurvedic Massage per adult',
      'Private luxury AC SUV with English-speaking chauffeur',
      'Special Candlelight dinner on Marari beach'
    ],
    exclusions: ['Airfare', 'Personal laundry and imported beverages'],
    hotelInformation: 'Top-tier 5-star experiential luxury properties with private pools and world-class spas.',
    transportationInformation: 'Toyota Innova Crysta / Fortuner luxury class.',
    featured: true,
    published: true,
    tag: 'Ultra Luxury',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    customerName: 'Rahul & Priya Sharma',
    travellerType: 'Honeymoon Couple',
    destination: 'Munnar & Alleppey',
    review: 'Our Kerala honeymoon with TravStories was simply magical! The private houseboat in Alleppey with candlelit dinner and cake was breathtaking. Our driver Manoj was so polite, punctual, and knew all the scenic spots in Munnar. Highly recommended!',
    rating: 5,
    date: 'February 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'test-2',
    customerName: 'Vikram & Ananya Deshmukh',
    travellerType: 'Family with 2 Kids',
    destination: 'Munnar, Thekkady & Kovalam',
    review: 'Planning a 7-day trip with two energetic kids could have been stressful, but TravStories took care of everything. Handpicked family resorts with clean pools, spacious Innova, and excellent hotel choices. The kids loved the elephant center and backwater boats!',
    rating: 5,
    date: 'January 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'test-3',
    customerName: 'Arjun Nair & Friends',
    travellerType: 'Group of 6 Friends',
    destination: 'Wayanad & Athirappilly',
    review: 'Best road trip experience! The waterfalls at Athirappilly and Edakkal cave trek in Wayanad were thrilling. Transparent pricing, no hidden costs, and our travel coordinator was available 24/7 on WhatsApp. Will book Kashmir next with them!',
    rating: 5,
    date: 'December 2025',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  }
];

const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'lead-101',
    name: 'Siddharth Verma',
    mobile: '9820123456',
    packageId: 'pkg-1',
    packageName: 'Kochi – Munnar – Thekkady – Alleppey Classic Tour',
    inquiryType: 'PACKAGE_DETAIL',
    travelDate: 'October 2026',
    travellers: '2 Adults',
    notes: 'Requested pure vegetarian food options and top floor hotel rooms.',
    status: 'Contacted',
    source: 'Website Package Modal',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'lead-102',
    name: 'Neha Kapoor',
    mobile: '9811987654',
    packageId: 'pkg-2',
    packageName: 'Munnar & Alleppey Honeymoon Romance Special',
    inquiryType: 'PACKAGE_DETAIL',
    travelDate: 'November 2026',
    travellers: 'Couple',
    notes: 'Honeymoon couple looking for jacuzzi villa upgrade in Munnar.',
    status: 'Interested',
    source: 'Website Package Modal',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'lead-103',
    name: 'Amit Patel',
    mobile: '9909123890',
    packageId: undefined,
    packageName: 'Custom Kerala Itinerary',
    inquiryType: 'CUSTOM_TRIP',
    travelDate: 'December 2026',
    travellers: 'Family of 5 (3 Adults, 2 Kids)',
    notes: 'Wants 6 days covering Munnar & Kovalam with beach resort stay.',
    status: 'New',
    source: 'Custom Trip Form',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load existing db, initializing defaults:', e);
    }

    const defaultAdminHash = bcrypt.hashSync('Admin@TravStories2026', 10);

    const initialData: DatabaseSchema = {
      adminUsers: [
        {
          id: 'admin-1',
          email: 'sales.travstories@gmail.com',
          passwordHash: defaultAdminHash,
          name: 'TravStories Admin',
          role: 'ADMIN'
        }
      ],
      packages: INITIAL_PACKAGES,
      leads: INITIAL_LEADS,
      branding: {
        id: 'brand-1',
        companyName: 'TravStories',
        logoUrl: '',
        faviconUrl: '',
        primaryColor: '#047857', // Deep Tropical Green
        secondaryColor: '#0284c7', // Backwater Blue
        accentColor: '#f97316', // Warm Sunset Orange
        tagline: 'Handcrafted Kerala Journeys',
        footerDescription: "Kerala's premier experiential travel company. We curate handcrafted holidays featuring misty hills, tranquil backwaters, authentic houseboats, and serene beaches.",
        instagramUrl: 'https://instagram.com/travstories',
        facebookUrl: 'https://facebook.com/travstories',
        youtubeUrl: 'https://youtube.com/@travstories',
        updatedAt: new Date().toISOString()
      },
      settings: {
        id: 'settings-1',
        notificationEmail: 'sales.travstories@gmail.com',
        phoneNumber: '+91 98765 43210',
        whatsappNumber: '+919876543210',
        contactEmail: 'sales.travstories@gmail.com',
        officeAddress: 'Marine Drive, Kochi, Kerala 682031, India',
        updatedAt: new Date().toISOString()
      },
      testimonials: INITIAL_TESTIMONIALS,
      emailLogs: []
    };

    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save initial db:', err);
    }

    return initialData;
  }

  public save(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist database to file:', e);
    }
  }

  // Admin Users
  public getAdminByEmail(email: string): AdminUserData | undefined {
    return this.data.adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  // Branding
  public getBranding(): BrandingData {
    return this.data.branding;
  }

  public updateBranding(updates: Partial<BrandingData>): BrandingData {
    this.data.branding = {
      ...this.data.branding,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.branding;
  }

  // Settings
  public getSettings(): SettingsData {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<SettingsData>): SettingsData {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.settings;
  }

  // Packages
  public getPackages(includeUnpublished = false): PackageItem[] {
    if (includeUnpublished) {
      return this.data.packages;
    }
    return this.data.packages.filter(p => p.published);
  }

  public getPackageById(id: string): PackageItem | undefined {
    return this.data.packages.find(p => p.id === id || p.slug === id);
  }

  public createPackage(pkg: Omit<PackageItem, 'id' | 'createdAt' | 'updatedAt'>): PackageItem {
    const newId = 'pkg-' + Date.now();
    const newPkg: PackageItem = {
      ...pkg,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.packages.unshift(newPkg);
    this.save();
    return newPkg;
  }

  public updatePackage(id: string, updates: Partial<PackageItem>): PackageItem | null {
    const index = this.data.packages.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.packages[index] = {
      ...this.data.packages[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.packages[index];
  }

  public deletePackage(id: string): boolean {
    const prevLen = this.data.packages.length;
    this.data.packages = this.data.packages.filter(p => p.id !== id);
    const deleted = this.data.packages.length < prevLen;
    if (deleted) this.save();
    return deleted;
  }

  // Leads
  public getLeads(filters?: { status?: string; packageId?: string; search?: string; startDate?: string; endDate?: string }): LeadItem[] {
    let list = [...this.data.leads];

    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(l => l.status.toLowerCase() === filters.status!.toLowerCase());
    }

    if (filters?.packageId && filters.packageId !== 'ALL') {
      list = list.filter(l => l.packageId === filters.packageId);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.mobile.includes(q) ||
        (l.packageName && l.packageName.toLowerCase().includes(q))
      );
    }

    if (filters?.startDate) {
      list = list.filter(l => new Date(l.createdAt) >= new Date(filters.startDate!));
    }
    if (filters?.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      list = list.filter(l => new Date(l.createdAt) <= end);
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }

  public createLead(leadInput: {
    name: string;
    mobile: string;
    packageId?: string;
    inquiryType: 'PACKAGE_DETAIL' | 'CUSTOM_TRIP' | 'SERVICE_INQUIRY' | 'EXIT_POPUP';
    travelDate?: string;
    travellers?: string;
    notes?: string;
    source?: string;
  }): { lead: LeadItem; notificationEmail: string } {
    let packageName = 'Custom Kerala Trip';
    if (leadInput.packageId) {
      const pkg = this.getPackageById(leadInput.packageId);
      if (pkg) packageName = pkg.name;
    }

    const newLead: LeadItem = {
      id: 'lead-' + Date.now().toString().slice(-6),
      name: leadInput.name.trim(),
      mobile: leadInput.mobile.trim(),
      packageId: leadInput.packageId,
      packageName,
      inquiryType: leadInput.inquiryType,
      travelDate: leadInput.travelDate?.trim(),
      travellers: leadInput.travellers?.trim(),
      notes: leadInput.notes?.trim(),
      status: 'New',
      source: leadInput.source || 'Website',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.leads.unshift(newLead);
    this.save();

    // Fetch dynamic notification email from Settings as required
    const currentNotificationEmail = this.data.settings.notificationEmail || 'sales.travstories@gmail.com';

    // Log simulated or real email dispatch
    const subject = `New Kerala Tour Inquiry – TravStories.com [${newLead.id}]`;
    const body = `
Hello Admin,

You have received a new travel inquiry on TravStories.com.

Customer Name: ${newLead.name}
Mobile Number: ${newLead.mobile}
Interested Package: ${packageName}
Travel Date: ${newLead.travelDate || 'Not specified'}
Number of Travellers: ${newLead.travellers || 'Not specified'}
Inquiry Type: ${newLead.inquiryType}
Received At: ${new Date(newLead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Please contact the customer as soon as possible.

TravStories.com Lead Management System
    `.trim();

    this.data.emailLogs.unshift({
      id: 'email-' + Date.now(),
      to: currentNotificationEmail,
      subject,
      body,
      timestamp: new Date().toISOString()
    });
    this.save();

    console.log(`[EMAIL DISPATCH] Sent lead notification to: ${currentNotificationEmail} for lead ${newLead.id}`);

    return { lead: newLead, notificationEmail: currentNotificationEmail };
  }

  public updateLeadStatus(id: string, status: LeadItem['status']): LeadItem | null {
    const lead = this.data.leads.find(l => l.id === id);
    if (!lead) return null;
    lead.status = status;
    lead.updatedAt = new Date().toISOString();
    this.save();
    return lead;
  }

  public deleteLead(id: string): boolean {
    const prev = this.data.leads.length;
    this.data.leads = this.data.leads.filter(l => l.id !== id);
    const deleted = this.data.leads.length < prev;
    if (deleted) this.save();
    return deleted;
  }

  // Testimonials
  public getTestimonials(): TestimonialItem[] {
    return this.data.testimonials;
  }

  // Dashboard Stats
  public getDashboardStats() {
    const totalLeads = this.data.leads.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLeads = this.data.leads.filter(l => new Date(l.createdAt) >= today).length;
    const totalPackages = this.data.packages.length;
    const publishedPackages = this.data.packages.filter(p => p.published).length;
    const recentLeads = this.data.leads.slice(0, 5);

    const statusCounts = {
      New: this.data.leads.filter(l => l.status === 'New').length,
      Contacted: this.data.leads.filter(l => l.status === 'Contacted').length,
      Interested: this.data.leads.filter(l => l.status === 'Interested').length,
      Converted: this.data.leads.filter(l => l.status === 'Converted').length,
      Lost: this.data.leads.filter(l => l.status === 'Lost').length
    };

    return {
      totalLeads,
      todayLeads,
      totalPackages,
      publishedPackages,
      statusCounts,
      recentLeads
    };
  }
}

export const db = new Database();
