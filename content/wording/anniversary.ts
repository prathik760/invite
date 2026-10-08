import type { WordingSectionData } from '@/components/wording/WordingSection'

/**
 * Anniversary invitation messages, in page order. Section ids are the
 * jump-link anchors on /anniversary-invitation-wording — keep them stable.
 *
 * Grouped the way people search ("25th anniversary invitation message",
 * "parents anniversary invitation from children", "golden jubilee invitation"),
 * so each group answers one query on its own.
 */
export const ANNIVERSARY_SECTIONS: WordingSectionData[] = [
  {
    id: 'simple',
    toc: 'Simple WhatsApp messages',
    title: 'Simple Anniversary Invitation Messages for WhatsApp',
    intro: 'Short messages for the family group or one-to-one: the couple, the milestone, the date and the place in the first lines, then one warm line. Paste your invitation link underneath and the details travel with it.',
    messages: [
      { title: '1. Simplest one-liner', text: `You're invited to celebrate [Names]' [Number]th wedding anniversary! 💍
[Date] · [Time] · [Venue]
Your presence would make the day special.` },
      { title: '2. Short & warm', text: `[Number] years of love, laughter and togetherness! 💕

Please join us to celebrate the wedding anniversary of
[Husband's Name] & [Wife's Name]

📅 [Day], [Date]
📍 [Venue], [City]` },
      { title: '3. With the invitation link', text: `[Names] are celebrating [Number] years together! 🥂
The date, the venue map and the timings are all here:
[Invitation Link]
We would love to see you there.` },
      { title: '4. With an RSVP request', text: `Join us for [Names]' anniversary celebration on [Date] at [Venue]! 🎉
Please let us know by [RSVP Date] if you can make it — just reply here.
Full invitation: [Invitation Link]` },
      { title: '5. Simple formal (English)', text: `We cordially invite you and your family to celebrate the [Number]th wedding anniversary of
[Husband's Name] & [Wife's Name]
on [Day], [Date] at [Time]
at [Venue], [City].

Your presence and blessings are requested.` },
      { title: '6. Bilingual (Hindi + English)', text: `शादी की सालगिरह मुबारक! 🎊
[Names] celebrate [Number] years together
[Date] · [Venue]
आपकी उपस्थिति हमारे लिए सबसे बड़ा तोहफ़ा है। Do join us!` },
    ],
  },
  {
    id: '25th',
    toc: '25th — silver jubilee',
    title: '25th Wedding Anniversary Invitation Message (Silver Jubilee)',
    intro: 'Twenty-five years is the silver jubilee — usually a dinner or a family function with relatives who were at the wedding itself. These messages work from the couple, from the children, or from the whole family.',
    messages: [
      { title: '1. Silver jubilee — classic', text: `25 years of togetherness! 🥂

Please join us to celebrate the Silver Jubilee of
[Husband's Name] & [Wife's Name]

📅 [Day], [Date] · ⏰ [Time] onwards
📍 [Venue], [City]

Your presence will make our celebration complete.` },
      { title: '2. From the couple', text: `Twenty-five years ago, we promised each other forever — and we'd love to celebrate how far we've come with you.

Our Silver Wedding Anniversary
[Date] · [Time] · [Venue]

With love,
[Husband's Name] & [Wife's Name]` },
      { title: '3. From the children', text: `Our parents [Father's Name] & [Mother's Name] are celebrating 25 years of marriage! 💐
Please join us on [Date] at [Time], at [Venue], to bless them and celebrate this milestone.
— [Children's Names]` },
      { title: '4. Formal silver jubilee', text: `With the blessings of the Almighty,
the family of [Family Name]
requests the pleasure of your company
on the joyous occasion of the Silver Jubilee of

[Husband's Full Name] & [Wife's Full Name]

[Day], [Date] at [Time]
[Venue Name], [Address]
Dinner to follow.` },
      { title: '5. Short, for family groups', text: `25 years, one love story. 💕
[Names]' silver anniversary — [Date], [Venue].
Do come with the family!
[Invitation Link]` },
      { title: '6. With a dress code', text: `Silver Jubilee celebration ✨
[Husband's Name] & [Wife's Name] · 25 years
[Date] · [Time] · [Venue]
Dress code: a touch of silver!` },
      { title: '7. With a pooja before the dinner', text: `On the 25th wedding anniversary of [Husband's Name] & [Wife's Name], we are holding a Satyanarayan Pooja at [Time], followed by lunch.
[Date] · [Home Address / Venue]
Please come and bless the couple. 🙏` },
    ],
  },
  {
    id: '50th',
    toc: '50th — golden jubilee',
    title: '50th Wedding Anniversary Invitation Message (Golden Jubilee)',
    intro: 'Fifty years is the golden jubilee — often hosted by the children and grandchildren, with relatives travelling in. Give guests time to plan, and keep the wording respectful: the couple are the elders of the family.',
    messages: [
      { title: '1. Golden jubilee — classic', text: `50 golden years together! ✨

Please join us to celebrate the Golden Jubilee of
[Husband's Name] & [Wife's Name]

📅 [Day], [Date] · ⏰ [Time]
📍 [Venue], [City]

Your blessings and presence will make the day golden.` },
      { title: '2. Hosted by children & grandchildren', text: `With hearts full of gratitude, the children and grandchildren of
[Husband's Name] & [Wife's Name]
invite you to celebrate their 50th Wedding Anniversary

[Day], [Date] at [Time]
[Venue], [City]

Kindly join us for the celebration and dinner.` },
      { title: '3. Formal card wording', text: `The family of
[Husband's Full Name] & [Wife's Full Name]
requests the honour of your presence
at the celebration of their Golden Wedding Anniversary

[Day], the [Date in words]
[Time]
[Venue Name], [Address]

Your blessings are the only gift we seek.` },
      { title: '4. Heartfelt', text: `Fifty years ago, they began a journey that gave us all a home. ❤️
Please join us on [Date] at [Venue], [City], as we celebrate [Names]' golden anniversary — and thank them for everything.
[Invitation Link]` },
      { title: '5. For relatives travelling in', text: `Save the date! 🌟
[Names]' 50th Wedding Anniversary
[Date] · [City]

The venue, the timings and nearby hotels are in the invitation, so you can plan your travel:
[Invitation Link]` },
      { title: '6. Short, for WhatsApp', text: `Golden Jubilee! 💛
[Names] · 50 years · [Date] · [Venue]
Please come and bless them.` },
      { title: '7. With a family havan', text: `To mark 50 years of marriage of [Husband's Name] & [Wife's Name], the family is holding a havan at [Time], followed by lunch.
[Date] · [Venue / Home Address]
Your presence and blessings are requested. 🙏
— [Family Name]` },
    ],
  },
  {
    id: 'milestones',
    toc: '1st, 10th, 40th, 60th…',
    title: 'Anniversary Invitation Messages for Every Milestone',
    intro: 'From the first anniversary to the diamond jubilee. Each milestone has its traditional name — 40th is ruby, 60th is diamond — which makes a nice opening line.',
    messages: [
      { title: '1. 1st anniversary', text: `One year of marriage, a lifetime to go! 💑
We're celebrating our first wedding anniversary and would love you to join us.
[Date] · [Time] · [Venue]
— [Husband's Name] & [Wife's Name]` },
      { title: '2. 10th anniversary', text: `10 years, countless memories! 🎉
Join us to celebrate [Names]' 10th wedding anniversary on [Date] at [Venue], [City].
[Invitation Link]` },
      { title: '3. 30th — pearl anniversary', text: `Thirty years, as precious as pearls. 🤍
Please join us for [Names]' pearl anniversary on [Date] at [Time], [Venue].` },
      { title: '4. 40th — ruby anniversary', text: `40 years of love! ❤️
You're invited to celebrate the Ruby Wedding Anniversary of
[Husband's Name] & [Wife's Name]
[Date] · [Time] · [Venue], [City]` },
      { title: '5. 60th — diamond jubilee', text: `Sixty years together — a love as rare as a diamond. 💎
The family invites you to celebrate the Diamond Jubilee of
[Husband's Name] & [Wife's Name]
on [Date] at [Venue], [City].
Your blessings will make the day complete.` },
      { title: '6. Any year', text: `Celebrating [Number] years of [Husband's Name] & [Wife's Name]! 🥂
Join us on [Date] at [Time] at [Venue] for an evening of love, food and memories.` },
      { title: '7. Milestone with a photo journey', text: `From [Wedding Year] to today — [Number] years of [Names]. 📸
Come celebrate with us on [Date] at [Venue].
Our invitation has photos from every decade: [Invitation Link]` },
    ],
  },
  {
    id: 'parents',
    toc: "Parents' anniversary",
    title: "Parents' Anniversary Invitation Message (From Children)",
    intro: 'The most common anniversary invitation in Indian families: children hosting a celebration for their parents. Name the parents first, say who is inviting, and keep the tone proud and warm.',
    messages: [
      { title: '1. Simple', text: `Our parents [Father's Name] & [Mother's Name] are celebrating [Number] years of marriage! 🎉
Please join us on [Date] at [Time], at [Venue], to celebrate with them.
— [Children's Names]` },
      { title: '2. Formal, hosted by the children', text: `[Children's Names]
request the pleasure of your company
to celebrate the [Number]th Wedding Anniversary of their parents

[Father's Name] & [Mother's Name]

[Day], [Date] at [Time]
[Venue], [City]` },
      { title: '3. Heartfelt', text: `Everything we know about love, we learnt from them. ❤️
Please join us as we celebrate [Number] years of Mummy and Papa — [Father's Name] & [Mother's Name].
[Date] · [Venue], [City]
[Invitation Link]` },
      { title: "4. To your parents' friends", text: `Dear [Uncle / Aunty],
We are celebrating our parents' [Number]th wedding anniversary on [Date] at [Venue], and it would mean the world to them to see you there.
Please do come.
— [Your Name]` },
      { title: '5. Surprise for parents', text: `Shhh! 🤫 We're planning a surprise for Mummy & Papa's [Number]th anniversary.
Please be at [Venue] by [Time] on [Date] — they'll arrive at [Arrival Time].
Don't tell them! 😄 — [Children's Names]` },
      { title: '6. From son and daughter-in-law', text: `With joy, we invite you to celebrate the [Number]th wedding anniversary of our parents [Father's Name] & [Mother's Name].
[Date] · [Time] onwards · [Venue], [City]
Dinner will be served.
— [Son's Name] & [Daughter-in-law's Name]` },
      { title: '7. From grandchildren', text: `Our Dadaji & Dadiji / Nanaji & Naniji are celebrating [Number] years together! 💛
Please join the whole family on [Date] at [Venue] to celebrate them.
[Invitation Link]` },
    ],
  },
  {
    id: 'our-anniversary',
    toc: 'Your own anniversary',
    title: 'Our Anniversary Invitation Message (From the Couple)',
    intro: 'When you are hosting your own anniversary, the invitation can be playful or sentimental — it sounds like the two of you.',
    messages: [
      { title: '1. Warm', text: `[Number] years ago we said "I do" — and we'd love to celebrate it with you! 💕
[Date] · [Time] · [Venue]
— [Husband's Name] & [Wife's Name]` },
      { title: '2. Playful', text: `[Number] years and still not tired of each other! 😄
Come celebrate our anniversary on [Date] at [Venue]. Good food, good music, great company.
[Invitation Link]` },
      { title: '3. Grateful', text: `Thank you for being part of our story. ❤️
We're celebrating our [Number]th anniversary on [Date] at [Venue], [City], and we'd love you to be there.` },
      { title: '4. Small & personal', text: `We're keeping it small this year — just our favourite people, which means you.
Anniversary dinner · [Date] · [Time] · [Venue]
— [Names]` },
      { title: '5. Short', text: `Our anniversary party 🥂
[Date] · [Venue] · [Time] onwards
See you there!` },
    ],
  },
  {
    id: 'surprise',
    toc: 'Surprise party',
    title: 'Surprise Anniversary Party Invitation Message',
    intro: 'Surprise invitations need two extra details: when guests must arrive, and a clear "keep it secret" line. Send them one-to-one — never in a group the couple is part of.',
    messages: [
      { title: '1. Classic surprise', text: `It's a surprise! 🤫
Please join us for a surprise anniversary party for [Names]
📅 [Date] · ⏰ Please arrive by [Time]
📍 [Venue], [City]
The couple arrives at [Arrival Time] — don't spill the secret!` },
      { title: '2. For the children to send', text: `We're surprising Mummy & Papa for their [Number]th anniversary! 🎉
Venue: [Venue] · Date: [Date]
Please arrive by [Time] — they're coming at [Arrival Time].
Shh — not a word to them!` },
      { title: '3. Short', text: `Surprise anniversary party for [Names] 🤫
[Date] · arrive by [Time] · [Venue]
Keep it secret!` },
      { title: '4. With a parking note', text: `Surprise party for [Names]' anniversary on [Date]! 🎊
Please arrive by [Time] and park at [Parking Location] so your car doesn't give it away. 😄
Venue: [Venue], [City]` },
      { title: '5. Asking for photos and messages', text: `We're surprising [Names] for their [Number]th anniversary on [Date]! 💕
If you have an old photo with them, or a message for them, please send it to me by [Date] — we're putting them all together for the day.
Venue: [Venue] · Arrive by [Time]` },
      { title: '6. A virtual surprise', text: `Can't be there? Join the surprise online! 💻
We're surprising [Names] on their anniversary — [Date] at [Time] IST.
Video call link: [Link]
Please join 5 minutes early and stay muted until we say "Surprise!"` },
    ],
  },
  {
    id: 'party',
    toc: 'Dinner & party',
    title: 'Anniversary Dinner & Party Invitation Messages',
    intro: 'For a dinner, a lunch or a party night — say which, because guests plan their evening around it.',
    messages: [
      { title: '1. Dinner', text: `Please join us for dinner to celebrate [Names]' [Number]th wedding anniversary.
[Day], [Date] · [Time] onwards
[Restaurant / Venue], [City]` },
      { title: '2. Lunch at home', text: `We're celebrating [Names]' anniversary with lunch at home on [Date] from [Time]! 🍲
[Home Address]
Do come with the family.` },
      { title: '3. Party night', text: `Anniversary party! 🎶
[Names] · [Number] years
[Date] · [Time] till late · [Venue]
Dress code: [Theme]` },
      { title: '4. Garden party', text: `A garden party for [Names]' [Number]th anniversary 🌿
[Date] · [Time] · [Venue / Farmhouse], [City]
Music, food and old friends — see you there!` },
      { title: '5. With cake cutting', text: `Celebrating [Number] years of [Names]! 🎂
Cake cutting at [Time], followed by dinner.
[Date] · [Venue], [City]` },
      { title: '6. Club or hotel', text: `[Husband's Name] & [Wife's Name] invite you to an evening to celebrate their [Number]th wedding anniversary
[Date] · [Time] onwards
[Hotel / Club Name], [City]
Cocktails & dinner` },
    ],
  },
  {
    id: 'formal',
    toc: 'Formal card wording',
    title: 'Formal Anniversary Invitation Wording (Card Matter)',
    intro: 'Card wording for elders, community invitations and printed or digital cards. Keep the line breaks — they are what make it read like a card.',
    messages: [
      { title: '1. Classic', text: `[Husband's Full Name] & [Wife's Full Name]
request the pleasure of your company
on the occasion of their
[Number]th Wedding Anniversary

[Day], [Date]
[Time]
[Venue Name], [Address]` },
      { title: '2. Hosted by the family', text: `The [Family Name] family
cordially invites you to celebrate
the [Number]th Wedding Anniversary of

[Husband's Name] & [Wife's Name]

on [Day], [Date] at [Time]
[Venue], [City]
Dinner to follow` },
      { title: '3. With a blessing', text: `With the blessings of the Almighty,
we invite you to celebrate [Number] blessed years of marriage of

[Husband's Name] & [Wife's Name]

[Date] · [Time]
[Venue], [Address]

Your presence and blessings are requested.` },
      { title: '4. "No gifts, please"', text: `[Husband's Name] & [Wife's Name]
invite you to celebrate their [Number]th wedding anniversary
[Date] · [Time] · [Venue]

Your presence is the only gift we wish for.` },
      { title: '5. Hosted by friends', text: `Friends of [Husband's Name] & [Wife's Name]
invite you to join them in celebrating
the couple's [Number]th Wedding Anniversary

[Date] · [Time]
[Venue], [City]` },
      { title: '6. RSVP', text: `The pleasure of your company is requested
at the [Number]th Wedding Anniversary celebration of
[Husband's Name] & [Wife's Name]

[Day], [Date] · [Time]
[Venue], [City]

Kindly RSVP by [Date] to [Name] — [Phone Number]` },
    ],
  },
  {
    id: 'pooja',
    toc: 'With pooja, mass or dua',
    title: 'Anniversary Invitation with a Pooja, Thanksgiving Mass or Dua',
    intro: 'Many families mark a milestone anniversary with a prayer first and a meal after. Give the prayer time separately — guests who come for the blessing come earlier.',
    messages: [
      { title: '1. Satyanarayan pooja', text: `On the occasion of the [Number]th wedding anniversary of [Husband's Name] & [Wife's Name], we invite you to the Satyanarayan Pooja.
Pooja: [Time] · Prasad & lunch to follow
[Date] · [Home Address]
— [Family Name] 🙏` },
      { title: '2. Temple visit & lunch', text: `[Names] are celebrating [Number] years of marriage with a visit to [Temple Name] at [Time], followed by lunch at [Venue].
[Date] · [City]
Please join us for the blessings. 🙏` },
      { title: '3. Thanksgiving Mass', text: `With grateful hearts, [Husband's Name] & [Wife's Name] invite you to a Thanksgiving Mass on their [Number]th wedding anniversary
[Date] at [Time], [Church Name], [City]
followed by lunch at [Venue].` },
      { title: '4. Dua & dinner', text: `Alhamdulillah, [Husband's Name] & [Wife's Name] complete [Number] years of marriage.
Please join us for a dua and dinner on [Date] at [Time], [Venue], [City].
— [Family Name]` },
      { title: '5. Havan', text: `To give thanks for [Number] years of marriage of [Husband's Name] & [Wife's Name], the family is holding a havan at [Time].
[Date] · [Venue / Home Address]
Lunch will be served after the havan.` },
    ],
  },
  {
    id: 'vow-renewal',
    toc: 'Vow renewal',
    title: 'Vow Renewal Invitation Message',
    intro: 'For couples who say their vows again on a milestone anniversary — sometimes with the same rituals as the wedding itself.',
    messages: [
      { title: '1. Classic', text: `[Number] years later, we'd say "I do" all over again — and we'd love you to be there when we do. 💍
Vow renewal of [Husband's Name] & [Wife's Name]
[Date] · [Time] · [Venue], [City]` },
      { title: '2. Formal', text: `[Husband's Name] & [Wife's Name]
invite you to witness the renewal of their wedding vows
on their [Number]th anniversary
[Day], [Date] at [Time]
[Venue], [City]
Reception to follow` },
      { title: '3. With traditional rituals', text: `To mark [Number] years of marriage, [Husband's Name] & [Wife's Name] will renew their vows with the rituals of their wedding — varmala and pheras.
[Date] · Muhurat: [Time]
[Venue], [City]
Please come and bless them again!` },
      { title: '4. Short', text: `We're renewing our vows! 💕
[Names] · [Number] years · [Date] · [Venue]
Join us! [Invitation Link]` },
    ],
  },
  {
    id: 'friends',
    toc: 'Friends & colleagues',
    title: 'Anniversary Invitation Messages for Friends & Colleagues',
    intro: 'Relaxed messages for the friends group, and polite ones for colleagues — with the time and the venue up front.',
    messages: [
      { title: '1. Friends group', text: `Calling the whole gang! 🥳
[Names] are celebrating [Number] years together on [Date].
Party at [Venue], [Time] onwards. Be there!
[Invitation Link]` },
      { title: '2. One-to-one to a friend', text: `Hey [Friend's Name]! We're celebrating our [Number]th anniversary on [Date] at [Venue], and it won't be the same without you. Please come! 💛` },
      { title: '3. Office group', text: `Dear all,
We are celebrating our [Number]th wedding anniversary on [Date] and would be happy if you could join us for dinner at [Venue], [City], from [Time].
— [Your Name]` },
      { title: '4. Neighbours & society group', text: `Dear neighbours, we're celebrating [Names]' [Number]th anniversary on [Date] at [Time], at [Flat / House No.]. Please drop by for sweets and good wishes! 🍬` },
      { title: '5. Short', text: `Anniversary celebration 🎉 [Names] · [Date] · [Venue] · [Time]
See you there!` },
    ],
  },
  {
    id: 'hindi',
    toc: 'In Hindi',
    title: 'Anniversary Invitation Message in Hindi (शादी की सालगिरह)',
    intro: 'Hindi wording for the family group and for elders, from a simple WhatsApp message to the traditional card text, plus a Hinglish version for younger guests.',
    messages: [
      { title: '1. Simple WhatsApp message', text: `शादी की सालगिरह का निमंत्रण 💐
[पति का नाम] एवं [पत्नी का नाम] की [संख्या]वीं शादी की सालगिरह के शुभ अवसर पर
आप सपरिवार सादर आमंत्रित हैं।
📅 [तारीख] · ⏰ [समय] · 📍 [स्थान]` },
      { title: '2. 25th — रजत जयंती', text: `विवाह की रजत जयंती 🥂
[पति का नाम] एवं [पत्नी का नाम] के विवाह के 25 वर्ष पूर्ण होने पर
आप सादर आमंत्रित हैं।
दिनांक: [तारीख] · समय: [समय]
स्थान: [स्थान]` },
      { title: '3. 50th — स्वर्ण जयंती', text: `विवाह की स्वर्ण जयंती ✨
[पति का नाम] एवं [पत्नी का नाम] के सुखी वैवाहिक जीवन के 50 वर्ष
इस शुभ अवसर पर आपकी उपस्थिति एवं आशीर्वाद प्रार्थनीय है।
दिनांक: [तारीख] · स्थान: [स्थान]
विनीत: [परिवार के नाम]` },
      { title: "4. From the children (मम्मी-पापा की सालगिरह)", text: `हमारे मम्मी-पापा [पिता का नाम] एवं [माता का नाम] की शादी की [संख्या]वीं सालगिरह है! 🎉
इस खुशी में शामिल होने के लिए आप सभी सपरिवार आमंत्रित हैं।
[तारीख] · [समय] · [स्थान]
— [बच्चों के नाम]` },
      { title: '5. Traditional card wording', text: `सादर आमंत्रण

[पति का नाम] एवं [पत्नी का नाम]
के शुभ विवाह की [संख्या]वीं वर्षगांठ के उपलक्ष्य में
दिनांक [तारीख] को [समय] बजे [स्थान] पर
आयोजित समारोह में आप सपरिवार सादर आमंत्रित हैं।

दर्शनाभिलाषी: [परिवार के नाम]` },
      { title: '6. Short', text: `सालगिरह मुबारक! 💕 [नाम] · [तारीख] · [स्थान]
आप ज़रूर आइए।` },
      { title: '7. Hinglish', text: `Mummy-Papa ki [Number]th anniversary hai! 🎊
[Date] ko [Venue] mein ek chhota sa celebration rakha hai.
Aap sab zaroor aaiye aur unhe aashirwad dijiye. 🙏` },
    ],
  },
  {
    id: 'reminders',
    toc: 'Reminders & thank-yous',
    title: 'Anniversary Reminder & Thank-You Messages',
    intro: 'A reminder the day before saves a dozen calls, and a thank-you after the celebration means a lot to the couple. Re-send the same invitation link — the map is already in it.',
    messages: [
      { title: '1. A week before', text: `Just a week to go for [Names]' anniversary celebration! 🎉
[Date] · [Time] · [Venue]
All the details: [Invitation Link]` },
      { title: '2. The day before', text: `See you tomorrow! 💐
[Names]' anniversary celebration — [Time] at [Venue].
Directions: [Map Link]` },
      { title: '3. RSVP reminder', text: `Hi [Name], hope you can make it to [Names]' anniversary on [Date]! Could you confirm by [RSVP Date] so we can plan the arrangements? 🙏` },
      { title: '4. Thank you from the couple', text: `Thank you for making our anniversary so special! 💕
Your wishes, your blessings and your presence meant the world to us.
With love, [Husband's Name] & [Wife's Name]` },
      { title: '5. Thank you from the children', text: `Thank you all for coming to celebrate Mummy & Papa's [Number]th anniversary! ❤️
Seeing their happiness yesterday was the best gift. — [Children's Names]` },
    ],
  },
]

/** Traditional anniversary names, shown as a reference table on the page. */
export const ANNIVERSARY_NAMES: { year: string; name: string }[] = [
  { year: '1st', name: 'Paper' },
  { year: '5th', name: 'Wood' },
  { year: '10th', name: 'Tin' },
  { year: '15th', name: 'Crystal' },
  { year: '20th', name: 'China' },
  { year: '25th', name: 'Silver (Silver Jubilee)' },
  { year: '30th', name: 'Pearl' },
  { year: '35th', name: 'Coral' },
  { year: '40th', name: 'Ruby' },
  { year: '45th', name: 'Sapphire' },
  { year: '50th', name: 'Gold (Golden Jubilee)' },
  { year: '55th', name: 'Emerald' },
  { year: '60th', name: 'Diamond (Diamond Jubilee)' },
]
