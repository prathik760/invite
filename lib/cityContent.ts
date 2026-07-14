export type CitySlug =
  | 'bengaluru'
  | 'mumbai'
  | 'delhi'
  | 'hyderabad'
  | 'chennai'
  | 'pune'
  | 'kolkata'
  | 'ahmedabad'

export const INDEXED_CITIES: CitySlug[] = [
  'bengaluru', 'mumbai', 'delhi', 'hyderabad',
  'chennai', 'pune', 'kolkata', 'ahmedabad',
]

export interface CityFaq { q: string; a: string }

export interface BirthdayCityData {
  display: string
  state: string
  heroIntro: string
  builtForPara: string
  venues: string[]
  faqs: CityFaq[]
  ctaTagline: string
}

export interface EngagementCityData {
  display: string
  state: string
  localCeremonyName: string
  heroIntro: string
  builtForPara: string
  venues: string[]
  faqs: CityFaq[]
  ctaTagline: string
}

export interface WeddingCityData {
  display: string
  state: string
  localDetail: string
  localDetail2: string
  traditions: string[]
  weddingStyle: string
  venues: string[]
  faqs: CityFaq[]
  ctaTagline: string
}

export interface GrihaPraveshCityData {
  display: string
  state: string
  localDetail: string
  localDetail2: string
  traditions: string[]
  faqs: CityFaq[]
  ctaTagline: string
}

// ─── Birthday ────────────────────────────────────────────────────────────────

export const BIRTHDAY_CITIES: Record<CitySlug, BirthdayCityData> = {
  bengaluru: {
    display: 'Bengaluru',
    state: 'Karnataka',
    heroIntro:
      "Bengaluru birthdays are as varied as the city — rooftop parties in Koramangala, farmhouse celebrations on Mysore Road, and intimate home gatherings in Indiranagar. With guests coming from Whitefield, Electronic City, and across the city, a digital invite with a live Google Maps pin means no one gets lost on the way to your party.",
    builtForPara:
      "Bengaluru birthday parties range from rooftop celebrations in Koramangala to grand banquet halls in Indiranagar and private farmhouses on the Mysore Road — a digital invite with Google Maps makes navigation seamless in the city's notorious traffic.",
    venues: ['The Leela Palace', 'ITC Windsor', 'Taj West End', 'Shangri-La Bengaluru', 'Sheraton Grand Bengaluru'],
    faqs: [
      {
        q: "My party has guests coming from Whitefield, Electronic City, and Koramangala — how does ShareInvite help?",
        a: "ShareInvite creates one WhatsApp link with the venue address and a Google Maps pin. Guests traveling from Whitefield or Electronic City tap the map for real-time navigation — no direction messages needed from you on the day.",
      },
      {
        q: "Can I create a birthday invitation for a rooftop venue or farmhouse in Bengaluru?",
        a: "Yes. Add your Bengaluru venue address — rooftop, farmhouse, restaurant, or banquet hall — and ShareInvite embeds a Google Maps link. You can also add parking notes and entry instructions for hard-to-find locations.",
      },
      {
        q: "How do I share the birthday invitation with my Bengaluru family and office friends separately?",
        a: "Copy the shareinvite.in/e/your-name link and paste it into your family groups, college groups, and office WhatsApp chats. The same link works for everyone — no app download required on any Android or iPhone.",
      },
    ],
    ctaTagline: "Bengaluru's traffic won't stop your party — one WhatsApp link does it all.",
  },

  mumbai: {
    display: 'Mumbai',
    state: 'Maharashtra',
    heroIntro:
      "Mumbai birthday parties span the full length of the city — sea-facing venues in Bandra, rooftop bars in Lower Parel, private dining rooms in Powai, and family banquet halls across the suburbs. When guests commute from Thane, Navi Mumbai, or Borivali, a digital invite with a Google Maps pin makes every venue reachable.",
    builtForPara:
      "Mumbai birthday celebrations happen across the city — sea-facing venues in Bandra, rooftop parties in Lower Parel, and family gatherings in the suburbs. A WhatsApp-ready invite link works perfectly for Mumbai's fast-paced, phone-first lifestyle.",
    venues: ['Taj Lands End', 'The St. Regis Mumbai', 'JW Marriott Juhu', 'Grand Hyatt Mumbai', 'Trident Nariman Point'],
    faqs: [
      {
        q: "My Mumbai birthday venue is hard to find — can guests get directions from the invite?",
        a: "Yes. ShareInvite embeds a Google Maps pin in the invitation. Guests tap it from their phone for real-time navigation to your venue — whether it's a rooftop in Lower Parel, a sea-facing hall in Bandra, or a private dining room in Powai.",
      },
      {
        q: "Can I create a birthday invitation for a party in Andheri, Powai, or Navi Mumbai?",
        a: "Yes. Add your venue address anywhere in Mumbai — Andheri, Navi Mumbai, Borivali, or Colaba — and ShareInvite adds a Google Maps link. The invitation works for any party size, from 10 close friends to 200 family members.",
      },
      {
        q: "How quickly can I set up and share a birthday invitation for a Mumbai party?",
        a: "Under 5 minutes. Pick a birthday template, enter the name, date, venue, and message, and your invitation is live. Copy the link and share it across all your Mumbai family and friend groups on WhatsApp.",
      },
    ],
    ctaTagline: "From Bandra to Borivali — one WhatsApp link keeps every Mumbai guest informed.",
  },

  delhi: {
    display: 'Delhi',
    state: 'Delhi NCR',
    heroIntro:
      "Delhi birthday parties are events in themselves — farmhouse celebrations in Chattarpur, rooftop dinners in Connaught Place, and landmark hotel banquets across South Delhi and Gurgaon. When your guest list spans the full NCR, a digital invitation with the exact venue pin stops the flood of 'Where is it exactly?' messages before they start.",
    builtForPara:
      "Delhi birthday parties span farmhouse celebrations in Chattarpur, rooftop venues in CP, and luxury hotel banquets across South Delhi and Gurgaon. A digital invite that works across NCR makes coordination far simpler for any party size.",
    venues: ['The Leela Palace New Delhi', 'ITC Maurya', 'Taj Palace', 'The Oberoi New Delhi', 'Hyatt Regency Delhi'],
    faqs: [
      {
        q: "How does ShareInvite help when my Delhi birthday party has guests from Gurgaon, Noida, and South Delhi?",
        a: "ShareInvite puts the venue address with a live Google Maps pin right in the invitation. Guests from Gurgaon, Noida, or Faridabad tap the map for real-time directions — no calls to you for location details on the day.",
      },
      {
        q: "Can I create a birthday invitation for a farmhouse or banquet venue in Delhi?",
        a: "Yes. Add the full address of any Delhi venue — Chattarpur farmhouse, Mehrauli lawn, hotel banquet, or South Delhi club — with a Google Maps link. ShareInvite works for intimate 20-person dinners and 500-guest celebrations equally.",
      },
      {
        q: "What's the easiest way to invite family in Old Delhi and friends in Gurgaon with the same invite?",
        a: "Forward the same ShareInvite link to both groups on WhatsApp. One link, one beautiful invitation page — works across generations and across NCR. No one needs to download an app or fill a form.",
      },
    ],
    ctaTagline: "Delhi NCR covered in one WhatsApp link — no confusion, no last-minute calls.",
  },

  hyderabad: {
    display: 'Hyderabad',
    state: 'Telangana',
    heroIntro:
      "Hyderabad birthday celebrations carry the city's legendary warmth — from elegant venue parties in Banjara Hills to family gatherings in Jubilee Hills and community halls across Secunderabad. The twin cities' geography means guests travel across the city; a digital invite with a venue pin makes every location accessible with one tap.",
    builtForPara:
      "Hyderabad birthday celebrations reflect the city's warmth — from palace venue celebrations in Banjara Hills to family gatherings in Jubilee Hills. A WhatsApp-shared digital invite reaches all guests instantly across the twin cities.",
    venues: ['Taj Falaknuma Palace', 'ITC Kohenur', 'Park Hyatt Hyderabad', 'The Westin Hyderabad', 'Marriott Hyderabad'],
    faqs: [
      {
        q: "How do I share a birthday invitation with guests across Hyderabad and Secunderabad?",
        a: "ShareInvite creates one WhatsApp-ready link with your venue address and a Google Maps pin. Guests from Banjara Hills, Secunderabad, Gachibowli, or Kukatpally tap the map for directions — no separate messages needed from you.",
      },
      {
        q: "Can I create a birthday invitation for a Hyderabad palace venue or hotel banquet?",
        a: "Yes. Add any Hyderabad venue — from Falaknuma Palace to a hotel in Jubilee Hills — with its address and ShareInvite adds a Google Maps link. The invitation looks premium regardless of venue type.",
      },
      {
        q: "How early should I send the birthday invitation for a Hyderabad party?",
        a: "Send it 7–10 days in advance for local guests. If you have family from other states attending, send 2–3 weeks ahead. With ShareInvite, sending a reminder is as easy as re-forwarding the same WhatsApp link.",
      },
    ],
    ctaTagline: "From Banjara Hills to Secunderabad — your Hyderabad birthday, one link away.",
  },

  chennai: {
    display: 'Chennai',
    state: 'Tamil Nadu',
    heroIntro:
      "Chennai birthday parties are warm, family-centred events — beachside celebrations on ECR, private halls in Anna Nagar and T Nagar, and hotel venues across the city. With large Tamil family networks and guests from across Chennai, a digital invite with a clear venue pin and party schedule keeps everyone in the right place at the right time.",
    builtForPara:
      "Chennai birthday parties are warm, family-centred events — from beachside venues in ECR to private halls in Anna Nagar and T Nagar. A digital invite with Google Maps helps guests navigate the city's busy neighbourhoods with ease.",
    venues: ['ITC Grand Chola', 'Taj Coromandel', 'The Leela Palace Chennai', 'Feathers Hotel', 'Radisson Blu Chennai'],
    faqs: [
      {
        q: "How do I create a digital birthday invitation for a Chennai family celebration?",
        a: "Go to shareinvite.in/create, pick a birthday template, enter the celebrant's name, party date, Chennai venue address, and your family message. Your invitation is live with a WhatsApp link in under 5 minutes — ready to share with family groups.",
      },
      {
        q: "Can I add an ECR beach venue or a T Nagar hall address to my Chennai birthday invitation?",
        a: "Yes. Add any Chennai venue — ECR beach resort, T Nagar hall, Anna Nagar banquet, or hotel — with the full address and ShareInvite embeds a Google Maps link. Guests get one-tap directions without needing to ask.",
      },
      {
        q: "Is a digital birthday invitation suitable for a traditional Tamil family celebration with elders?",
        a: "Yes. ShareInvite invitation pages are elegant, mobile-friendly, and work on all phones including older Android models. The guest wishes section lets elders leave their blessings directly on the page — a meaningful touch for family birthdays.",
      },
    ],
    ctaTagline: "Warm Chennai celebrations — beautifully shared with the whole family on WhatsApp.",
  },

  pune: {
    display: 'Pune',
    state: 'Maharashtra',
    heroIntro:
      "Pune birthday parties blend cosmopolitan energy with Maharashtrian warmth — terrace parties in Koregaon Park, family celebrations in Kothrud and Pimple Saudagar, and farm-style events near the city's outskirts. Pune's young, WhatsApp-native crowd expects an invite they can share instantly and open on any phone without downloading anything.",
    builtForPara:
      "Pune birthday celebrations blend the city's cosmopolitan energy with Maharashtrian warmth — from terrace parties in Koregaon Park to family celebrations in Kothrud. A digital invite works perfectly for Pune's young, WhatsApp-native crowd.",
    venues: ['JW Marriott Pune', 'Conrad Pune', 'Hyatt Regency Pune', 'Taj Blue Diamond', 'The Westin Pune'],
    faqs: [
      {
        q: "My Pune birthday party has college friends and family from different parts of the city — how does this help?",
        a: "One ShareInvite link works for everyone. Forward it to your Koregaon Park friends and your Kothrud family group. The invitation includes the full venue address with a Google Maps pin — no one needs to ask for directions on the day.",
      },
      {
        q: "Can I create a birthday invitation for a terrace party or a farmhouse near Pune?",
        a: "Yes. Add your venue address — terrace in Koregaon Park, farmhouse near Lavasa, restaurant in Baner, or banquet in Pimple Saudagar — and ShareInvite adds a clickable map link. Include parking notes for venues that are tricky to find.",
      },
      {
        q: "How do I add a live countdown and photo gallery to my Pune birthday invitation?",
        a: "After creating your invitation, add a live countdown timer and upload photos directly in the ShareInvite editor. Guests see the countdown and your chosen photos when they open the WhatsApp link — making it a personal, premium experience.",
      },
    ],
    ctaTagline: "Koregaon Park to Kothrud — one Pune birthday invite on WhatsApp.",
  },

  kolkata: {
    display: 'Kolkata',
    state: 'West Bengal',
    heroIntro:
      "Kolkata birthday celebrations carry the city's legendary cultural warmth — from heritage venue celebrations on Park Street to family adda gatherings across South Kolkata and Salt Lake. Bengali birthday celebrations often bring extended family from across the city and suburbs; a digital invite makes coordinating a large, spread-out guest list effortless.",
    builtForPara:
      "Kolkata birthday parties carry the city's legendary warmth and cultural richness — from heritage venue celebrations in Park Street to family gatherings across the city's many cultural neighbourhoods.",
    venues: ['Taj Bengal', 'ITC Royal Bengal', 'The Oberoi Grand', 'Vedic Village Spa Resort', 'Hyatt Regency Kolkata'],
    faqs: [
      {
        q: "How do I create a digital birthday invitation for a Kolkata family celebration?",
        a: "Go to shareinvite.in/create, pick a birthday template, enter the name, date, venue, and a warm family message. Your invitation is live with a WhatsApp link in under 5 minutes — ready to share across all your Kolkata family groups.",
      },
      {
        q: "Can I add a Park Street or South Kolkata venue address to my birthday invitation?",
        a: "Yes. Add any Kolkata venue — Park Street restaurant, South Kolkata hall, Salt Lake hotel, or Alipore club — and ShareInvite embeds a Google Maps link. Guests get one-tap directions regardless of where they are in the city.",
      },
      {
        q: "My celebration has elders and younger guests — does the digital invite work for both?",
        a: "Yes. ShareInvite works on every phone — modern and older Android models alike. The invitation opens directly in the browser from WhatsApp — no app download needed. Elders and younger guests open the same beautiful invitation with equal ease.",
      },
    ],
    ctaTagline: "Kolkata warmth, shared beautifully — one WhatsApp link for the whole family.",
  },

  ahmedabad: {
    display: 'Ahmedabad',
    state: 'Gujarat',
    heroIntro:
      "Ahmedabad birthday celebrations reflect Gujarati warmth and community spirit — themed parties in Prahlad Nagar and SG Highway, family gatherings across the city, and festive community celebrations throughout the year. A digital invite that reaches the whole family in one WhatsApp forward is a natural fit for Gujarat's closely connected culture.",
    builtForPara:
      "Ahmedabad birthday celebrations reflect Gujarati warmth and hospitality — from family gatherings across the city to themed parties in Prahlad Nagar and SG Highway's modern venues.",
    venues: ['Hyatt Regency Ahmedabad', 'Crowne Plaza Ahmedabad', 'Vivanta Ahmedabad', 'Fortune Landmark', 'Novotel Ahmedabad'],
    faqs: [
      {
        q: "How do I create a birthday invitation for an Ahmedabad family celebration?",
        a: "Go to shareinvite.in/create, pick a birthday template, add the celebrant's name, date, venue address in Ahmedabad, and a family message. Your WhatsApp-ready invitation is live in under 5 minutes.",
      },
      {
        q: "Can I add a Prahlad Nagar or SG Highway venue to my Ahmedabad birthday invite?",
        a: "Yes. Add your Ahmedabad venue address — Prahlad Nagar, SG Highway, Satellite, CG Road, or Vastrapur — with a Google Maps link. Guests get one-tap directions from anywhere in the city.",
      },
      {
        q: "Is a digital birthday invitation suitable for large Gujarati family gatherings?",
        a: "Yes. ShareInvite works for any party size. For large Gujarati family celebrations, forward the link to every family group on WhatsApp. The guest wishes section lets family members from Surat, Vadodara, or abroad leave their blessings too.",
      },
    ],
    ctaTagline: "Gujarati warmth, one WhatsApp link — your Ahmedabad birthday awaits.",
  },
}

// ─── Engagement ───────────────────────────────────────────────────────────────

export const ENGAGEMENT_CITIES: Record<CitySlug, EngagementCityData> = {
  bengaluru: {
    display: 'Bengaluru',
    state: 'Karnataka',
    localCeremonyName: 'Nishchayathartham / Mangni',
    heroIntro:
      "Bengaluru engagement ceremonies blend South Indian tradition with the city's cosmopolitan spirit — from Nishchayathartham rituals at family homes in Basavanagudi to modern Roka events at Koramangala venues. A digital invite coordinates guests across the city's many neighbourhoods in one WhatsApp message.",
    builtForPara:
      "Bengaluru engagement ceremonies blend South Indian traditions with the city's cosmopolitan culture — from intimate Nishchayathartham ceremonies in traditional homes to upscale Roka events at Koramangala venues. A digital invite with Google Maps navigates guests through Bengaluru's traffic.",
    venues: ['The Leela Palace', 'Taj West End', 'Shangri-La Bengaluru', 'ITC Windsor', 'JW Marriott Bengaluru'],
    faqs: [
      {
        q: "How do I create a digital invitation for a Nishchayathartham ceremony in Bengaluru?",
        a: "Go to shareinvite.in/create, choose the engagement template, enter both names, the Nishchayathartham date and muhurat time, your Bengaluru venue, and the ceremony programme. Your digital invitation is live on WhatsApp in under 5 minutes.",
      },
      {
        q: "My engagement has guests from both Kannada and Tamil families in Bengaluru — can the invite suit both?",
        a: "Yes. ShareInvite's engagement invitation is elegant and language-neutral. Use the ceremony name that fits your family's tradition — Nishchayathartham, Mangni, or Roka — and add details that resonate with both families.",
      },
      {
        q: "Can I add the ring exchange schedule and venue map for my Bengaluru engagement?",
        a: "Yes. Add the full programme — ring exchange time, family blessings, dinner — with your Bengaluru venue address and a Google Maps pin. Guests get one-tap directions to any venue in the city, from MG Road hotels to traditional ceremonies in Jayanagar.",
      },
    ],
    ctaTagline: "Nishchayathartham in Bengaluru — beautifully shared in one WhatsApp link.",
  },

  mumbai: {
    display: 'Mumbai',
    state: 'Maharashtra',
    localCeremonyName: 'Mangni / Sagai',
    heroIntro:
      "Mumbai engagement ceremonies reflect the city's scale and diversity — from intimate Mangni rituals in South Mumbai's heritage apartments to grand Sagai celebrations at Juhu beach hotels. A digital invitation coordinates a city-wide guest list across all of Mumbai's many neighbourhoods in a single WhatsApp forward.",
    builtForPara:
      "Mumbai engagements happen across the city's diverse neighbourhoods — from South Mumbai heritage venues to modern banquet halls in Bandra and Powai. A WhatsApp-ready digital invite is the perfect fit for Mumbai's fast-paced, mobile-first lifestyle.",
    venues: ['Taj Lands End', 'The St. Regis Mumbai', 'JW Marriott Juhu', 'Trident Nariman Point', 'Four Seasons Mumbai'],
    faqs: [
      {
        q: "How do I create a digital Mangni invitation for a Mumbai engagement ceremony?",
        a: "Go to shareinvite.in/create, choose the engagement template, enter the couple's names, Mangni date, Mumbai venue address, and ceremony programme. Your WhatsApp-ready invitation is live in under 5 minutes.",
      },
      {
        q: "My engagement has family in Andheri and guests in South Mumbai — how does the invite help?",
        a: "One WhatsApp link reaches every guest in Mumbai. The invitation includes the full venue address with a Google Maps pin, so guests from Andheri, Thane, or Colaba can navigate directly to your Sagai venue without calling you.",
      },
      {
        q: "Can I add both the ring ceremony and dinner schedule to my Mumbai engagement invitation?",
        a: "Yes. ShareInvite lets you list the full programme — Mangni ritual, ring exchange, family blessings, and dinner — with separate times. Guests see the complete schedule before arriving at your Mumbai venue.",
      },
    ],
    ctaTagline: "From Andheri to Navi Mumbai — your Mangni announcement, one WhatsApp link.",
  },

  delhi: {
    display: 'Delhi',
    state: 'Delhi NCR',
    localCeremonyName: 'Roka / Sagai / Mangni',
    heroIntro:
      "Delhi engagement ceremonies are grand, multi-family affairs — Roka rituals at Defence Colony homes, Sagai celebrations at five-star hotels in South Delhi, and Mangni events spread across the full NCR. A digital invite is how Delhi families coordinate guests from Gurgaon, Noida, Faridabad, and the capital in a single message.",
    builtForPara:
      "Delhi engagement ceremonies are grand affairs — from Roka rituals at family homes in Defence Colony to lavish Sagai events at five-star hotels across South Delhi and Gurgaon. A digital invite coordinates NCR-wide guest lists effortlessly.",
    venues: ['The Leela Palace New Delhi', 'Taj Palace', 'ITC Maurya', 'The Oberoi New Delhi', 'Hyatt Regency Delhi'],
    faqs: [
      {
        q: "How do I create a digital invitation for a Delhi Roka or Sagai ceremony?",
        a: "Go to shareinvite.in/create, choose the engagement template, enter both families' names, the Roka or Sagai date, your Delhi venue address, and the ceremony programme. Your invitation is live with a WhatsApp link in under 5 minutes.",
      },
      {
        q: "My Delhi engagement has guests from Gurgaon, Noida, and South Delhi — how does this help?",
        a: "One ShareInvite link reaches every guest. The invitation includes the full venue address with a Google Maps pin, so guests from Gurgaon, Noida, or Faridabad navigate directly — no calls asking for directions on the engagement day.",
      },
      {
        q: "Can I include separate schedules for a home Roka and a hotel Sagai in my Delhi invitation?",
        a: "Yes. ShareInvite lets you add multiple events — Roka ceremony at the family home and the main Sagai at the hotel — each with its own date, time, and venue address. Guests see the complete NCR-spanning programme in one beautiful invitation.",
      },
    ],
    ctaTagline: "Delhi's grandest Sagai, shared across the NCR in one WhatsApp link.",
  },

  hyderabad: {
    display: 'Hyderabad',
    state: 'Telangana',
    localCeremonyName: 'Nischitartham / Nishchayam',
    heroIntro:
      "Hyderabad engagement ceremonies carry the city's warmth and heritage — intimate Nischitartham rituals at family homes, Misri celebrations at Banjara Hills venues, and upscale Nishchayam events at the city's landmark hotels. A digital invite with the venue map reaches guests across the old and new parts of the twin cities instantly.",
    builtForPara:
      "Hyderabad engagement ceremonies carry the city's warmth and grandeur — from intimate Nischitartham ceremonies in traditional homes to lavish Misri events at Banjara Hills venues. WhatsApp sharing reaches guests across both the old and new cities instantly.",
    venues: ['Taj Falaknuma Palace', 'ITC Kohenur', 'Park Hyatt Hyderabad', 'The Westin Hyderabad', 'Novotel Hyderabad Convention Centre'],
    faqs: [
      {
        q: "How do I create a digital invitation for a Nischitartham ceremony in Hyderabad?",
        a: "Go to shareinvite.in/create, choose the engagement template, enter the couple's names, Nischitartham date, Hyderabad venue address, and the full ceremony programme. Your WhatsApp-ready invitation is live in minutes.",
      },
      {
        q: "My Hyderabad engagement has guests from Banjara Hills and Secunderabad — how does ShareInvite help?",
        a: "One WhatsApp link works for everyone. The invitation includes the venue address with a Google Maps pin, so guests from Banjara Hills, Jubilee Hills, or Secunderabad tap for real-time directions — no calls asking for the venue location.",
      },
      {
        q: "What ceremony name is used for Hyderabad Telugu engagement invitations?",
        a: "In Hyderabad and Telangana, the engagement ceremony is most commonly called Nischitartham or Nishchayam. ShareInvite lets you use whichever regional name matches your family tradition — or both, to respect both families.",
      },
    ],
    ctaTagline: "Nischitartham in Hyderabad — share the joy on WhatsApp in minutes.",
  },

  chennai: {
    display: 'Chennai',
    state: 'Tamil Nadu',
    localCeremonyName: 'Nichayathartham',
    heroIntro:
      "Chennai Nichayathartham ceremonies are significant family milestones — held at homes in Mylapore, banquet halls in T Nagar, or hotels in Anna Nagar with large Tamil family gatherings spanning multiple generations. A digital invite with the full ceremony schedule and venue map is the most practical way to coordinate Chennai's typically large guest lists.",
    builtForPara:
      "Chennai Nichayathartham ceremonies are significant family events — held at home or at banquet halls across Mylapore, T Nagar, and Anna Nagar with detailed rituals and large family gatherings. A digital invite helps coordinate the large guest lists typical of Chennai family events.",
    venues: ['ITC Grand Chola', 'Taj Coromandel', 'The Leela Palace Chennai', 'Hyatt Regency Chennai', 'Radisson Blu Chennai'],
    faqs: [
      {
        q: "How do I create a digital invitation for a Nichayathartham ceremony in Chennai?",
        a: "Go to shareinvite.in/create, choose the engagement template, enter both families' names, the Nichayathartham date and muhurat time, your Chennai venue address, and the ceremony programme. Your invitation is live with a WhatsApp link in minutes.",
      },
      {
        q: "My Chennai Nichayathartham has a large family guest list — how does a digital invite help?",
        a: "Forward the single ShareInvite link to all your Chennai family WhatsApp groups. The invitation includes the full ceremony schedule, venue address, and a Google Maps pin. One link reaches everyone without individual messages or calls.",
      },
      {
        q: "Can I display the muhurat time and full ceremony programme in my Chennai engagement invitation?",
        a: "Yes. ShareInvite lets you display the muhurat time prominently and list the full Nichayathartham programme — Ganesh Puja, ritual timings, and lunch. Guests know exactly when and where each part of the ceremony happens.",
      },
    ],
    ctaTagline: "Nichayathartham in Chennai — the whole family invited, one WhatsApp link.",
  },

  pune: {
    display: 'Pune',
    state: 'Maharashtra',
    localCeremonyName: 'Ring Ceremony / Sagai',
    heroIntro:
      "Pune engagement ceremonies blend Maharashtrian tradition with cosmopolitan flair — intimate Ring Ceremony events in Koregaon Park, family Sagai celebrations in Kothrud, and upscale venues in Baner and Pimple Saudagar. A digital invite is the natural choice for Pune's young, WhatsApp-first couples and their connected families.",
    builtForPara:
      "Pune engagements blend Maharashtrian tradition with cosmopolitan flair — intimate Ring Ceremony events in Koregaon Park, family Sagai celebrations in Kothrud and Pimple Saudagar. A WhatsApp digital invite works perfectly for Pune's young, connected families.",
    venues: ['JW Marriott Pune', 'Conrad Pune', 'Hyatt Regency Pune', 'Taj Blue Diamond', 'The Westin Pune Koregaon Park'],
    faqs: [
      {
        q: "How do I create a digital Ring Ceremony invitation for a Pune engagement?",
        a: "Go to shareinvite.in/create, choose the engagement template, enter the couple's names, Ring Ceremony date, your Pune venue, and the ceremony programme. Your WhatsApp-ready invitation is live in under 5 minutes.",
      },
      {
        q: "My engagement has family from Mumbai and Nashik attending — how does ShareInvite help?",
        a: "One WhatsApp link works for everyone. The invitation includes the Pune venue address with a Google Maps pin, so guests from Mumbai or Nashik navigate directly to your venue — no calling for directions on the day.",
      },
      {
        q: "Can I add both the ring exchange and dinner schedule to my Pune engagement invitation?",
        a: "Yes. Add the full Ring Ceremony or Sagai programme — ceremony timings, ring exchange, family blessings, and dinner — each with a time listed. Guests from Mumbai arriving late or family staying for dinner know the full plan in advance.",
      },
    ],
    ctaTagline: "Pune's Ring Ceremony moment — share it beautifully on WhatsApp.",
  },

  kolkata: {
    display: 'Kolkata',
    state: 'West Bengal',
    localCeremonyName: 'Ashirbad / Ring Ceremony',
    heroIntro:
      "Kolkata engagement ceremonies carry the city's warmth and cultural depth — from traditional Ashirbad blessings by elders at family homes in South Kolkata to grand Ring Ceremony events at the city's premier venues. Bengali families spread across Kolkata, Howrah, Salt Lake, and New Town are connected in one WhatsApp forward.",
    builtForPara:
      "Kolkata engagement ceremonies carry the city's warmth and cultural richness — from traditional Adda-style family celebrations to grand banquet events across South Kolkata's famous party venues. Bengali families spread across the city and suburbs are connected in one WhatsApp forward.",
    venues: ['Taj Bengal', 'ITC Royal Bengal', 'The Oberoi Grand', 'Swissotel Kolkata', 'Hyatt Regency Kolkata'],
    faqs: [
      {
        q: "How do I create a digital invitation for an Ashirbad or Ring Ceremony in Kolkata?",
        a: "Go to shareinvite.in/create, choose the engagement template, enter the couple's names, ceremony date, your Kolkata venue address, and the full programme. Your WhatsApp-ready invitation is live in under 5 minutes.",
      },
      {
        q: "My Kolkata engagement has family in South Kolkata, Salt Lake, and Howrah — how does this help?",
        a: "One WhatsApp link reaches every corner of Kolkata and beyond. The invitation includes the venue address with a Google Maps pin, so guests from Salt Lake, Howrah, or New Town navigate directly — no calls asking for directions.",
      },
      {
        q: "Is 'Ashirbad' used as the ceremony name in Kolkata Bengali engagement invitations?",
        a: "Yes. In Bengali tradition, the engagement ceremony is often called Ashirbad (blessings from elders) alongside the Ring Ceremony. ShareInvite lets you use either name — or both — matching your family's tradition.",
      },
    ],
    ctaTagline: "Ashirbad blessings, shared with all of Kolkata in one WhatsApp link.",
  },

  ahmedabad: {
    display: 'Ahmedabad',
    state: 'Gujarat',
    localCeremonyName: 'Gol Dhana / Sagai',
    heroIntro:
      "Ahmedabad Gujarati engagement ceremonies are vibrant, community-centred celebrations — Gol Dhana rituals with family and neighbours, Sagai events at hotels in Satellite and Prahlad Nagar, and community hall celebrations across the city. A digital invite keeps every guest — from Vastrapur to Gota — connected in one WhatsApp message.",
    builtForPara:
      "Ahmedabad Gujarati engagement ceremonies are lively, colourful affairs — Gol Dhana celebrations with family and community spread across the city's growing suburbs. A digital invite keeps all guests — from Satellite to Prahladnagar — coordinated.",
    venues: ['Hyatt Regency Ahmedabad', 'Crowne Plaza Ahmedabad', 'Vivanta Ahmedabad', 'Fortune Landmark', 'Novotel Ahmedabad'],
    faqs: [
      {
        q: "How do I create a digital Gol Dhana invitation for an Ahmedabad engagement?",
        a: "Go to shareinvite.in/create, choose the engagement template, enter the couple's names, Gol Dhana date, your Ahmedabad venue address, and the ceremony programme. Your WhatsApp-ready invitation is live in under 5 minutes.",
      },
      {
        q: "My Ahmedabad engagement has family from Vadodara and Surat attending — how does this help?",
        a: "One WhatsApp link works for everyone. The invitation includes the Ahmedabad venue address with a Google Maps pin. Guests from Vadodara or Surat navigate directly to your venue, and you share the same link to all WhatsApp groups at once.",
      },
      {
        q: "What ceremony name is used for Gujarati engagement invitations in Ahmedabad?",
        a: "In Ahmedabad and across Gujarat, the engagement ceremony is commonly called Gol Dhana or Sagai. ShareInvite lets you use whichever name matches your family tradition — or list both, which is common in Ahmedabad's community celebrations.",
      },
    ],
    ctaTagline: "Gol Dhana in Ahmedabad — share the celebration on WhatsApp in minutes.",
  },
}

// ─── Wedding ──────────────────────────────────────────────────────────────────

export const WEDDING_CITIES: Record<CitySlug, WeddingCityData> = {
  bengaluru: {
    display: 'Bengaluru',
    state: 'Karnataka',
    localDetail:
      "Bengaluru weddings blend South Indian tradition with cosmopolitan style — from grand Kalyana Mantapams in Jayanagar to luxury hotel banquets in MG Road.",
    localDetail2:
      "Whether your wedding follows Kannada, Tamil, or Telugu traditions, ShareInvite makes it simple to share your venue, ceremony schedule, and Muhurtham time with every guest. A WhatsApp-ready digital invitation is perfect for Bengaluru's tech-savvy families spread across the city and beyond.",
    traditions: ['Nalungu', 'Naandi ceremony', 'Kalyana Mantapam', 'Muhurtham'],
    weddingStyle: 'South Indian traditional or modern luxury',
    venues: ['Palace Grounds', 'ITC Windsor', 'Taj West End', 'Leela Palace', 'NIMHANS Convention Centre'],
    faqs: [
      {
        q: "How do I share a Bengaluru wedding invitation with guests in Whitefield, Electronic City, and Mysore?",
        a: "Create your ShareInvite digital invitation and forward the link to all your family WhatsApp groups. Guests in Whitefield, Electronic City, or outstation in Mysore receive the same beautiful invitation with the full schedule, venue map, and Muhurtham time.",
      },
      {
        q: "Can I add a Kalyana Mantapam address and Muhurtham time to my Bengaluru wedding invitation?",
        a: "Yes. Add the Kalyana Mantapam name and address with a Google Maps link. ShareInvite displays the Muhurtham time prominently and lists the full ceremony programme — Naandi, Nalungu, Muhurtham — so guests plan their arrival accurately.",
      },
      {
        q: "How do I list South Indian wedding ceremonies like Nalungu and the Muhurtham in one invitation?",
        a: "ShareInvite lets you add multiple ceremonies — Naandi, Nalungu, main Muhurtham, and Reception — each with its own date, time, and venue. Your Bengaluru guests see a clear, multi-ceremony schedule in one elegant invitation page.",
      },
    ],
    ctaTagline: "Bengaluru wedding — Muhurtham to reception, all in one WhatsApp link.",
  },

  mumbai: {
    display: 'Mumbai',
    state: 'Maharashtra',
    localDetail:
      "Mumbai weddings are grand affairs — from beachside ceremonies in Juhu to high-rise rooftop celebrations and traditional Gujarati and Marathi mandaps.",
    localDetail2:
      "In a city where guests travel from Andheri to Navi Mumbai, a digital invitation with a live Google Maps link is not a luxury — it's essential. ShareInvite helps Mumbai families share venue details, parking information, and the full Vidhi schedule all in one WhatsApp link.",
    traditions: ['Haldi', 'Mehendi', 'Antarpat ceremony', 'Saptapadi'],
    weddingStyle: 'Gujarati, Marathi, or Punjabi grand celebration',
    venues: ['Grand Hyatt Kalina', 'Taj Lands End', 'The Leela Mumbai', 'ITC Maratha', 'Turf Club'],
    faqs: [
      {
        q: "My Mumbai wedding has venues in Juhu for Mehendi and Bandra for the Reception — can guests find both?",
        a: "Yes. ShareInvite lets you add separate venues for each ceremony — Mehendi in Juhu, Reception at Bandra — with individual Google Maps links. Guests see which venue to go to for each event without any confusion.",
      },
      {
        q: "How do I include parking and entry instructions for my Mumbai wedding venue?",
        a: "Add parking instructions and building entry notes in ShareInvite's additional notes section. For hotel weddings in Juhu, Powai, or Worli, this prevents guests from spending 20 minutes finding the right entrance on your wedding day.",
      },
      {
        q: "Can I add both Gujarati and Marathi wedding ceremonies to the same invitation for my Mumbai wedding?",
        a: "Yes. ShareInvite supports multiple ceremonies each with its own title, date, time, and venue. For inter-community Mumbai weddings with both Gujarati and Marathi rituals, each ceremony can be listed clearly and beautifully.",
      },
    ],
    ctaTagline: "Mumbai wedding — Juhu to Navi Mumbai, one link reaches every guest.",
  },

  delhi: {
    display: 'Delhi',
    state: 'Delhi NCR',
    localDetail:
      "Delhi weddings are legendary for grandeur — from massive farmhouse celebrations in Chattarpur to heritage lawns and premium hotel banquets across the capital.",
    localDetail2:
      "Delhi NCR weddings often span multiple venues across Gurgaon, Noida, and the capital — making a digital invitation with separate event pages for each ceremony invaluable. Guests in Dwarka needn't call to confirm the Sangeet venue when the full schedule is one WhatsApp tap away.",
    traditions: ['Roka', 'Sangeet', 'Baraat', 'Vidaai'],
    weddingStyle: 'North Indian grand multi-day celebration',
    venues: ['Taj Palace', 'ITC Maurya', 'The Oberoi', 'Leela Palace New Delhi', 'Radisson Blu Paschim Vihar'],
    faqs: [
      {
        q: "My Delhi wedding has Sangeet in Gurgaon and the main ceremony in South Delhi — how does ShareInvite handle this?",
        a: "Add each ceremony as a separate event — Sangeet at your Gurgaon venue, main wedding in South Delhi, and Reception at a third location — each with its own date, time, and Google Maps link. Guests see the full NCR-spanning programme in one beautiful invitation.",
      },
      {
        q: "How do I share the Delhi wedding invitation with guests from Noida, Gurgaon, and Faridabad together?",
        a: "One ShareInvite link works for the entire NCR. Forward it to all your Delhi, Noida, Gurgaon, and Faridabad family groups on WhatsApp. Everyone receives the same invitation with their specific ceremony venues and timings listed.",
      },
      {
        q: "Can I include the Baraat timing and Vidaai details in my Delhi wedding invitation?",
        a: "Yes. Use ShareInvite's schedule section to note the Baraat timing and departure point, and the Vidaai time for close family. These personal touches make the invitation meaningful and keep the extended family coordinated throughout the wedding.",
      },
    ],
    ctaTagline: "Delhi's grandest wedding — every ceremony, every venue, one WhatsApp link.",
  },

  hyderabad: {
    display: 'Hyderabad',
    state: 'Telangana',
    localDetail:
      "Hyderabad weddings reflect the city's royal Nizami heritage — stunning palace venues, traditional Telugu ceremonies, and lavish reception banquets.",
    localDetail2:
      "From Nischitartham to the grand Pellikoduku ceremonies, Hyderabad weddings have rich rituals your guests deserve a premium digital invite for. ShareInvite lets you display the full Telugu wedding programme, Muhurtham time, and venue address — all shareable via WhatsApp in minutes.",
    traditions: ['Nischitartham', 'Pellikoduku', 'Mangalasnanam', 'Saptapadi'],
    weddingStyle: 'Telugu traditional or royal Nizami grandeur',
    venues: ['Taj Falaknuma Palace', 'ITC Kohenur', 'Novotel HICC', 'Park Hyatt Hyderabad', 'Marriott Hyderabad'],
    faqs: [
      {
        q: "How do I include the full Telugu wedding programme — Nischitartham through to Reception — in my Hyderabad invitation?",
        a: "ShareInvite lets you add each ceremony — Nischitartham, Mangalasnanam, Pellikoduku, main Muhurtham, and Reception — with its own date, time, and venue address. Your guests see the complete multi-day Telugu wedding programme in one elegant invitation.",
      },
      {
        q: "Can I add Taj Falaknuma Palace or a Banjara Hills venue to my Hyderabad wedding invitation?",
        a: "Yes. Add the full venue name and address — including palace venues in Banjara Hills, hotel banquets in Jubilee Hills, or Kalyana Mandapams in Secunderabad — with a Google Maps link. Guests navigate directly from the invitation.",
      },
      {
        q: "How do I share my Hyderabad wedding invitation with guests from Secunderabad, Gachibowli, and outstation?",
        a: "One ShareInvite link works for every guest. Forward it to all your family WhatsApp groups — Secunderabad, Gachibowli, Banjara Hills, and outstation relatives. The invitation opens on any phone without an app download.",
      },
    ],
    ctaTagline: "Hyderabad's royal wedding — every ritual shared with elegance on WhatsApp.",
  },

  chennai: {
    display: 'Chennai',
    state: 'Tamil Nadu',
    localDetail:
      "Chennai weddings are rooted in Tamil tradition — vibrant Kolam decorations, Nalangu ceremonies, and beautiful Brahmana Kalyanam celebrations in the city's finest venues.",
    localDetail2:
      "Tamil weddings follow precise Muhurtham timings and multi-day rituals — Nichayathartham, Nalangu, and the main Kalyanam. A digital invitation lets you share the exact schedule for each ceremony, making it easy for out-of-station relatives and NRI guests to plan their arrival in Chennai.",
    traditions: ['Nichayathartham', 'Nalangu', 'Brahmana Kalyanam', 'Seer Varisai'],
    weddingStyle: 'Tamil Brahmin or Mudaliar traditional ceremony',
    venues: ['ITC Grand Chola', 'Taj Coromandel', 'The Leela Palace Chennai', 'Feathers Hotel', 'Radisson Blu Chennai'],
    faqs: [
      {
        q: "How do I list the full Tamil wedding programme — Nichayathartham, Nalangu, and Kalyanam — in one invitation?",
        a: "ShareInvite lets you add multiple ceremonies — Nichayathartham, Nalangu, main Kalyanam, and Reception — each with its date, time, and venue address. Your guests see the complete multi-day Tamil wedding programme in one elegant invitation.",
      },
      {
        q: "Can I add the Muhurtham time to my Chennai wedding invitation so out-of-station guests arrive on time?",
        a: "Yes. ShareInvite displays the Muhurtham time prominently in the invitation. For NRI guests or relatives from Coimbatore and Madurai, the exact Muhurtham time is the most critical detail — ShareInvite makes it the first thing they see.",
      },
      {
        q: "How do I share my Chennai wedding invitation with both local family and NRI relatives?",
        a: "One ShareInvite link works worldwide. Forward it on WhatsApp to local family in Mylapore and T Nagar, and the same link works for NRI relatives receiving it on WhatsApp abroad. The invitation opens in any browser without an app download.",
      },
    ],
    ctaTagline: "Tamil wedding traditions — Muhurtham to Kalyanam, beautifully shared.",
  },

  pune: {
    display: 'Pune',
    state: 'Maharashtra',
    localDetail:
      "Pune weddings combine Marathi tradition with modern flair — from traditional Ganesh puja ceremonies to grand receptions in the city's premium hotel venues.",
    localDetail2:
      "Pune's growing corporate population means many wedding guests travel from Mumbai, Nashik, and beyond. A ShareInvite digital invitation with your Koregaon Park or Baner venue address, parking details, and ceremony timings saves dozens of WhatsApp messages to guests.",
    traditions: ['Ganesh puja', 'Kelvan ceremony', 'Antarpat', 'Mangalashtaka'],
    weddingStyle: 'Marathi traditional with modern reception',
    venues: ['JW Marriott Pune', 'Conrad Pune', 'Hyatt Regency Pune', 'Taj Blue Diamond', 'Le Méridien Pune'],
    faqs: [
      {
        q: "How do I include Ganesh Puja and Antarpat ceremonies in my Pune wedding invitation?",
        a: "ShareInvite lets you add multiple ceremonies — Ganesh Puja at home, Kelvan, Antarpat at the venue, and Reception — each with its own date, time, and address. Your Pune guests see the full traditional Marathi wedding programme in one invitation.",
      },
      {
        q: "My Pune wedding has guests traveling from Mumbai and Nashik — can they find the venue easily?",
        a: "Yes. The invitation includes the Pune venue address with a Google Maps link. Guests from Mumbai or Nashik tap it for real-time navigation to your Koregaon Park, Baner, or Hadapsar venue — no calls asking for directions.",
      },
      {
        q: "Can I add parking and entry details for my Pune wedding venue to the invitation?",
        a: "Yes. ShareInvite includes a notes section for parking instructions, gate details, and entry information. For hotel venues in Koregaon Park or Baner where parking can be complex, this prevents confusion on the wedding day.",
      },
    ],
    ctaTagline: "Pune's Marathi wedding — every ceremony shared beautifully with every guest.",
  },

  kolkata: {
    display: 'Kolkata',
    state: 'West Bengal',
    localDetail:
      "Kolkata weddings are rich in Bengali culture — vibrant Aashirbaad ceremonies, traditional Sindoor Khela, and grand reception celebrations at iconic venues.",
    localDetail2:
      "Bengali weddings are celebrated across multiple days — Aiburobhaat, Gaye Holud, and the Biye — each deserving its own listing in your digital invitation. ShareInvite lets Kolkata families create a single WhatsApp-shareable link with all ceremony details, venue addresses, and a countdown to the Saat Paak.",
    traditions: ['Aiburobhaat', 'Gaye Holud', 'Saat Paak', 'Sindoor Khela'],
    weddingStyle: 'Bengali traditional multi-day celebration',
    venues: ['Taj Bengal', 'ITC Royal Bengal', 'The Oberoi Grand', 'Vedic Village', 'Science City Ground'],
    faqs: [
      {
        q: "How do I include all Bengali wedding ceremonies — Aiburobhaat, Gaye Holud, and Biye — in one invitation?",
        a: "ShareInvite lets you add multiple ceremonies — each with its own date, time, and venue. Your Kolkata guests see the full multi-day Bengali wedding programme — Aiburobhaat, Gaye Holud, Saat Paak, Biye, and Bou Bhat — in one beautiful invitation.",
      },
      {
        q: "Can I add the Saat Paak timing and the Gaye Holud venue to my Kolkata wedding invitation?",
        a: "Yes. Add each ceremony as a separate entry. Include the Saat Paak timing for close family and the Gaye Holud venue with a Google Maps pin. Guests across Kolkata, Howrah, and Salt Lake get one-tap directions to each venue.",
      },
      {
        q: "How do I share the Kolkata wedding invitation with family across South Kolkata, Salt Lake, and Howrah?",
        a: "One ShareInvite link works for everyone. Forward it to all your family WhatsApp groups — South Kolkata, Salt Lake, New Town, Howrah, and outstation. The invitation opens in any browser on any phone without an app download.",
      },
    ],
    ctaTagline: "Bengali wedding ceremonies — Gaye Holud to Biye, beautifully shared.",
  },

  ahmedabad: {
    display: 'Ahmedabad',
    state: 'Gujarat',
    localDetail:
      "Ahmedabad weddings celebrate vibrant Gujarati tradition — colourful Garba nights, Mameru ceremonies, and grand multi-day celebrations at the city's finest venues.",
    localDetail2:
      "Gujarati weddings are joyful, community-driven affairs where every detail — from the Mandap location to the Garba night venue — needs to be communicated clearly. A ShareInvite digital invitation lets Ahmedabad families share everything in one link: Janampatri details, Haldi venue, Garba night address, and the main wedding Muhurtham.",
    traditions: ['Garba night', 'Mameru', 'Haldi', 'Saptapadi'],
    weddingStyle: 'Gujarati traditional with vibrant Garba celebration',
    venues: ['Hyatt Regency Ahmedabad', 'Crowne Plaza Ahmedabad', 'Vivanta Ahmedabad', 'Fortune Landmark', 'The House of MG'],
    faqs: [
      {
        q: "How do I include the Garba night and Mandap ceremony details in my Ahmedabad wedding invitation?",
        a: "ShareInvite lets you add multiple ceremonies — Garba night, Haldi, Mameru, and main wedding Mandap — each with its own date, time, and venue address. Guests see the full multi-day Gujarati wedding programme with Google Maps links for every venue.",
      },
      {
        q: "Can I add the Garba night venue separately from the main wedding venue in my Ahmedabad invitation?",
        a: "Yes. Add each event as a separate entry. If your Garba night is at one venue and the Mandap at another, each has its own address and Google Maps link. Guests in Satellite, Prahlad Nagar, or from Vadodara navigate to the right venue each day.",
      },
      {
        q: "How do I share the Ahmedabad wedding invitation with family from Vadodara, Surat, and Rajkot?",
        a: "One ShareInvite link works for everyone. Forward it to all your family WhatsApp groups. Guests from Vadodara, Surat, or Rajkot receive the same beautiful invitation with the full programme, Ahmedabad venue addresses, and Google Maps links.",
      },
    ],
    ctaTagline: "Gujarati wedding — Garba to Mandap, every detail shared on WhatsApp.",
  },
}

// ─── Griha Pravesh ────────────────────────────────────────────────────────────

export const GRIHA_PRAVESH_CITIES: Record<CitySlug, GrihaPraveshCityData> = {
  bengaluru: {
    display: 'Bengaluru',
    state: 'Karnataka',
    localDetail:
      "Bengaluru's rapid growth means new apartments and homes are launched constantly — Griha Pravesh celebrations are a weekly occurrence in localities like Whitefield, Electronic City, and Sarjapur Road. With guests coming from across the city in peak traffic, a digital invitation with Google Maps is essential.",
    localDetail2:
      "Karnataka families combine Griha Pravesha rituals with Vastu Shanti Puja. The muhurat time, set by the family pandit, is the most important detail guests need. ShareInvite lets you display it prominently with the full pooja schedule — Ganesh Puja, Vastu Shanti, Griha Pravesha, and lunch.",
    traditions: ['Griha Pravesha', 'Vastu Shanti', 'Satyanarayana Puja', 'Ghar Pravesh'],
    faqs: [
      {
        q: "How do I create a Griha Pravesha invitation for my new Bengaluru apartment?",
        a: "Go to shareinvite.in/create, choose the housewarming template, enter the muhurat time, your new Bengaluru address, and the pooja schedule — Ganesh Puja, Vastu Shanti, Griha Pravesha, and lunch. Your invitation is live in under 5 minutes.",
      },
      {
        q: "My new home in Whitefield has a complex building entry — can I add entry instructions?",
        a: "Yes. ShareInvite includes a notes section for building entry instructions, gate numbers, parking details, and apartment building codes — essential for new complexes in Whitefield, Sarjapur Road, or Electronic City.",
      },
      {
        q: "When should I send the Griha Pravesha invitation to my Bengaluru guests?",
        a: "Send the invitation 10–14 days before the ceremony. For outstation relatives or NRI family, share it 3 weeks in advance. With ShareInvite, sending a WhatsApp reminder is as simple as forwarding the same link again.",
      },
    ],
    ctaTagline: "New home in Bengaluru — share your Griha Pravesha moment on WhatsApp.",
  },

  mumbai: {
    display: 'Mumbai',
    state: 'Maharashtra',
    localDetail:
      "In Mumbai, where apartment buildings have security gates, parking restrictions, and building entry codes, a Griha Pravesh invitation must include more than just the address. ShareInvite lets you add parking instructions, building entry details, and a Google Maps pin for the exact building.",
    localDetail2:
      "Mumbai Griha Pravesh celebrations often include a Satyanarayana Puja combined with the housewarming. Guests from Thane, Navi Mumbai, and Pune need precise timings to plan their travel. A digital invitation makes the muhurat time and schedule visible at all times.",
    traditions: ['Satyanarayana Puja', 'Vastu Puja', 'Ghar Pravesh', 'Lakshmi Puja'],
    faqs: [
      {
        q: "How do I add building entry and parking instructions to a Mumbai Griha Pravesh invitation?",
        a: "Add building name, flat/floor number, society gate details, and parking instructions in ShareInvite's notes section. For new Mumbai housing complexes in Thane, Powai, or Navi Mumbai, this detail prevents guests from spending 20 minutes finding your new home.",
      },
      {
        q: "My Mumbai Griha Pravesh has guests traveling from Thane, Navi Mumbai, and Pune — how does this help?",
        a: "One WhatsApp link works for everyone. The invitation shows the muhurat time and pooja schedule clearly, so guests from Thane or Pune can plan their travel. The Google Maps pin takes them directly to your building.",
      },
      {
        q: "When should I send the Griha Pravesh invitation for a Mumbai housewarming?",
        a: "Send it at least 10–14 days before the ceremony. For guests traveling from Pune, Nashik, or outstation, send 3 weeks ahead. Mumbai traffic means guests from outer suburbs also benefit from having the Google Maps pin well in advance.",
      },
    ],
    ctaTagline: "New Mumbai home — muhurat time and venue, shared in one WhatsApp link.",
  },

  delhi: {
    display: 'Delhi',
    state: 'Delhi NCR',
    localDetail:
      "Delhi NCR housewarmings often involve guests traveling from Gurgaon, Noida, Faridabad, and Ghaziabad. The traffic during peak hours means guests rely on Google Maps for real-time navigation. A digital Griha Pravesh invitation with a live Maps link removes the 'which gate?' and 'where to park?' calls on the event day.",
    localDetail2:
      "North Indian Griha Pravesh in Delhi typically involves Ganesh Puja, Ghar Shanti, and a Saptapadi ritual at the threshold. The muhurat is selected carefully by the family pandit — often in the early morning. ShareInvite displays all these timings clearly for guests.",
    traditions: ['Ghar Pravesh', 'Ganesh Puja', 'Grah Shanti', 'Vastu Puja'],
    faqs: [
      {
        q: "How do I create a Griha Pravesh invitation for my new Delhi or Gurgaon home?",
        a: "Go to shareinvite.in/create, choose the housewarming template, enter the muhurat time, your new address with sector/area details, and the pooja schedule — Ganesh Puja, Ghar Shanti, and lunch. Your invitation is live in minutes.",
      },
      {
        q: "My new home is in Gurgaon and guests are coming from Delhi and Noida — how does ShareInvite help?",
        a: "The invitation includes your Gurgaon address with a Google Maps pin. Guests from Delhi or Noida tap it for real-time navigation. For a new Gurgaon sector, the Google Maps pin is more reliable than a written address for finding the exact building.",
      },
      {
        q: "Can I include Ghar Shanti and Vastu Puja timings in my Delhi Griha Pravesh invitation?",
        a: "Yes. Add the full pooja programme — Ganesh Puja, Ghar Shanti, Vastu Puja, main Griha Pravesh entry, and lunch — with specific times for each. Guests know exactly which part of the ceremony they'll witness if they arrive at different times.",
      },
    ],
    ctaTagline: "New Delhi home — muhurat, pooja schedule, and directions in one WhatsApp link.",
  },

  hyderabad: {
    display: 'Hyderabad',
    state: 'Telangana',
    localDetail:
      "Hyderabad's real estate boom in Gachibowli, Kondapur, and Miyapur means new home entry ceremonies are frequent. Telugu and Hyderabadi families often celebrate Griha Pravesh with a Satyanarayana Vratam — a ceremony that takes several hours and requires guests to be informed of the full schedule.",
    localDetail2:
      "Gruhapravesham in Telugu tradition involves specific rituals like Vasthu Puja, Vastu Shanti, and the boiling of milk in the new kitchen as the first act inside the home. Each ritual has a timing guests appreciate knowing. A digital invitation that lists the programme helps guests arrive at the right moment.",
    traditions: ['Gruhapravesham', 'Vasthu Puja', 'Satyanarayana Vratam', 'Vastu Shanti'],
    faqs: [
      {
        q: "How do I create a digital Gruhapravesham invitation for my new Hyderabad home?",
        a: "Go to shareinvite.in/create, choose the housewarming template, enter the muhurat time, your new Hyderabad address, and the full ceremony programme — Vasthu Puja, milk-boiling ritual, Satyanarayana Vratam. Your WhatsApp-ready invitation is live in minutes.",
      },
      {
        q: "My new home is in Gachibowli and guests are coming from Secunderabad and Banjara Hills — how does this help?",
        a: "The invitation includes your Gachibowli address with a Google Maps pin. Guests from Secunderabad or Banjara Hills tap it for real-time navigation. Gachibowli and Kondapur's new complexes are often easier to find with a pin than a written address.",
      },
      {
        q: "What details should a Gruhapravesham invitation in Hyderabad include?",
        a: "A Hyderabad Gruhapravesham invitation should show: the muhurat time prominently, the full ceremony schedule (Vasthu Puja, milk-boiling, Satyanarayana Vratam), the new home address with a Google Maps pin, parking and entry notes, and a warm family message. ShareInvite includes all of these in one WhatsApp-ready link.",
      },
    ],
    ctaTagline: "Gruhapravesham in Hyderabad — muhurat and programme, beautifully shared.",
  },

  chennai: {
    display: 'Chennai',
    state: 'Tamil Nadu',
    localDetail:
      "Chennai Griha Pravesh (Gruhapravesham) is a significant ceremony in Tamil families — the auspicious entry into the new home after Vastu Puja and the boiling of milk. Guests, including relatives from Coimbatore, Madurai, and abroad, need complete details about muhurat timing and the venue.",
    localDetail2:
      "In Tamil tradition, the Gruhapravesham muhurat is often at sunrise — making it an early-morning event that requires guests to arrive before 6 AM or 7 AM. A digital Griha Pravesh invitation shared on WhatsApp, clearly showing the muhurat time, prevents confusion and late arrivals.",
    traditions: ['Gruhapravesham', 'Vastu Puja', 'Milk Boiling Ritual', 'Lakshmi Puja'],
    faqs: [
      {
        q: "How do I create a digital Gruhapravesham invitation for my new Chennai home?",
        a: "Go to shareinvite.in/create, choose the housewarming template, enter the muhurat time (even if it's 5:30 AM), your new Chennai address, and the pooja programme — Vastu Puja, milk-boiling, Lakshmi Puja. Your invitation is live in under 5 minutes.",
      },
      {
        q: "My Chennai Gruhapravesham muhurat is at sunrise — how do I make sure guests arrive on time?",
        a: "ShareInvite displays the muhurat time as the most prominent detail in the invitation. Share it 2 weeks in advance and send a WhatsApp reminder 2 days before. A clearly visible early muhurat time prevents guests from missing the auspicious moment.",
      },
      {
        q: "My Chennai Gruhapravesham has relatives from Coimbatore and Madurai — can they find the venue easily?",
        a: "Yes. Add your Chennai address with a Google Maps pin. Outstation relatives from Coimbatore or Madurai tap the map for navigation to your new home. The full ceremony schedule lets them plan which train or bus to take to arrive before the muhurat.",
      },
    ],
    ctaTagline: "Gruhapravesham in Chennai — muhurat time and venue, shared in one WhatsApp link.",
  },

  pune: {
    display: 'Pune',
    state: 'Maharashtra',
    localDetail:
      "Pune families moving into new apartments in Kharadi, Baner, Wakad, and Hinjewadi need a digital Griha Pravesh invitation that guests can open on phones while navigating unfamiliar roads. A ShareInvite page with Google Maps, parking details, and the muhurat time makes the event accessible for every guest.",
    localDetail2:
      "Maharashtrian Griha Pravesh includes a Vastu Shanti Puja, Ganesh Pooja, and the traditional Griha Pravesh ritual where the couple enters with a lit lamp. The ceremony schedule, shared on a digital invitation, helps guests from Mumbai and Nashik plan their arrival time.",
    traditions: ['Vastu Shanti', 'Ganesh Pooja', 'Griha Pravesh', 'Satyanarayana Puja'],
    faqs: [
      {
        q: "How do I create a Griha Pravesh invitation for my new Pune apartment in Baner or Wakad?",
        a: "Go to shareinvite.in/create, choose the housewarming template, enter the muhurat time, your new Pune address, and the ceremony programme — Ganesh Pooja, Vastu Shanti, and the main Griha Pravesh. Your invitation is live in under 5 minutes.",
      },
      {
        q: "My new Pune apartment is in a gated community — how do I help guests find it?",
        a: "Add your building name, flat number, society gate details, and parking instructions in ShareInvite's notes section. For new projects in Wakad, Hinjewadi, or Kharadi, where GPS addresses can be slightly off, exact building and gate details prevent confusion on the day.",
      },
      {
        q: "My Pune Griha Pravesh has guests from Mumbai and Nashik — can they navigate easily?",
        a: "Yes. The invitation includes a Google Maps pin for your new address. Guests from Mumbai take the expressway and tap the map for the final leg. For Nashik relatives, the muhurat time and journey details visible in the invitation help them plan their travel.",
      },
    ],
    ctaTagline: "New Pune home — muhurat, pooja schedule, and Google Maps in one WhatsApp link.",
  },

  kolkata: {
    display: 'Kolkata',
    state: 'West Bengal',
    localDetail:
      "In Kolkata, a new home entry (Griha Pravesh or Nababasa) is celebrated with a Lakshmi Puja and Saraswati Puja. Bengali families mark this with family gatherings and a special meal. ShareInvite helps Kolkata families create a digital invitation with the puja schedule, venue address, and a blessings section for relatives.",
    localDetail2:
      "Bengali Griha Pravesh often coincides with an auspicious tithi from the Hindu calendar. Relatives from Howrah, Salt Lake, and New Town rely on a digital invitation to confirm the muhurat time and venue address. A WhatsApp-ready digital invite removes all day-of confusion.",
    traditions: ['Lakshmi Puja', 'Saraswati Puja', 'Nababasa', 'Vastu Puja'],
    faqs: [
      {
        q: "How do I create a Griha Pravesh invitation for my new Kolkata home?",
        a: "Go to shareinvite.in/create, choose the housewarming template, enter the puja time, your new Kolkata address, and the programme — Lakshmi Puja, Vastu Puja, and the traditional meal. Your WhatsApp-ready invitation is live in under 5 minutes.",
      },
      {
        q: "My new home is in New Town and my family is spread across South Kolkata and Howrah — how does this help?",
        a: "One WhatsApp link works for everyone. The invitation includes the New Town address with a Google Maps pin. Relatives from South Kolkata or Howrah tap it for navigation — especially useful for New Town's newer blocks and sector divisions.",
      },
      {
        q: "Can I add the Bengali tithi and puja programme to my Kolkata Griha Pravesh invitation?",
        a: "Yes. Add the auspicious tithi date, puja start time, and the full programme — Lakshmi Puja, Nababasa ritual, and the family meal. Relatives who want to arrive at the exact puja moment versus those coming for the meal will both know when to be there.",
      },
    ],
    ctaTagline: "New Kolkata home — Nababasa blessings shared with the whole family on WhatsApp.",
  },

  ahmedabad: {
    display: 'Ahmedabad',
    state: 'Gujarat',
    localDetail:
      "Gujarati families celebrate Griha Pravesh with a Vastu Shanti Puja and Satyanarayan Katha. Guests from Vadodara, Surat, and Rajkot often attend — making a digital invitation with the exact venue address, muhurat time, and ceremony schedule essential for out-of-city coordination.",
    localDetail2:
      "In Gujarat, the Griha Pravesh muhurat is selected based on astrological guidance — often an early morning or specific afternoon timeslot. ShareInvite displays this prominently in the invitation, ensuring guests from across Gujarat arrive prepared and on time.",
    traditions: ['Vastu Shanti', 'Satyanarayan Katha', 'Ganesh Puja', 'Lakshmi Puja'],
    faqs: [
      {
        q: "How do I create a Griha Pravesh invitation for my new Ahmedabad home?",
        a: "Go to shareinvite.in/create, choose the housewarming template, enter the muhurat time, your new Ahmedabad address, and the ceremony programme — Vastu Shanti, Satyanarayan Katha, and the community meal. Your WhatsApp-ready invitation is live in minutes.",
      },
      {
        q: "My Ahmedabad Griha Pravesh has family from Vadodara, Surat, and Rajkot — how does a digital invite help?",
        a: "One WhatsApp link reaches everyone. The invitation shows the muhurat time and full ceremony schedule, so outstation guests from Vadodara or Surat can plan their travel accordingly. The Google Maps pin takes them directly to your new home.",
      },
      {
        q: "When should I send the Griha Pravesh invitation for an Ahmedabad housewarming?",
        a: "Send it 2–3 weeks before the ceremony for guests from Vadodara, Surat, or Rajkot. For local Ahmedabad guests, 10–14 days in advance is sufficient. With ShareInvite, sending a reminder is as easy as forwarding the same WhatsApp link again.",
      },
    ],
    ctaTagline: "Ahmedabad Griha Pravesh — muhurat and blessings, shared across Gujarat on WhatsApp.",
  },
}
