import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the best Kerala tour package for first-time travellers?',
      a: 'The Kochi – Munnar – Thekkady – Alleppey tour (6 Nights / 7 Days) is widely considered the best circuit for first-time visitors. It covers Kerala’s scenic hill station tea gardens, wildlife and spice plantations in Periyar, and an overnight cruise in an Alleppey backwater houseboat.'
    },
    {
      q: 'How many days are enough for Kerala?',
      a: 'A minimum of 5 to 7 days is ideal to explore central Kerala without rushing. A 5-day trip covers Munnar and Alleppey backwaters. A 7 to 8-day trip comfortably adds Thekkady and Kovalam beaches. For comprehensive tours including North Kerala (Wayanad), 9 to 10 days are recommended.'
    },
    {
      q: 'What is the best time to visit Kerala?',
      a: 'September to March is the peak season with pleasant weather, cool breezes in Munnar, and calm backwaters. June to August is the monsoon season, which is globally renowned for Ayurvedic healing and lush waterfall photography. April to May is warm in coastal areas but pleasant in high-altitude hill stations.'
    },
    {
      q: 'How much does a Kerala trip cost?',
      a: 'A comfortable Kerala tour package with 3-star handpicked hotels, private AC car with dedicated chauffeur, and an Alleppey houseboat starts from ₹15,000 to ₹25,000 per person for 5 to 7 days. Luxury packages with 5-star pool villas range from ₹35,000 to ₹50,000 per person.'
    },
    {
      q: 'Which places should I include in Kerala?',
      a: 'The top recommended places are: Munnar (misty tea hills & waterfalls), Alleppey (backwaters & houseboats), Thekkady (wildlife sanctuary & spice gardens), Wayanad (rainforests & Neolithic caves), Kovalam (lighthouse & golden beaches), and Fort Kochi (historic colonial quarter).'
    },
    {
      q: 'Is Kerala suitable for family trips?',
      a: 'Absolutely! Kerala is one of India’s most family-friendly destinations. Safe, clean, with scenic drives, speed boating at Mattupetty dam, elephant sanctuaries in Periyar, and relaxing houseboat cruises where kids and grandparents can relax comfortably.'
    },
    {
      q: 'Is Kerala good for honeymoon couples?',
      a: 'Kerala is consistently rated among India’s top honeymoon destinations. Couples love misty balcony resorts in Munnar, private 1-bedroom houseboats with candlelit dinner and flower bed decor, and sunset walks on Marari and Varkala beaches.'
    },
    {
      q: 'Can I customize my Kerala package?',
      a: 'Yes, 100%! All TravStories packages can be completely customized. You can adjust the number of days, choose specific hotel categories (3-star, 4-star, 5-star, or luxury pool villas), change the route, or add special activities like Ayurvedic spa sessions or Jeep safaris.'
    },
    {
      q: 'Does TravStories provide hotels and transportation?',
      a: 'Yes. Every TravStories tour package is an all-inclusive holiday package that includes verified handpicked hotel accommodations, daily breakfast, and a private sanitized AC vehicle with a polite, professional driver dedicated exclusively to your group for the entire trip.'
    },
    {
      q: 'Can I book a private car with driver separately?',
      a: 'Yes, we provide dedicated private car rentals with chauffeurs for airport pickups, round-trip sightseeing, and intercity Kerala transfers (Sedans, Innova Crysta, and Tempo Travellers) with all fuel, tolls, and driver allowances included.'
    },
    {
      q: 'Is a houseboat stay included in the tour packages?',
      a: 'Yes, most of our signature packages include a private overnight stay in an authentic Alleppey houseboat (Kettuvallam). It includes welcome drinks, authentic Kerala lunch with Karimeen fish or vegetarian treats, evening tea with banana fritters, dinner, and morning breakfast prepared fresh on board by your personal chef.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQ Schema JSON-LD for rich snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a
      }
    }))
  };

  return (
    <section className="py-16 sm:py-24 bg-white" id="faqs">
      {/* Inject FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base mt-2">
            Everything you need to know before booking your dream Kerala holiday with TravStories.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-neutral-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-white hover:bg-neutral-50 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-neutral-900 font-heading">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-emerald-100 text-emerald-800' : 'text-neutral-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
