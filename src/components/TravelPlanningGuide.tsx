import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, DollarSign, Compass, Heart, Users, Anchor, ChevronDown } from 'lucide-react';

export const TravelPlanningGuide: React.FC = () => {
  const [activeGuide, setActiveGuide] = useState<number>(0);

  const guides = [
    {
      title: 'Best Time to Visit Kerala',
      icon: Calendar,
      summary: 'Winter (October to March) offers cool pleasant weather. Monsoon (June to August) is world-famous for Ayurvedic rejuvenation.',
      content: `
        Kerala is an all-year tropical destination, but different seasons offer distinct charms:
        
        • Winter Season (October to March) — Peak Tourism:
          Day temperatures average 25°C to 30°C in the plains and a crisp 12°C to 18°C in Munnar and Wayanad hills. Perfect for sightseeing, backwater cruising, beach outings, and wildlife safaris.

        • Monsoon Season (June to August) — The Ayurvedic Season:
          Famous as 'Edavappathi'. Cool breezes, vibrant green tea terraces, and swelling waterfalls. The humidity and dust-free atmosphere makes monsoon the ideal time for traditional Ayurvedic treatments (Panchakarma).

        • Summer Season (March to May) — Hill Station Getaways:
          While coastal areas are warm, Munnar, Vagamon, and Wayanad remain pleasantly cool, making it ideal for family summer vacations.
      `
    },
    {
      title: 'Ideal Trip Duration & Best Route for First-Timers',
      icon: Clock,
      summary: '6 Nights / 7 Days covering Kochi, Munnar, Thekkady, and Alleppey is the most rewarding classic route.',
      content: `
        For first-time visitors, the ideal duration is 6 Nights / 7 Days:

        • Day 1: Arrive in Kochi. Explore Fort Kochi, Chinese fishing nets, and colonial cafes.
        • Day 2–3: Munnar (2 Nights). Marvel at Cheeyappara Falls, Eravikulam National Park (Nilgiri Tahr), Tata Tea Museum, and Mattupetty Dam.
        • Day 4: Thekkady (1 Night). Walk through spice plantations, attend a Kathakali martial arts show, and enjoy Periyar wildlife boating.
        • Day 5: Alleppey (1 Night). Check in to your private Deluxe Houseboat at 12:00 PM for an overnight backwater cruise.
        • Day 6: Marari Beach or Cherai (1 Night). Unwind by the golden Arabian Sea coast.
        • Day 7: Souvenir shopping in Kochi & airport drop-off.
      `
    },
    {
      title: 'Estimated Kerala Trip Cost & Budgeting',
      icon: DollarSign,
      summary: 'Transparent cost breakdowns for budget, comfortable 3-star, and luxury couples or families.',
      content: `
        A typical Kerala trip with 3-star handpicked hotels, private AC car with driver, and Alleppey houseboat starts from:

        • Budget Friendly: ₹11,000 – ₹15,000 per person (3N/4D covering Wayanad or Munnar & Alleppey).
        • Popular Deluxe Tour (3/4-Star Hotels + Private Car): ₹18,000 – ₹26,000 per person for a comprehensive 6N/7D tour.
        • Luxury Honeymoon / 5-Star Villas: ₹35,000 – ₹55,000 per person with private pool villas, 5-star backwater resorts, and premium SUV chauffeurs.
        
        Note: Peak season rates apply around Christmas and New Year. All TravStories packages include vehicle fuel, tolls, and breakfast.
      `
    },
    {
      title: 'Kerala Honeymoon Planning Guide',
      icon: Heart,
      summary: 'Romantic hill station resorts, private candlelit dinners, and private single-bedroom houseboats.',
      content: `
        Planning a romantic Kerala honeymoon is about privacy, misty mountain viewpoints, and tranquil water:
        
        • Choose a 1-Bedroom Private Houseboat: Avoid shared boats. An exclusive boat gives you private sun deck access, personal chef, and custom candlelit dining.
        • Stay in Munnar Tea Valley Resorts: Opt for valley-facing rooms or private jacuzzi cottages with panoramic morning mist views.
        • Include Candlelight Dinners & Flower Decor: We arrange flower bed decoration, honeymoon cake, and candlelit dinners at no extra hassle.
      `
    },
    {
      title: 'Kerala Family Trip Planning Tips',
      icon: Users,
      summary: 'Comfortable spacious vehicles, child-friendly resorts, elephant sanctuaries, and relaxing boat rides.',
      content: `
        Tips for a smooth Kerala family holiday with children and senior citizens:

        • Choose an AC Innova Crysta: Mountain roads between Kochi and Munnar have hairpin turns. A spacious, smooth-riding vehicle prevents motion sickness.
        • Keep Travel Legs Under 4 Hours: Space out hill stations and backwaters so kids don't feel fatigued.
        • Family Favorites: Periyar wildlife lake boating, Mattupetty speed boating, spice garden walks, and Kovalam lighthouse beach are hit activities for all ages.
      `
    },
    {
      title: 'What to Expect on an Alleppey Houseboat Cruise',
      icon: Anchor,
      summary: 'Private chef, traditional Kerala cuisine, check-in at 12 PM, and sunrise breakfast on the backwaters.',
      content: `
        An overnight Kerala Houseboat (Kettuvallam) stay is a quintessential highlight:

        • The Experience: Check in at 12:00 PM. Enjoy fresh coconut water welcome, sail through narrow palm-shaded canals, witness village life, and anchor in a tranquil lake at sunset.
        • Fresh Authentic Meals: Your private on-board chef prepares hot lunch (including authentic Karimeen fish fry or vegetarian feast), evening tea with Kerala banana fritters, dinner, and breakfast.
        • Comfort & AC: Modern houseboats feature air-conditioned bedrooms with attached private Western bathrooms and glass viewing decks.
      `
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-neutral-200/70" id="travel-guide">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>Expert Travel Advice</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900 tracking-tight">
            Planning Your Kerala Trip?
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base mt-2">
            Practical advice, seasonality, route maps, and budget estimates to help you prepare for God’s Own Country.
          </p>
        </div>

        {/* Interactive Guide Tabs / Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Guide Navigator */}
          <div className="lg:col-span-4 space-y-2">
            {guides.map((g, idx) => {
              const Icon = g.icon;
              const isSelected = activeGuide === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveGuide(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-300' : 'text-emerald-700'}`} />
                    <span className="text-xs sm:text-sm font-bold">{g.title}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-white' : 'text-neutral-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Selected Guide Reading Panel */}
          <div className="lg:col-span-8 bg-neutral-50 rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                {React.createElement(guides[activeGuide].icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900">
                  {guides[activeGuide].title}
                </h3>
                <p className="text-xs text-neutral-500">Curated by TravStories Kerala Ground Specialists</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200 mb-6 text-xs sm:text-sm text-emerald-900 font-medium">
              💡 {guides[activeGuide].summary}
            </div>

            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line space-y-2">
              {guides[activeGuide].content.trim()}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
