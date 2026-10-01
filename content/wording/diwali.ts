import type { WordingSectionData } from '@/components/wording/WordingSection'

/**
 * Diwali invitation messages for /diwali-invitation-wording, in page order.
 * Section ids are the jump-link anchors — keep them stable, the page is meant
 * to be reused every year (only the date line in the page copy changes).
 */
export const DIWALI_SECTIONS: WordingSectionData[] = [
  {
    id: 'simple',
    toc: 'Simple WhatsApp messages',
    title: 'Simple Diwali Party Invitation Messages for WhatsApp',
    intro: 'Short enough to read in the notification, clear enough that nobody has to ask what time. Paste your invitation link underneath for the map and the plan for the evening.',
    messages: [
      { title: '1. The simplest one', text: `Happy Diwali! 🪔
Join us for a Diwali get-together on [Date] at [Time], [Venue / Home Address].
Diyas, dinner and lots of mithai — do come!` },
      { title: '2. Warm, for family and friends', text: `This Diwali, our home will feel brighter with you in it. 🪔

Diwali party at ours
📅 [Date] · 🕢 [Time] onwards
📍 [Home Address]

Please come with the whole family.
— [Your Names]` },
      { title: '3. With RSVP', text: `You're invited to our Diwali party! ✨
📅 [Date] · 🕖 [Time]
📍 [Venue, City]
Do let us know by [Date] so we can plan the food: [Phone]` },
      { title: '4. With the invitation link', text: `Diwali Milan at the [Family Name]s' 🪔
[Date] · [Time] · [Area]
Map, dress code and the plan for the evening 👉 [Digital Invite Link]` },
      { title: '5. For family abroad', text: `Diwali isn't the same without you, so we're sending you the party.
Everything — the evening's plan, photos of the rangoli and a place to leave your wishes — is on this link. Open it on Diwali night and say hello. 🪔
[Digital Invite Link]` },
    ],
  },
  {
    id: 'party-at-home',
    toc: 'Party at home',
    title: 'Diwali Party at Home — Invitation Messages',
    intro: 'Most Diwali parties are at home, which means guests need the address, the time and a sense of the evening: dinner, cards, phuljhadis on the terrace. Say what you have planned.',
    messages: [
      { title: '1. Diwali house party', text: `Lights, laughter and a lot of food — you're invited to our Diwali party! 🪔

📅 [Date] · 🕢 [Time] onwards
📍 [Flat / House No., Building, Area]

Diyas & rangoli at [Time], dinner at [Time], phuljhadis after.
— [Your Names]` },
      { title: '2. Diwali card party', text: `Taash, chai and Diwali mithai — the card party is back! 🃏🪔

📅 [Date] · 🕗 [Time] onwards
📍 [Home Address]

Bring your luck (and a little change). Dinner is on us.
RSVP: [Phone]` },
      { title: '3. Diwali dinner', text: `We're hosting a Diwali dinner and we would love you there. 🪔

[Day], [Date] · [Time]
[Home Address]

A festive meal, the whole family, and diyas on every step.
Kindly confirm by [Date]: [Phone]` },
      { title: '4. With a dress code', text: `Diwali party at ours! ✨
📅 [Date] · 🕖 [Time] · 📍 [Address]

Dress code: festive Indian — the brighter the better. 🪔
Come for the food, stay for the photos!` },
      { title: '5. Potluck Diwali', text: `Diwali potluck at our place! 🪔🍲
[Date] · [Time] · [Address]

We're making the biryani and the mithai — bring one dish you love.
Reply here so we don't end up with five plates of chole! 😄` },
    ],
  },
  {
    id: 'lakshmi-puja',
    toc: 'Lakshmi Puja',
    title: 'Diwali Pooja (Lakshmi Puja) Invitation Messages',
    intro: 'When the evening begins with the Lakshmi Puja, give the puja time on its own line — guests who want to sit for the aarti will plan around it.',
    messages: [
      { title: '1. Formal, from the family', text: `With the blessings of Maa Lakshmi and Shri Ganesh, the [Family Name] family invites you to our Diwali Lakshmi Puja.

Date: [Day], [Date]
Puja muhurat: [Time]
Aarti & prasad: [Time]
Dinner: [Time] onwards

Venue: [Home Address]

Please come with your family and share the blessings. 🙏` },
      { title: '2. Simple puja invitation', text: `Join us for Lakshmi Puja this Diwali 🪔
Puja at [Time] on [Date], followed by aarti and dinner.
📍 [Home Address]
We'd be happy to have you with us.` },
      { title: '3. Puja and party together', text: `Puja first, party after! 🪔✨

🙏 Lakshmi Puja: [Time]
🍽️ Dinner & celebrations: [Time] onwards
📍 [Address], [Date]

Come for the aarti, stay for the evening.` },
      { title: '4. Business or shop puja (Chopda Pujan)', text: `With the blessings of Maa Lakshmi, we invite you to the Diwali Lakshmi Puja and Chopda Pujan at [Shop / Firm Name].

Date: [Date] · Muhurat: [Time]
Address: [Shop Address, City]

Your presence will be a blessing for the new year of business. 🙏
— [Owner's Name] & Family` },
    ],
  },
  {
    id: 'office',
    toc: 'Office party',
    title: 'Office Diwali Party Invitation Messages',
    intro: 'For the team group or an email to clients. Keep it bright but professional, and put the date, time and place where a busy person will see them.',
    messages: [
      { title: '1. For the team', text: `Team, it's Diwali party time! 🪔

📅 [Date] · 🕔 [Time]
📍 [Venue / Office Floor]

Snacks, games, a rangoli contest and a few surprises.
Ethnic wear encouraged! RSVP to [Name] by [Date].` },
      { title: '2. Formal, for the company', text: `[Company Name] cordially invites you to our Diwali celebration.

[Day], [Date] · [Time] onwards
[Venue, City]

Join us for an evening of lights, music and dinner with colleagues and their families.
Kindly confirm your attendance by [Date].` },
      { title: '3. For clients and partners', text: `Dear [Name],

As the festival of lights approaches, we would be delighted to have you join us for a Diwali evening at [Venue] on [Date] at [Time].

Thank you for a wonderful year together. We look forward to celebrating with you.
— [Your Name], [Company]` },
      { title: '4. Diwali lunch at the office', text: `Diwali lunch at the office! 🪔🍛
[Date] · [Time] · [Cafeteria / Floor]
Festive menu, mithai and a team photo — please don't miss it!` },
    ],
  },
  {
    id: 'society',
    toc: 'Society & community',
    title: 'Society & Community Diwali Celebration Invitations',
    intro: 'For the building WhatsApp group or the notice board. Mention every part of the programme — families decide which bits to come down for.',
    messages: [
      { title: '1. Society Diwali Milan', text: `Dear residents,

[Society Name] invites all families to our Diwali Milan! 🪔

📅 [Date] · 🕕 [Time] onwards
📍 Clubhouse / Society Garden

Rangoli competition at [Time], cultural programme at [Time], dinner at [Time].
Let's celebrate together!
— [Society Committee]` },
      { title: '2. Rangoli competition', text: `🪔 Diwali Rangoli Competition 🪔
[Date] · [Time] · [Venue]
Teams of up to [Number] — register with [Name] at [Flat No.] by [Date].
Prizes for the best designs, and mithai for everyone!` },
      { title: '3. Community Diwali dinner', text: `[Community / Association Name] warmly invites you and your family to our Diwali dinner.

[Day], [Date] · [Time]
[Venue, City]

Puja, cultural programme and dinner. Children welcome!
RSVP by [Date]: [Phone]` },
    ],
  },
  {
    id: 'friends',
    toc: 'For friends',
    title: 'Diwali Party Invitation Messages for Friends',
    intro: 'For the friends group — casual, a little cheeky, and still clear about where and when.',
    messages: [
      { title: '1. Casual', text: `Diwali at mine this year! 🪔🎉
[Date] · [Time] onwards · [Address]
Food, music, cards and the loudest phuljhadis in the building. Be there!` },
      { title: '2. Short group message', text: `Diwali party 🪔 [Date], [Time], at ours.
Bring your appetite and your best kurta. 😄` },
      { title: '3. After-Diwali get-together', text: `Too busy with family on Diwali night? Same. 😄
Let's do a post-Diwali get-together on [Date] at [Time], [Venue].
Leftover mithai guaranteed!` },
    ],
  },
  {
    id: 'hindi',
    toc: 'In Hindi',
    title: 'Diwali Invitation Messages in Hindi',
    intro: 'दिवाली निमंत्रण हिंदी में — family groups and elders often prefer it. Add the date, time and address and send.',
    messages: [
      { title: '1. सरल संदेश (Simple)', text: `शुभ दीपावली! 🪔

दीपावली के पावन अवसर पर हमारे घर आयोजित मिलन समारोह में आप सपरिवार सादर आमंत्रित हैं।

दिनांक: [Date]
समय: [Time]
स्थान: [पता]

आपके आने से हमारी दीपावली और रोशन हो जाएगी।` },
      { title: '2. लक्ष्मी पूजन (Lakshmi Puja)', text: `॥ श्री गणेशाय नमः ॥

माँ लक्ष्मी की कृपा से दीपावली पर हमारे घर लक्ष्मी पूजन का आयोजन किया गया है।

पूजन मुहूर्त: [Time], [Date]
स्थान: [पता]

आप सपरिवार पधारकर पूजन एवं प्रसाद में सम्मिलित हों। 🙏
— [परिवार का नाम]` },
      { title: '3. दिवाली पार्टी (Party)', text: `दिवाली की रौनक, मिठाई और ढेर सारी मस्ती! 🎉🪔

[Date] को शाम [Time] बजे, [Venue] पर दिवाली पार्टी है।
आप ज़रूर आइए — आपके बिना रौनक अधूरी है!` },
      { title: '4. दिवाली मिलन (Diwali Milan)', text: `सादर निमंत्रण 🙏

दीपावली मिलन समारोह
दिनांक: [Date] · समय: [Time]
स्थान: [Venue, City]

रंगोली, सांस्कृतिक कार्यक्रम और भोज — आप सपरिवार आमंत्रित हैं।
— [आयोजक का नाम]` },
      { title: '5. Hindi + English', text: `शुभ दीपावली! 🪔
Join us for a Diwali get-together on [Date] at [Time], [Address].
आपका इंतज़ार रहेगा!` },
    ],
  },
]
