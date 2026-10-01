import type { WordingSectionData } from '@/components/wording/WordingSection'

/**
 * Birthday invitation messages, in page order. Section ids are the jump-link
 * anchors on /birthday-invitation-wording — keep them stable.
 */
export const BIRTHDAY_SECTIONS: WordingSectionData[] = [
  {
    id: 'simple',
    toc: 'Simple WhatsApp messages',
    title: 'Simple Birthday Invitation Messages for WhatsApp',
    intro: 'The most-shared birthday invitations are short and simple. These copy-paste messages are ready for WhatsApp — clear date, time and venue in the first lines, so no guest is left guessing.',
    messages: [
      { title: '1. Simplest one-liner', text: `You're invited to [Name]'s birthday! 🎉
📅 [Date] · 🕖 [Time] · 📍 [Venue, City]
Please come and make the day special!` },
      { title: '2. Simple & warm', text: `It's [Name]'s birthday and you're invited! 🎂

Date: [Date]
Time: [Time] onwards
Venue: [Venue & Address]

Come celebrate with us — your presence will make it perfect.` },
      { title: '3. Simple in English (formal-friendly)', text: `We warmly invite you to celebrate the birthday of [Name].

Date: [Date]
Time: [Time]
Venue: [Venue, Address]

Your presence will add joy to our celebration.` },
      { title: '4. Short & casual', text: `Party alert! 🥳 It's [Name]'s birthday!
[Date] · [Time] · [Venue]
Good food, great company — just bring yourself!` },
      { title: '5. Simple with RSVP', text: `Join us to celebrate [Name]'s birthday! 🎈

📅 [Date] · 🕖 [Time]
📍 [Venue, Address]

Kindly confirm your presence: [Phone / WhatsApp]` },
      { title: '6. Bilingual simple (Hindi + English)', text: `[Name] के जन्मदिन पर आप सादर आमंत्रित हैं! 🎉
दिनांक: [Date] · समय: [Time] · स्थान: [Venue]

You're invited to [Name]'s birthday — do join us!` },
    ],
  },
  {
    id: 'first-birthday',
    toc: 'First birthday',
    title: 'First Birthday Invitation Messages for WhatsApp',
    intro: 'The first birthday is one of the most celebrated milestones for Indian families. These messages cover every context — from a traditional family celebration to a themed party.',
    messages: [
      { title: '1. Traditional Indian — with family blessings', text: `With the blessings of our elders and the grace of God, we joyfully announce that our little one is turning ONE!

Join us for the birthday celebration of
Baby [Child's Name]

Date: [Date]
Time: [Time] onwards
Venue: [Venue Name & Address]

Your presence and blessings will make this day truly special for our family.

— [Father's Name] & [Mother's Name]` },
      { title: '2. Simple WhatsApp short message', text: `[Child's Name] is turning 1! 🎂

Join us to celebrate on [Date] at [Time].
Venue: [Venue, City]

Do come and shower [him/her] with your love and blessings!` },
      { title: '3. Theme party invitation', text: `Our little [Theme] star is turning ONE!

We are celebrating the first birthday of
[Child's Name]
with a [Theme] theme party.

Date: [Date]
Time: [Time]
Venue: [Venue & Address]

Dress code: [Theme colours / optional]

Come, celebrate, and make memories with us!
— [Mother's Name] & [Father's Name]` },
      { title: '4. Formal English — both parents named', text: `[Father's Full Name] and [Mother's Full Name]
joyfully invite you to celebrate
the First Birthday of their beloved child

[Child's Full Name]

Date: [Day], [Date]
Time: [Time] onwards
Venue: [Venue Name], [Address], [City]

Kindly grace the occasion with your blessings.
RSVP: [Phone Number]` },
      { title: '5. Bilingual — Hindi + English', text: `हमारे प्यारे [बच्चे का नाम] का पहला जन्मदिन!

आप सभी से अनुरोध है कि अपने आशीर्वाद और स्नेह के साथ हमारे घर पधारें।

तारीख: [Date]
समय: [Time]
स्थान: [Venue, City]

Our little one turns 1 — join us for the celebration!
— [Father's Name] & [Mother's Name]` },
    ],
  },
  {
    id: 'son',
    toc: 'Son',
    title: 'Son Birthday Invitation Messages for WhatsApp',
    intro: 'Inviting family and friends to your son\'s birthday? These messages work for a first birthday, a kids\' party, or a milestone — just add his name and age.',
    messages: [
      { title: '1. Proud parents — warm', text: `Our little prince is turning [Age]! 👑

We joyfully invite you to celebrate the birthday of our son
[Son's Name]

Date: [Date] · Time: [Time]
Venue: [Venue & Address]

Your love and blessings will mean the world to him.
— [Parents' Names]` },
      { title: '2. Simple in English', text: `It's our son [Name]'s [Age]th birthday! 🎂
Join us on [Date] at [Time], [Venue].
Come shower him with love and blessings!` },
      { title: '3. Theme party for son', text: `Our little superhero [Name] is turning [Age]! 🦸

Join the [Theme] birthday party!
Date: [Date] · Time: [Time]
Venue: [Venue & Address]

Cake, games and lots of fun await — see you there!` },
      { title: '4. Formal — both parents named', text: `[Father's Name] & [Mother's Name]
cordially invite you to celebrate
the [Age]th birthday of their beloved son

[Son's Full Name]

Date: [Day, Date] · Time: [Time]
Venue: [Venue Name, Address]

RSVP: [Phone Number]` },
    ],
  },
  {
    id: 'daughter',
    toc: 'Daughter',
    title: 'Daughter Birthday Invitation Messages for WhatsApp',
    intro: 'Celebrating your daughter\'s birthday? These heartfelt and simple messages are ready to copy — perfect for a princess party, a milestone, or a warm family gathering.',
    messages: [
      { title: '1. Proud parents — warm', text: `Our little princess is turning [Age]! 👑

We joyfully invite you to celebrate the birthday of our daughter
[Daughter's Name]

Date: [Date] · Time: [Time]
Venue: [Venue & Address]

Come bless our little girl on her special day.
— [Parents' Names]` },
      { title: '2. Simple in English', text: `It's our daughter [Name]'s [Age]th birthday! 🎀
Join us on [Date] at [Time], [Venue].
Your love and blessings will make her day!` },
      { title: '3. Princess theme party', text: `A royal celebration for our little princess [Name]! 👸

[Theme] birthday party
Date: [Date] · Time: [Time]
Venue: [Venue & Address]

Dress code: [Theme colours]. Come make magical memories with us!` },
      { title: '4. Formal — both parents named', text: `[Father's Name] & [Mother's Name]
cordially invite you to celebrate
the [Age]th birthday of their beloved daughter

[Daughter's Full Name]

Date: [Day, Date] · Time: [Time]
Venue: [Venue Name, Address]

RSVP: [Phone Number]` },
    ],
  },
  {
    id: 'kids',
    toc: 'Kids party',
    title: 'Kids Birthday Invitation Messages',
    intro: 'Fun, playful messages for a children\'s birthday party — the kind that make both kids and parents smile. Short enough for a WhatsApp group, warm enough to feel personal.',
    messages: [
      { title: '1. Playful group message', text: `🎉 It's party time! [Child's Name] is turning [Age]! 🎂

Join us for cake, games and lots of fun!
📅 [Date] · 🕖 [Time]
📍 [Venue & Address]

All little friends welcome — come ready to play!` },
      { title: '2. Short & sweet', text: `[Child's Name] turns [Age]! 🥳
Birthday party on [Date] at [Time], [Venue].
Cake, games & goodie bags — see you there! 🎈` },
      { title: '3. Themed kids party', text: `🚀 Calling all little explorers! 🚀

[Child's Name] is turning [Age] with a [Theme] party!
Date: [Date] · Time: [Time]
Venue: [Venue & Address]

Come dressed as your favourite [Theme] character!` },
      { title: '4. With parent RSVP note', text: `You're invited to [Child's Name]'s [Age]th birthday! 🎉
📅 [Date] · 🕖 [Time] · 📍 [Venue]

Parents, please RSVP by [Date] so we can plan the cake & games!
— [Parent's Name], [Phone]` },
    ],
  },
  {
    id: 'friends',
    toc: 'Friends',
    title: 'Birthday Invitation Messages for Friends',
    intro: 'For your closest friends, keep it casual and fun. These messages match the vibe of a friends-only birthday — no formality, all good energy.',
    messages: [
      { title: '1. Casual & fun', text: `Guess who's getting older? 😄 It's my birthday!

Come celebrate with me:
📅 [Date] · 🕖 [Time] · 📍 [Venue]

Good vibes only — bring your appetite and your dance moves!` },
      { title: '2. Short group message', text: `It's my birthday and you're on the list! 🎉
[Date] · [Time] · [Venue]
No gifts, just good company. Be there! ❤️` },
      { title: '3. Inviting a friend (from host)', text: `Hey [Friend's Name]! It's [Name]'s birthday bash 🥳
[Date] at [Time], [Venue].
It won't be the same without you — come through!` },
      { title: '4. Night out theme', text: `Another year, another reason to party! 🍾

[Name]'s Birthday Night Out
📅 [Date] · 🕗 [Time] · 📍 [Venue/Club]

Dress to impress. RSVP so we can save your spot!` },
    ],
  },
  {
    id: 'family',
    toc: 'Family',
    title: 'Birthday Invitation Messages for Family',
    intro: 'Family messages carry warmth and respect. These are ideal for mixed family WhatsApp groups where elders and cousins all read the same invite.',
    messages: [
      { title: '1. Warm family invite', text: `Dear Family 🙏

With love and joy, we invite you to celebrate
[Name]'s [Age]th birthday.

Date: [Date] · Time: [Time]
Venue: [Venue & Address]

Your presence and blessings mean everything to us.` },
      { title: '2. Respectful — for elders', text: `Pranam 🙏

We humbly request the honour of your presence at the birthday
celebration of [Name] on [Date] at [Time].
Venue: [Venue, Address].

Kindly grace the occasion with your blessings.
— The [Family Name] Family` },
      { title: '3. Short family group message', text: `Dear All 🙏 [Name]'s birthday celebration is on [Date] at [Time].
Venue: [Venue, City].
Please do join us with the whole family!` },
      { title: '4. Lunch / get-together', text: `We're hosting a family lunch to celebrate [Name]'s birthday! 🎂

Date: [Date] · Time: [Time]
Venue: [Home / Venue Address]

Come hungry and bring the little ones — it's a family affair!` },
    ],
  },
  {
    id: '50th-birthday',
    toc: '50th birthday',
    title: '50th Birthday Invitation Messages for WhatsApp',
    intro: 'Fifty is a big one, and it is usually the children or the spouse who send the invitation. Pick the voice that fits who is hosting — and give outstation family at least three weeks.',
    messages: [
      { title: '1. Children hosting for a parent', text: `Fifty years of love, wisdom, and grace —
[Parent's Name] turns 50!

We, [Child 1's Name] and [Child 2's Name], invite you
to celebrate this golden milestone with our family.

Date: [Date]
Time: [Time] onwards
Venue: [Venue, Address]

Please join us to shower [him/her] with your blessings and love.` },
      { title: '2. Spouse hosting', text: `Fifty looks good on [Name]! 🎉

I'm planning a celebration for my [husband / wife]'s 50th birthday, and it won't feel right without you.

📅 [Date] · 🕢 [Time] onwards
📍 [Venue, City]

Dinner, old photographs and plenty of stories — please come.
— [Your Name]` },
      { title: '3. Your own 50th — for friends', text: `Half a century done, and still the youngest in the group 😄

Join me for my 50th birthday dinner
[Date] · [Time] · [Venue]

No gifts, please — just bring your best old stories.
RSVP: [Phone]` },
      { title: '4. Short WhatsApp message', text: `[Name] turns 50 on [Date]! 🎂
Dinner at [Venue] from [Time] — do come and make it special.
Details 👉 [Digital Invite Link]` },
      { title: '5. Hindi + English', text: `[Name] जी के 50वें जन्मदिन के शुभ अवसर पर आप सपरिवार सादर आमंत्रित हैं। 🙏

दिनांक: [Date] · समय: [Time]
स्थान: [Venue, City]

Join us as we celebrate fifty wonderful years!` },
    ],
  },
  {
    id: '60th-birthday',
    toc: '60th birthday',
    title: '60th Birthday Invitation Messages',
    intro: 'A 60th is as much about blessings as it is about cake. These work for a family dinner, a grandchildren-led party or a traditional Shashtipoorthi.',
    messages: [
      { title: '1. Children hosting', text: `With immense gratitude and joy, we invite you to celebrate
the 60th Birthday of our beloved
[Parent's Full Name]

Date: [Day], [Date]
Time: [Time] onwards
Venue: [Venue Name & Address]

Your presence and blessings would be the greatest gift.

Warmly,
[Son/Daughter's Name] & Family` },
      { title: '2. Shashtipoorthi — South Indian', text: `With the blessings of Sri [Family Deity] and our elders,
we invite you to the Shashtipoorthi of our beloved parents

[Father's Name] & [Mother's Name]

celebrating [Father's Name]'s 60th birthday.

Muhurtham: [Time], [Day], [Date]
Venue: [Kalyana Mandapam / Venue, City]

Homam, the Shashtipoorthi ceremony and lunch.
Your presence and blessings are our greatest gift.
— [Children's Names] & Family` },
      { title: '3. From the grandchildren', text: `Our [Dadaji / Nani] turns 60! 🎉

We grandkids are throwing the party, and you're invited.

📅 [Date] · 🕖 [Time]
📍 [Venue / Home Address]

Come bless [him/her], and stay for dinner!
— [Grandchildren's Names]` },
      { title: '4. Short WhatsApp message', text: `60 years young! 🎂
Join us for [Name]'s 60th birthday on [Date] at [Time], [Venue].
Your blessings and company will mean the world to [him/her].
RSVP: [Phone]` },
      { title: '5. In Hindi', text: `हमारे पूज्य [पिताजी / माताजी] [Name] के 60वें जन्मदिन (षष्ठिपूर्ति) के शुभ अवसर पर
आप सपरिवार सादर आमंत्रित हैं।

दिनांक: [Date] · समय: [Time]
स्थान: [Venue, City]

आपका आशीर्वाद ही हमारे लिए सबसे बड़ा उपहार है। 🙏
— [बच्चों के नाम] एवं परिवार` },
    ],
  },
  {
    id: 'milestone-birthdays',
    toc: '18th, 21st & 30th',
    title: '18th, 21st & 30th Birthday Invitation Wording',
    intro: 'Milestone birthdays deserve a message that matches the occasion. Use these as a starting point — adjust the tone to how formal the celebration will be.',
    messages: [
      { title: '18th Birthday', text: `[Name] is officially 18!

Join us as we celebrate this milestone birthday
on [Date] at [Time].
Venue: [Venue & Address]

Come be part of the moment [Name] steps into adulthood.
— The [Family Name] Family` },
      { title: '21st Birthday', text: `21 years of making our lives better!

Please join us for [Name]'s 21st Birthday Celebration

Date: [Date]
Time: [Time]
Venue: [Venue, Address]

Dinner and dancing to follow. RSVP by [Date] to [Phone].` },
      { title: '30th Birthday', text: `Thirty, flirty, and thriving!

Help us celebrate [Name]'s 30th Birthday
on [Date] at [Time].
Venue: [Venue & Address]

Come with your best memories and your dancing shoes.
RSVP: [Phone / WhatsApp Number]` },
    ],
  },
  {
    id: 'surprise-party',
    toc: 'Surprise party',
    title: 'Surprise Birthday Party Invitation Wording',
    intro: 'The secrecy line is the most important part of a surprise party invitation — always make it prominent so no one accidentally lets it slip.',
    messages: [
      { title: '1. Classic surprise party', text: `⚠️ SURPRISE! Please don't tell [Name]! ⚠️

We are throwing a surprise birthday party for [Name]!

Date: [Date]
Please arrive by: [Time — 30 min before guest of honour]
Venue: [Venue & Address]

[Name] will arrive at [Time]. Please be seated and quiet before then!
RSVP: [Organiser's Name] — [Phone Number]` },
      { title: '2. Surprise at a restaurant', text: `🤫 Keep it a secret — we're surprising [Name]!

We've told [Name] it's just a casual dinner.
The real plan: a full surprise birthday celebration!

Restaurant: [Restaurant Name, Address]
Please arrive by: [Time]
[Name] will arrive around [Time]

Coordinate with [Contact Name] on [Phone] for seating.
Please do not post anything on social media until after the reveal!` },
      { title: '3. Surprise with outstation family', text: `The biggest surprise of [Name]'s [Age]th birthday?
The whole family is flying in!

We are coordinating a surprise gathering — [Name] has no idea.

Date: [Date]
Time: Assembly at [Time] (guests) | [Name] arrives at [Later Time]
Venue: [Venue & Address]

Please keep this completely secret. Coordinate travel plans with
[Organiser's Name] at [Phone Number].
SURPRISE! 🎉` },
    ],
  },
  {
    id: 'cake-cutting',
    toc: 'Cake cutting',
    title: 'Cake Cutting Invitation Messages for WhatsApp',
    intro: 'Hosting a short-and-sweet cake-cutting rather than a full party? These messages set the right expectation — a quick, joyful gathering.',
    messages: [
      { title: '1. Simple cake cutting', text: `Join us for [Name]'s birthday cake cutting! 🎂

Date: [Date] · Time: [Time]
Venue: [Venue / Home Address]

A short, sweet celebration — your presence will make it special.` },
      { title: '2. Cake cutting + snacks', text: `🎂 Cake cutting for [Name]'s [Age]th birthday!
[Date] · [Time] · [Venue]
Cake, snacks and good company — drop by and celebrate with us!` },
      { title: '3. Office / team cake cutting', text: `Team, join us to celebrate [Name]'s birthday! 🎉
Cake cutting at [Time] on [Date], [Location/Cafeteria].
Let's take a break and celebrate together!` },
      { title: '4. Midnight cake cutting', text: `Midnight cake cutting! 🎂🕛

We're surprising [Name] at 12 sharp on [Date].
Please reach [Home Address] by 11:45 PM — and keep it quiet!` },
      { title: '5. Small cake cutting at home', text: `A small cake cutting at home for [Name]'s birthday 🎂
[Date] · [Time] · [Home Address]

Nothing fancy — just cake, chai and the people we love. Do drop by!` },
    ],
  },
  {
    id: 'lunch-dinner',
    toc: 'Lunch & dinner',
    title: 'Birthday Lunch & Dinner Invitation Messages',
    intro: 'When the celebration is a meal rather than a party, say so — guests plan their day differently for a lunch at home than for a dinner at a restaurant.',
    messages: [
      { title: '1. Birthday lunch at home', text: `We're having a birthday lunch for [Name] at home! 🎂

Date: [Date] · Time: [Time]
Address: [Home Address]

Home-cooked food, cake and family — please come with everyone.
— [Host Name]` },
      { title: '2. Birthday dinner at a restaurant', text: `Join us for [Name]'s birthday dinner! 🍽️

[Restaurant Name], [Area]
[Date] · [Time]

We've booked a table, so please confirm by [Date].
RSVP: [Phone]` },
      { title: '3. Formal birthday dinner', text: `[Host Names]
request the pleasure of your company at a dinner
to celebrate the [Age]th birthday of

[Name]

[Day], [Date] · [Time] onwards
[Venue, City]

Kindly confirm by [Date]: [Phone]` },
      { title: '4. Lunch with friends — casual', text: `It's my birthday, and lunch is on me! 🥳
[Restaurant], [Date] at [Time].

Come hungry. Just tell me by [Date] so I can book the table.` },
      { title: '5. Short WhatsApp dinner invite', text: `Birthday dinner for [Name] on [Date], [Time] at [Restaurant]. 🎉
Table's booked — just let me know if you're coming!` },
    ],
  },
  {
    id: 'hindi',
    toc: 'In Hindi',
    title: 'Birthday Invitation Messages in Hindi for WhatsApp',
    intro: 'हिंदी में जन्मदिन निमंत्रण — for family groups, elders and anyone who would rather read the invitation in Hindi. Add the date, time and venue and send.',
    messages: [
      { title: '1. सरल संदेश (Simple)', text: `[Name] के जन्मदिन पर आप सादर आमंत्रित हैं! 🎂

दिनांक: [Date]
समय: [Time]
स्थान: [Venue, City]

आपके आने से हमारी खुशी दोगुनी हो जाएगी।` },
      { title: '2. बेटे के जन्मदिन पर (Son)', text: `हमारे प्यारे बेटे [Name] का [Age]वाँ जन्मदिन है! 🎉
इस खुशी के मौके पर आप सपरिवार आमंत्रित हैं।

दिनांक: [Date] · समय: [Time]
स्थान: [Venue]

आइए, उसे अपना आशीर्वाद दीजिए।
— [Parents' Names]` },
      { title: '3. बेटी के जन्मदिन पर (Daughter)', text: `हमारी लाडली बेटी [Name] [Age] साल की हो रही है! 🎀
उसके जन्मदिन की खुशियों में शामिल होने के लिए आप सादर आमंत्रित हैं।

दिनांक: [Date] · समय: [Time]
स्थान: [Venue]

आपके आशीर्वाद का इंतज़ार रहेगा।` },
      { title: '4. पहला जन्मदिन (First birthday)', text: `हमारे नन्हे [Name] का पहला जन्मदिन! 🎂
ईश्वर की कृपा और बड़ों के आशीर्वाद से हमारा [लाडला / लाडली] एक साल का हो गया है।

इस शुभ अवसर पर आप सपरिवार आमंत्रित हैं।
दिनांक: [Date] · समय: [Time]
स्थान: [Venue, City]` },
      { title: '5. दोस्तों के लिए (For friends)', text: `दोस्तों, मेरा जन्मदिन है और पार्टी पक्की है! 🥳
[Date] को [Time] बजे, [Venue] पर मिलते हैं।
आना ज़रूर — तुम्हारे बिना मज़ा नहीं आएगा!` },
      { title: '6. बड़ों के लिए (Formal, for elders)', text: `सादर प्रणाम 🙏

[Name] के जन्मदिन के उपलक्ष्य में एक छोटा-सा आयोजन रखा गया है।
आपसे विनम्र निवेदन है कि [Date] को [Time] बजे [Venue] पधारकर हमें अपना आशीर्वाद दें।

— [Family Name] परिवार` },
    ],
  },
  {
    id: 'whatsapp-groups',
    toc: 'WhatsApp groups',
    title: 'Simple Birthday Invitation Text for WhatsApp Groups',
    intro: 'For group chats, shorter is better. These messages get to the point fast — the full details live in the digital invite link you paste below them.',
    messages: [
      { title: 'Kids birthday group post', text: `[Child's Name] turns [Age] on [Date]!
Birthday party at [Venue], [Time] onwards.
All little ones welcome — cake, games & fun!
Details 👉 [Digital Invite Link]` },
      { title: 'Adults casual group post', text: `Hey everyone! [Name]'s birthday bash is happening!
📅 [Date] | 🕖 [Time] | 📍 [Venue]
Come hungry, come ready to party.
Full details: [Digital Invite Link]` },
      { title: 'Office / friends group', text: `Celebrating [Name]'s [Age]th! 🎂
Join us on [Date] at [Time], [Venue].
RSVP by [Date] — confirming helps us plan.
Invite: [Digital Invite Link]` },
      { title: 'Mixed family group', text: `Pranam 🙏 / Dear All,
[Name]'s birthday celebration is on [Date] at [Time].
Venue: [Venue, Address].
Your blessings and presence are requested.
View full invite: [Digital Invite Link]` },
    ],
  },
  {
    id: 'formal',
    toc: 'Formal wording',
    title: 'Formal Birthday Invitation Wording',
    intro: 'For milestone celebrations, corporate birthdays, or when the occasion calls for elegance, use formal wording. Keep the language dignified and the details precise.',
    messages: [
      { title: '1. Classic formal invitation', text: `The pleasure of your company is requested
at the birthday celebration of

[Full Name]

[Day], the [Date]
at [Time]
[Venue Name], [Address], [City]

RSVP by [Date]: [Phone Number]` },
      { title: '2. Formal — hosted by family', text: `[Host Family Name]
cordially invite you to celebrate the [Age]th birthday of

[Full Name]

Date: [Day, Date] · Time: [Time] onwards
Venue: [Venue Name, Full Address]

Dinner will be served. Kindly confirm your presence by [Date].` },
      { title: '3. Elegant milestone (50th/60th)', text: `With great joy, we invite you to celebrate a milestone —
the [Age]th Birthday of

[Full Name]

[Day], [Date] · [Time]
[Venue Name, Address]

Your presence would be the greatest honour and gift.` },
    ],
  },
]
