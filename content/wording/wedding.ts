import type { WordingSectionData } from '@/components/wording/WordingSection'

/**
 * Wedding invitation messages, in page order. Section ids are the jump-link
 * anchors on /wedding-invitation-wording — keep them stable.
 *
 * Grouped the way people search ("sister marriage invitation message", "son
 * wedding invitation from parents", "nikah invitation message"), not by tone:
 * each group is a query the page should answer on its own.
 */
export const WEDDING_SECTIONS: WordingSectionData[] = [
  {
    id: 'simple',
    toc: 'Simple WhatsApp messages',
    title: 'Simple Wedding Invitation Messages for WhatsApp',
    intro: 'The messages people actually forward are four or five lines long: the couple, the date and the venue first, then one warm line. Paste your invitation link underneath and the functions, timings and map travel with it.',
    messages: [
      { title: '1. Simplest one-liner', text: `You're invited to the wedding of [Bride] & [Groom]! 💍
[Date] · [Time] · [Venue]
Your blessings mean the world to us.` },
      { title: '2. Short & warm', text: `With joy in our hearts, we invite you to the wedding of
[Bride] & [Groom]

📅 [Day], [Date]
📍 [Venue], [City]

Please come and bless the couple.` },
      { title: '3. With the invitation link', text: `[Bride] & [Groom] are getting married! 🎊
Every function, the venue map and the timings are here:
[Invitation Link]
We would love to see you there.` },
      { title: '4. With an RSVP request', text: `Shaadi time! 💐 [Bride] weds [Groom] on [Date] at [Venue].
Please let us know by [RSVP Date] if you can join us — just reply here.
Full invitation: [Invitation Link]` },
      { title: '5. Simple formal (English)', text: `We cordially invite you and your family to the wedding of
[Bride] with [Groom]
on [Day], [Date] at [Time]
at [Venue], [City].

Kindly grace the occasion with your presence.` },
      { title: '6. Bilingual (Hindi + English)', text: `शुभ विवाह 🙏
[Bride] & [Groom]
[Date] · [Venue]
आपकी उपस्थिति हमारे लिए आशीर्वाद है। Do join us!` },
      { title: '7. Plain text for elders (no emojis)', text: `Namaste,
We are happy to invite you to the wedding of [Bride] and [Groom] on [Day], [Date].
Muhurat: [Time]
Venue: [Venue], [Address], [City]
Your blessings are most important to us. Please do come.
— [Family Name]` },
    ],
  },
  {
    id: 'my-wedding',
    toc: 'Your own wedding',
    title: 'My Marriage Invitation Message (From the Bride or Groom)',
    intro: 'When you are the one getting married, the invitation can sound like you. These are written in the first person — from the bride or the groom — for friends, relatives and everyone in between.',
    messages: [
      { title: '1. From the groom, to friends', text: `Big news — I'm getting married! 🎉
[Groom] & [Bride] · [Date] · [City]
It won't be the same without you, so block the dates now.
All the details: [Invitation Link]` },
      { title: '2. From the bride', text: `I'm getting married! 💍
[Bride] & [Groom] · [Date]

I'd love for you to be there as we begin this new chapter. The full invitation, with every function, is here:
[Invitation Link]` },
      { title: '3. Personal & heartfelt', text: `Dear [Name],
I'm getting married on [Date], and you were one of the first people I wanted to tell.

[Bride] & [Groom]
[Venue], [City]

Your presence would make the day complete. Please do come. ❤️` },
      { title: '4. To relatives, respectfully', text: `Namaste [Mama ji / Aunty ji],
With the blessings of the family, my wedding with [Partner's Name] is fixed for [Date] at [Venue], [City].
It would mean a lot to me to receive your blessings in person.
The full invitation is here: [Invitation Link]` },
      { title: '5. To a group of friends', text: `Guys, it's official — I'm getting married! 🥳
[Date] at [Venue], [City].
Mehendi, sangeet, the wedding — you're invited to all of it.
Details: [Invitation Link]
No excuses accepted. 😄` },
      { title: '6. Short & sweet', text: `We're getting married! 💐
[Your Name] & [Partner's Name] — [Date], [City].
Save the date and come celebrate with us.` },
    ],
  },
  {
    id: 'son',
    toc: "Son's wedding",
    title: "Son's Marriage Invitation Message (From Parents)",
    intro: "For parents inviting relatives, friends and colleagues to their son's wedding. Formal where elders expect it, warm where it's family — the bride's parents are named, as Indian families expect.",
    messages: [
      { title: '1. Warm & simple', text: `With great joy, we invite you to the wedding of our son
[Groom's Name]
with [Bride's Name]
(D/o [Bride's Father] & [Bride's Mother])

📅 [Date] · ⏰ [Muhurat Time]
📍 [Venue], [City]

Your blessings are all we ask.
— [Father's Name] & [Mother's Name]` },
      { title: '2. Formal — with family names', text: `[Father's Name] & [Mother's Name]
request the pleasure of your company
at the marriage of their son

[Groom's Full Name]
with
[Bride's Full Name]
D/o [Bride's Parents' Names]

on [Day], [Date] at [Time]
[Venue Name], [Address]
Reception to follow.` },
      { title: '3. Short, for family WhatsApp groups', text: `Dear family, our son [Groom] is getting married to [Bride] on [Date] in [City]! 🎊
Please keep the dates free and bless the couple with your presence.
Invitation: [Invitation Link]` },
      { title: "4. To the father's friends & colleagues", text: `Dear [Name],
It gives me great pleasure to invite you and your family to the wedding of my son [Groom] with [Bride] on [Date] at [Venue], [City].
We would be honoured by your presence.
Warm regards,
[Your Name]` },
      { title: '5. With the baraat timings', text: `You are cordially invited to the wedding of our son [Groom] with [Bride].

Baraat departs: [Time], [Date] from [Place]
Wedding: [Venue], [City]
Dinner: [Time] onwards

Your presence will add to our joy.
— [Family Name]` },
      { title: "6. Reception hosted by the groom's family", text: `On the happy occasion of the marriage of our son [Groom] with [Bride],
we request the pleasure of your company at a reception
on [Day], [Date], from [Time]
at [Venue], [City].

— [Father's Name] & [Mother's Name]` },
    ],
  },
  {
    id: 'daughter',
    toc: "Daughter's wedding",
    title: "Daughter's Marriage Invitation Message (From Parents)",
    intro: "Wording for parents inviting guests to their daughter's wedding — from the formal card text to a short message for the family group. The groom's parents are named, as is customary.",
    messages: [
      { title: '1. Warm & simple', text: `With the blessings of God and our elders, we invite you to the wedding of our daughter
[Bride's Name]
with [Groom's Name]
(S/o [Groom's Father] & [Groom's Mother])

📅 [Date] · ⏰ [Muhurat Time]
📍 [Venue], [City]

Do come and bless the couple.
— [Father's Name] & [Mother's Name]` },
      { title: '2. Formal card wording', text: `[Father's Name] & [Mother's Name]
solicit your gracious presence
at the marriage of their beloved daughter

[Bride's Full Name]
with
[Groom's Full Name]
S/o [Groom's Parents' Names]

on [Day], [Date]
Muhurat: [Time]
[Venue Name], [Address]` },
      { title: '3. Emotional', text: `Our little girl is getting married. 💛
[Bride] & [Groom] · [Date] · [Venue], [City]
We would love to have you with us as we bless her on the most special day of her life.
Invitation: [Invitation Link]` },
      { title: '4. Short, for family groups', text: `Dear all, by God's grace our daughter [Bride]'s wedding with [Groom] is on [Date] at [Venue]. 🙏
Please join us with your family. All the functions are in the invitation:
[Invitation Link]` },
      { title: '5. To office colleagues', text: `Dear colleagues,
I am happy to invite you to my daughter [Bride]'s wedding with [Groom] on [Date].
Reception: [Time] onwards at [Venue], [City].
It would be lovely to celebrate with you.
— [Your Name]` },
      { title: '6. Bilingual (Hindi + English)', text: `हमारी लाडली बिटिया [Bride] का शुभ विवाह
[Groom] के साथ
[Date] को [Venue], [City] में है।

We warmly invite you and your family to bless the couple.
— [Father's Name] & [Mother's Name]` },
    ],
  },
  {
    id: 'sister',
    toc: "Sister's wedding",
    title: "Sister's Marriage Invitation Message",
    intro: 'Invitations from a brother or sister — for your friends, college groups and colleagues. Proud, warm and easy to forward.',
    messages: [
      { title: '1. Simple', text: `My sister is getting married! 💐
[Sister's Name] weds [Groom's Name]
📅 [Date] · 📍 [Venue], [City]
You have to be there — all the details are here: [Invitation Link]` },
      { title: '2. Formal, on behalf of the family', text: `Dear [Name],
I am delighted to invite you and your family to the wedding of my sister [Sister's Name] with [Groom's Name] on [Day], [Date] at [Venue], [City].
Your presence and blessings would mean a lot to our family.
— [Your Name]` },
      { title: '3. Elder sister (didi), to friends', text: `Shaadi in the family! 🎉 My didi [Sister's Name] is getting married on [Date].
Haldi, mehendi, sangeet — you're invited to everything. Come for the dancing, stay for the food. 😄
[Invitation Link]` },
      { title: '4. Younger sister, emotional', text: `Can't believe I'm writing this — my little sister [Sister's Name] is getting married! 🥹
[Sister's Name] & [Groom's Name] · [Date] · [City]
Please come and bless her.
Invitation: [Invitation Link]` },
      { title: '5. To colleagues', text: `Hi team, my sister [Sister's Name]'s wedding is on [Date] at [Venue], [City], and I'd be really happy to see you there.
Reception from [Time]. Details: [Invitation Link]` },
    ],
  },
  {
    id: 'brother',
    toc: "Brother's wedding",
    title: "Brother's Marriage Invitation Message",
    intro: "For inviting friends and colleagues to your brother's wedding — from a respectful note to a baraat call your friends won't ignore.",
    messages: [
      { title: '1. Simple', text: `My brother is getting married! 🎊
[Brother's Name] weds [Bride's Name]
📅 [Date] · 📍 [Venue], [City]
Come celebrate with us — invitation here: [Invitation Link]` },
      { title: '2. Formal', text: `Dear [Name],
It is my pleasure to invite you and your family to the wedding of my brother [Brother's Name] with [Bride's Name] on [Day], [Date] at [Venue], [City].
We look forward to your presence and blessings.
— [Your Name]` },
      { title: '3. Baraat call, to friends', text: `Bhai ki shaadi hai! 🥁
[Brother's Name] weds [Bride's Name] on [Date].
Baraat leaves at [Time] from [Place] — and you're dancing in it. 😄
All the details: [Invitation Link]` },
      { title: '4. Elder brother (bhaiya)', text: `Our [Bhaiya] [Brother's Name] is finally getting married! 💍
[Brother's Name] & [Bride's Name] · [Date] · [City]
Please come and bless the couple.
[Invitation Link]` },
      { title: '5. To colleagues', text: `Hi all, my brother [Brother's Name] is getting married on [Date]. The reception is at [Venue], [City] from [Time], and I'd love for you to join us.
Invitation: [Invitation Link]` },
    ],
  },
  {
    id: 'friends',
    toc: 'For friends',
    title: 'Wedding Invitation Messages for Friends',
    intro: "Relaxed and personal — what you send to the school group, the college gang or the friend you've known forever.",
    messages: [
      { title: '1. You are family', text: `It's happening — we're getting married! 💍
[Bride] & [Groom] · [Date] · [City]
You're not a guest, you're family. See you there!
[Invitation Link]` },
      { title: '2. For the college group', text: `Calling the whole gang! 🎉
[Name] is getting married on [Date] in [City].
Book your tickets, iron your kurtas — it's going to be one big reunion.
Details: [Invitation Link]` },
      { title: '3. One-to-one, to a best friend', text: `[Friend's Name], you were there for every chapter, so you have to be there for this one. ❤️
I'm getting married on [Date] at [Venue], [City].
Please come early — I'll need you.
[Invitation Link]` },
      { title: "4. Inviting a friend's family", text: `Dear [Friend's Name],
I'm getting married on [Date] at [Venue], [City], and I'd love for you to come with [Partner's Name / your family].
It wouldn't be the same without you.
Invitation: [Invitation Link]` },
      { title: '5. For a friend abroad', text: `I know it's a long way, but I had to ask — I'm getting married on [Date] in [City]! ✈️
Everything you need to plan the trip — venues, dates, where to stay — is in the invitation:
[Invitation Link]
It would mean the world to see you there.` },
      { title: '6. Short', text: `Wedding bells! 🔔
[Bride] weds [Groom] — [Date], [City].
Be there! [Invitation Link]` },
    ],
  },
  {
    id: 'colleagues',
    toc: 'For colleagues',
    title: 'Wedding Invitation Message for Colleagues & Office',
    intro: 'Polite, short and easy to say yes to. If colleagues are invited only to the reception, say so — it saves an awkward question.',
    messages: [
      { title: '1. Office WhatsApp group', text: `Dear all,
I am happy to share that I am getting married on [Date].
I would be delighted if you could join us for the reception on [Date] at [Venue], [City], from [Time] onwards.
Invitation with the map: [Invitation Link]` },
      { title: '2. Email to your team', text: `Subject: Wedding invitation — [Your Name] & [Partner's Name]

Dear team,
I'm getting married on [Date], and I would love to celebrate with you. The reception is on [Date], [Time] onwards, at [Venue], [Address].
The invitation is here: [Invitation Link]
It would mean a lot to see you there.

Warm regards,
[Your Name]` },
      { title: '3. To your manager', text: `Hi [Manager's Name],
I'm getting married on [Date] and would be honoured if you and your family could attend the reception on [Date] at [Venue], [City].
Here is the invitation: [Invitation Link]
Thank you,
[Your Name]` },
      { title: '4. Wedding and reception both', text: `Hello everyone,
I'm getting married! The wedding is on [Date] at [Time] and the reception on [Date] from [Time], both at [Venue], [City].
Please join us for either — or both!
[Invitation Link]` },
      { title: '5. Short', text: `Hi team 👋 I'm getting married on [Date]!
Reception: [Venue], [Time] onwards.
Would love to see you there. [Invitation Link]` },
    ],
  },
  {
    id: 'formal',
    toc: 'Formal card wording',
    title: 'Formal Wedding Invitation Wording in English (Card Matter)',
    intro: 'The classic wording used on printed cards, for elders and community invitations. Replace the bracketed placeholders with your own details and keep the line breaks — they are what make it read like a card.',
    messages: [
      { title: '1. Traditional joint family', text: `With the blessings of the Almighty,
[Father's Name] & [Mother's Name]
along with
[Father's Name] & [Mother's Name]
joyfully request your presence at the wedding of their children

[Bride's Full Name] & [Groom's Full Name]

on [Day], [Date] at [Time]
[Venue Name], [Full Address]

Your blessings and presence will honour this occasion.` },
      { title: '2. Couple-hosted, modern formal', text: `We are delighted to invite you to celebrate our wedding.

[Bride's Name] & [Groom's Name]

[Day], [Date] · [Time]
[Venue Name]
[Full Address]

Your presence would mean the world to us.
RSVP by [Date]: [Phone / WhatsApp Number]` },
      { title: '3. "Request the honour of your presence"', text: `Together with their families
[Bride's Full Name]
and
[Groom's Full Name]
request the honour of your presence
at their wedding

on [Day], the [Date in words]
at [Time]
[Venue Name]
[Address], [City]` },
      { title: '4. Both families inviting', text: `[Bride's Father] & [Bride's Mother]
and
[Groom's Father] & [Groom's Mother]
joyfully invite you to share in the celebration of the marriage of their children

[Bride's Name] & [Groom's Name]

[Day], [Date] · [Time]
[Venue], [City]
Dinner to follow` },
      { title: "5. With the grandparents' blessings", text: `With the blessings of
Late Shri [Grandfather's Name] & Smt. [Grandmother's Name]

[Father's Name] & [Mother's Name]
cordially invite you to the wedding of their son / daughter

[Name]
with
[Name]

on [Date] at [Time]
[Venue], [Address]` },
    ],
  },
  {
    id: 'hindu',
    toc: 'Hindu wedding',
    title: 'Hindu Wedding Invitation Wording (with Ganesh Blessing)',
    intro: 'Hindu invitations traditionally open with a prayer to Lord Ganesha and give the muhurat for each ceremony. These samples follow that order — blessing, family, couple, then the schedule.',
    messages: [
      { title: '1. Ganesh blessing opening', text: `॥ श्री गणेशाय नमः ॥
With the grace of God and the blessings of our elders,
[Father's Name] & Smt. [Mother's Name]
request the honour of your presence at the auspicious wedding of their son / daughter

[Name]
with
[Name]
S/o / D/o [Parents' Names]

Shubh Muhurat: [Date] at [Time]
[Venue Name], [Address]` },
      { title: '2. With the Vakratunda shloka', text: `वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥

With the blessings of Lord Ganesha, we invite you to the wedding of
[Bride] & [Groom]

Haldi: [Date], [Time]
Mehendi: [Date], [Time]
Pheras: [Date], [Muhurat Time]
Reception: [Date], [Time]
[Venue], [City]` },
      { title: '3. Every function, in order', text: `Shubh Vivah 🪔
[Bride] & [Groom]

Tilak / Sagai: [Date] · [Time]
Haldi & Mehendi: [Date] · [Time]
Sangeet: [Date] · [Time]
Baraat: [Date] · [Time]
Pheras: [Date] · [Muhurat]

Venue: [Venue], [City]
With love, [Family Name]` },
      { title: '4. Short, for WhatsApp', text: `॥ श्री गणेशाय नमः ॥
Shubh Vivah 🙏
[Bride] & [Groom]
Muhurat: [Date], [Time] · [Venue], [City]
Kindly join us with your family and bless the couple.` },
      { title: '5. Temple / Arya Samaj wedding', text: `With the blessings of the Almighty, the wedding of
[Bride] & [Groom]
will be solemnised at [Temple / Arya Samaj Mandir], [City]
on [Date] at [Time].

A lunch for family and friends follows at [Venue].
Your presence and blessings are requested.` },
    ],
  },
  {
    id: 'south-indian',
    toc: 'South Indian (Muhurtham)',
    title: 'South Indian Wedding Invitation Wording (Muhurtham)',
    intro: 'South Indian invitations give the muhurtham window and often hold the reception the evening before. "Chi." and "Chi. Sow." are the customary prefixes for the groom and the bride.',
    messages: [
      { title: '1. Muhurtham — formal', text: `With the blessings of Sri [Family Deity],
[Father's Name] & [Mother's Name]
cordially invite you to the

Muhurtham — Wedding Ceremony
of their daughter / son
[Bride's Name] with [Groom's Name]

Muhurtham: [Day], [Date] at [Time]
Reception: [Date] at [Time]
[Kalyana Mandapam / Venue Name]
[Address]

Kindly grace us with your presence and blessings.` },
      { title: '2. Traditional, with Chi. and Chi. Sow.', text: `Sri [Family Deity] Thunai

[Father's Name] & [Mother's Name]
seek your gracious presence with family and friends
at the marriage of their daughter

Chi. Sow. [Bride's Name]
with
Chi. [Groom's Name]
(S/o [Groom's Parents' Names])

Muhurtham: [Day], [Date], between [Time] and [Time]
Reception: [Date], [Time] onwards
[Kalyana Mandapam], [Address], [City]` },
      { title: '3. Kerala — with sadya', text: `With the blessings of the Almighty, we invite you to the wedding of our daughter [Bride] with [Groom] on [Date].
Muhurtham: [Time] – [Time]
[Temple / Auditorium], [City]
Sadya will be served after the ceremony.` },
      { title: '4. Short, for WhatsApp', text: `Muhurtham on [Date] at [Time]! 🪔
[Bride] weds [Groom] at [Venue], [City].
Reception the evening before, from [Time].
Do come with family and bless the couple.
[Invitation Link]` },
    ],
  },
  {
    id: 'nikah',
    toc: 'Nikah (Muslim wedding)',
    title: 'Nikah Invitation Message (Muslim Wedding Wording)',
    intro: "Nikah invitations usually open with Bismillah and invite guests to both the Nikah and the Walima. Write the families' names exactly as they appear on the printed card.",
    messages: [
      { title: '1. Formal', text: `Bismillahir Rahmanir Raheem

With the blessings of Allah,
Mr. [Father's Name] & Mrs. [Mother's Name]
request the pleasure of your company at the Nikah of their daughter / son

[Name]
with
[Name]
S/o / D/o [Parents' Names]

Nikah: [Day], [Date], after [Zuhr / Asr / Isha] prayers
[Masjid / Venue], [City]
Walima: [Date], [Time] at [Venue]` },
      { title: '2. Simple WhatsApp', text: `Assalamu Alaikum 🌙
Insha'Allah, the Nikah of [Bride] & [Groom] will take place on [Date] at [Venue], [City].
Please join us and make dua for the couple.
Invitation: [Invitation Link]` },
      { title: '3. With Bismillah in Arabic', text: `بسم الله الرحمن الرحيم

With the grace of Allah, we humbly invite you and your family to the Nikah of
[Bride's Name] & [Groom's Name]
on [Date] at [Venue], [City].

Your duas are our greatest gift.` },
      { title: '4. Walima invitation', text: `Alhamdulillah, [Bride] & [Groom] are now married.
We invite you to the Walima on [Date] at [Time], at [Venue], [City].
Your presence will be our honour.
— [Family Name]` },
      { title: '5. Mehndi & Nikah together', text: `Insha'Allah, we invite you to celebrate with us:

Mehndi: [Date], [Time]
Nikah: [Date], after [Prayer] prayers
Walima: [Date], [Time]

[Venue], [City]
— [Family Name]` },
    ],
  },
  {
    id: 'christian',
    toc: 'Christian wedding',
    title: 'Christian Wedding Invitation Wording',
    intro: 'For church weddings: the ceremony is "Holy Matrimony" or a "Nuptial Mass", and the reception follows at a second venue. Give both addresses so guests are not left guessing.',
    messages: [
      { title: '1. Couple-hosted', text: `Together with their families
[Bride's Name] & [Groom's Name]
invite you to witness their marriage in Holy Matrimony

on [Day], [Date] at [Time]
at [Church Name], [City]

and to the reception thereafter at [Venue]` },
      { title: '2. Parents hosting', text: `Mr. & Mrs. [Bride's Father's Name]
request the honour of your presence
at the marriage of their daughter
[Bride's Name]
with
[Groom's Name]
son of Mr. & Mrs. [Groom's Father's Name]

Nuptial Mass: [Date], [Time]
[Church Name], [City]
Reception to follow at [Venue]` },
      { title: '3. With a Bible verse', text: `"Two are better than one." — Ecclesiastes 4:9

[Bride] & [Groom]
invite you to celebrate their wedding
on [Date] at [Time]
at [Church Name], [City].

Reception at [Venue] from [Time].` },
      { title: '4. Short, for WhatsApp', text: `We're getting married! 💒
[Bride] & [Groom] · [Date]
[Church Name], [City] at [Time] — reception to follow.
Please join us as we say "I do".
[Invitation Link]` },
      { title: '5. Formal, with the parish', text: `By the grace of God,
[Bride's Parents' Names]
and
[Groom's Parents' Names]
invite you to the wedding of their children

[Bride's Full Name] & [Groom's Full Name]

[Day], [Date] at [Time]
[Church Name], [Parish], [City]
Reception: [Venue], [Time]` },
    ],
  },
  {
    id: 'hindi',
    toc: 'In Hindi',
    title: 'Marriage Invitation Message in Hindi (शादी का निमंत्रण)',
    intro: 'Hindi wording from the traditional card, short messages for WhatsApp, and a Hinglish version for younger guests. "दर्शनाभिलाषी" and "विनीत" are the customary sign-offs for the inviting family.',
    messages: [
      { title: '1. Traditional card wording', text: `॥ श्री गणेशाय नमः ॥
सादर आमंत्रण

हमारे सुपुत्र / सुपुत्री
[नाम]
का शुभ विवाह
[नाम]
के साथ दिनांक [तारीख] को [स्थान] में सम्पन्न होना निश्चित हुआ है।

इस शुभ अवसर पर आप सपरिवार सादर आमंत्रित हैं।
दर्शनाभिलाषी: [परिवार के नाम]` },
      { title: '2. Short WhatsApp message', text: `शुभ विवाह 💐
[दूल्हे का नाम] संग [दुल्हन का नाम]
📅 [तारीख] · 📍 [स्थान]
आप सपरिवार पधारकर वर-वधू को आशीर्वाद दें।` },
      { title: "3. Sister's wedding (बहन की शादी)", text: `मेरी प्यारी बहन [नाम] की शादी [तारीख] को [स्थान] में है।
आप सभी सपरिवार आमंत्रित हैं — आपके आने से हमारी खुशियाँ दोगुनी हो जाएँगी। 🙏
निमंत्रण: [Invitation Link]` },
      { title: "4. Brother's wedding (भाई की शादी)", text: `मेरे भाई [नाम] की शादी [तारीख] को है! 🎉
बारात [समय] बजे [स्थान] से निकलेगी।
आप ज़रूर आइए और खुशियों में शामिल होइए।
निमंत्रण: [Invitation Link]` },
      { title: '5. Reception (प्रीतिभोज)', text: `विवाह के उपलक्ष्य में प्रीतिभोज

दिनांक: [तारीख] · समय: [समय] से
स्थान: [स्थान]

आपकी गरिमामयी उपस्थिति प्रार्थनीय है।
विनीत: [परिवार के नाम]` },
      { title: '6. Hinglish', text: `Humare ghar shaadi hai! 🎊
[Bride] aur [Groom] ki shaadi [Date] ko [Venue], [City] mein hai.
Aap sab parivaar sahit zaroor aaiye aur dulha-dulhan ko aashirwad dijiye.
Invitation: [Invitation Link]` },
    ],
  },
  {
    id: 'reception',
    toc: 'Reception',
    title: 'Wedding Reception Invitation Message',
    intro: 'For a reception on its own, after a court or destination wedding, or hosted by the groom\'s family. Say whether dinner is served — guests plan their evening around it.',
    messages: [
      { title: '1. Parents hosting, evening reception', text: `[Father's Name] & [Mother's Name] request the pleasure of your company
at a reception in honour of the marriage of their son / daughter

[Groom's Name] with [Bride's Name]

on [Day], [Date]
7:00 PM onwards
[Venue Name], [Address]

Kindly RSVP by [Date].` },
      { title: '2. After a court marriage', text: `[Name] and [Name] were married on [Date] in a private ceremony.
We now invite you to join us for a reception to celebrate.

[Reception Date] · [Time]
[Venue Name & Address]

Dinner will be served. Kindly confirm your attendance by [RSVP Date].` },
      { title: '3. Short WhatsApp', text: `You're invited to celebrate with us! 🥂
Reception of [Bride] & [Groom]
[Date] · [Time] onwards · [Venue], [City]
Dinner will be served.
[Invitation Link]` },
      { title: '4. After an intimate or destination wedding', text: `We got married in a small ceremony in [Place] — and now we'd love to celebrate with you! 💛
Reception: [Date], [Time] onwards at [Venue], [City].
See you there! [Invitation Link]` },
      { title: "5. Groom's family welcoming the bride", text: `With joy, we welcome our new daughter-in-law [Bride] into the family.
Please join us for a reception in honour of [Groom] & [Bride]
on [Date], from [Time], at [Venue], [City].
— [Family Name]` },
    ],
  },
  {
    id: 'functions',
    toc: 'Haldi, mehendi & sangeet',
    title: 'Haldi, Mehendi & Sangeet Invitation Messages',
    intro: 'Each function gets its own short message — with the dress colour, because every guest asks. Send them a day or two before each one, or put them all in one invitation link.',
    messages: [
      { title: '1. Haldi', text: `Haldi hai! 💛
Join us for [Bride / Groom]'s haldi on [Date] at [Time], [Venue].
Dress code: yellow. Come ready to get messy! 😄` },
      { title: '2. Mehendi', text: `Mehendi night! 🌿
You're invited to [Bride]'s mehendi on [Date] at [Time], [Venue].
Music, chai and mehendi for everyone — wear green if you can! 💚` },
      { title: '3. Sangeet', text: `Get your dancing shoes ready! 💃🕺
Sangeet night for [Bride] & [Groom]
[Date] · [Time] onwards · [Venue]
Dress code: [Theme]. Family performances guaranteed!
[Invitation Link]` },
      { title: '4. Tilak ceremony', text: `With the blessings of our elders, we invite you to the Tilak ceremony of [Groom]
on [Date] at [Time], [Venue], [City].
Your presence will make the occasion complete.
— [Family Name]` },
      { title: '5. Cocktail night', text: `Before the pheras, the party! 🥂
Cocktail night for [Bride] & [Groom]
[Date] · [Time] onwards · [Venue]
Dress code: [Black tie / Indo-western]` },
      { title: '6. Every function in one message', text: `Our wedding week 🎊
[Bride] & [Groom]

Haldi — [Date], [Time]
Mehendi — [Date], [Time]
Sangeet — [Date], [Time]
Wedding — [Date], [Time]
Reception — [Date], [Time]

Venue for all: [Venue], [City]
Every function, map and dress code: [Invitation Link]` },
    ],
  },
  {
    id: 'situations',
    toc: 'Destination & intimate weddings',
    title: 'Wedding Invitation Wording for Different Situations',
    intro: 'Not every wedding follows the standard format. Wording for destination and intimate weddings, a changed date, and guests joining from afar.',
    messages: [
      { title: '1. Intimate ceremony', text: `[Name] and [Name] joyfully invite you to celebrate their wedding.
This is an intimate ceremony, shared with close family and a few dear friends.
[Date] · [Time] · [Venue]
Your warm wishes and presence will make this moment complete.` },
      { title: '2. Destination wedding, with a travel note', text: `We are getting married — and it is going to be a celebration to remember.

[Bride's Name] & [Groom's Name]
[Date] at [Destination Hotel / Resort]
[City, State]

Travel and stay details are in our invitation. Please RSVP by [Date] so we can plan your arrangements.
Full details: [Invitation Link]` },
      { title: '3. Small, family-only wedding', text: `We are keeping our wedding small — just the people who matter most, and that includes you.
[Bride] & [Groom]
[Date] · [Time] · [Venue], [City]
Please join us.` },
      { title: '4. New date', text: `An update on our wedding: the ceremony of [Bride] & [Groom] will now take place on [New Date] at [Venue], [City].
We hope you can still join us — the invitation has the new details: [Invitation Link]
Thank you for understanding.` },
      { title: '5. For guests watching online', text: `Can't travel? Join us online!
The wedding of [Bride] & [Groom] will be streamed live on [Date] at [Time] IST:
[Live Stream Link]
Your blessings, from wherever you are, mean the world to us.` },
    ],
  },
  {
    id: 'reminders',
    toc: 'Reminders & thank-yous',
    title: 'Wedding Reminder Messages',
    intro: 'A reminder a week before and another the day before save a dozen phone calls. Re-send the same invitation link — the timings and the map are already in it.',
    messages: [
      { title: '1. One week before', text: `Just one week to go! 🎊
[Bride] & [Groom]'s wedding is on [Date] at [Venue], [City].
The invitation has all the timings and the map: [Invitation Link]
See you there!` },
      { title: '2. The day before', text: `See you tomorrow! 💐
Wedding of [Bride] & [Groom] — [Time] at [Venue].
Directions: [Map Link]
Parking: [Location]` },
      { title: '3. RSVP reminder', text: `Hi [Name], we hope you can make it to [Bride] & [Groom]'s wedding on [Date]!
Could you confirm by [RSVP Date] so we can plan the arrangements? Just reply here. 🙏` },
      { title: '4. Thank you, after the wedding', text: `Thank you for being part of our wedding! 💛
Your blessings, your dancing and your presence made the day unforgettable.
With love,
[Bride] & [Groom]` },
    ],
  },
  {
    id: 'save-the-date',
    toc: 'Save the date',
    title: 'Save the Date Messages for a Wedding',
    intro: 'Sent months ahead, before the invitation itself — just the names, the date and the city, so guests can plan leave and travel.',
    messages: [
      { title: '1. Classic', text: `Save the date! 💍
[Bride] & [Groom] are getting married on [Date] in [City].
Formal invitation to follow.` },
      { title: '2. Short', text: `Mark your calendar 📅
[Date] — [Bride] & [Groom]'s wedding, [City].
Invitation coming soon!` },
      { title: '3. Destination wedding', text: `Pack your bags for [Date]! ✈️
[Bride] & [Groom] are getting married in [Destination].
Save the date — travel details will follow with the invitation.` },
      { title: '4. Formal', text: `Please save the date
for the wedding of
[Bride's Name] & [Groom's Name]
[Date]
[City]
Invitation to follow` },
    ],
  },
]
