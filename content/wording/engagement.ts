import type { WordingSectionData } from '@/components/wording/WordingSection'

/**
 * Engagement invitation messages, in page order. Section ids are the jump-link
 * anchors on /engagement-invitation-wording — keep them stable (the first ten
 * are the ones the page has always had).
 */
export const ENGAGEMENT_SECTIONS: WordingSectionData[] = [
  {
    id: 'simple',
    toc: 'Simple & short',
    title: 'Simple & Short Engagement Invitation Messages for WhatsApp',
    intro: 'Short, ready-to-send engagement messages for WhatsApp groups — clear date, time and venue, warm tone. Copy, add your details and share.',
    messages: [
      { title: '1. Simplest one-liner', text: `We're engaged! 💍 Join us to celebrate [Name] & [Name]'s engagement.
📅 [Date] · 🕖 [Time] · 📍 [Venue, City]
Your presence and blessings mean the world to us.` },
      { title: '2. Simple & warm', text: `With joy in our hearts, we invite you to the engagement of
[Bride's Name] & [Groom's Name]. 💍

Date: [Date] · Time: [Time]
Venue: [Venue & Address]

Come bless the couple as they begin their journey together.` },
      { title: '3. Short WhatsApp group message', text: `[Name] & [Name] are getting engaged! 🎉
[Date] · [Time] · [Venue]
Full details 👉 [Digital Invite Link]` },
      { title: '4. Casual & modern', text: `He asked, she said yes! 💍 (or she asked — either way, it's happening!)

Join us for [Name] & [Name]'s ring ceremony
[Date] at [Time], [Venue].

Come celebrate love, laughter and lots of food!` },
      { title: '5. With RSVP', text: `You're invited to the engagement of [Name] & [Name]! 💍

📅 [Date] · 🕖 [Time]
📍 [Venue, Address]

Kindly confirm your presence: [Phone / WhatsApp]` },
      { title: '6. Bilingual simple (Hindi + English)', text: `[Name] एवं [Name] की सगाई की रस्म पर आप सादर आमंत्रित हैं! 💍
दिनांक: [Date] · समय: [Time] · स्थान: [Venue]

Join us to celebrate [Name] & [Name]'s engagement!` },
    ],
  },
  {
    id: 'whatsapp',
    toc: 'For WhatsApp',
    title: 'Engagement Invitation Message for WhatsApp (Indian Families)',
    intro: 'Most engagement invitations in India travel on WhatsApp — to the family group first, then to friends. These are written to be read on a phone: names, date and venue first, then the warmth.',
    messages: [
      { title: '1. For the family WhatsApp group', text: `Namaste, everyone! 🙏

With the blessings of our elders, we are happy to share that [Name]'s engagement with [Partner's Name] has been fixed.

💍 Engagement ceremony: [Date] at [Time]
📍 [Venue, City]

Please come with your family and bless the couple.
— [Father's Name] & [Mother's Name]` },
      { title: "2. From the groom's family", text: `With great joy, the [Family Name] family invites you to the engagement of our son

[Groom's Name] with [Bride's Name]
(daughter of [Bride's Parents' Names])

📅 [Day, Date] · 🕖 [Time]
📍 [Venue, Address]

Your blessings will make the day complete. 🙏` },
      { title: "3. From the bride's family", text: `Our daughter [Bride's Name] is getting engaged! 💍

We warmly invite you to the ring ceremony of [Bride's Name] and [Groom's Name] on [Date] at [Time], at [Venue].

Lunch will be served. Do come and bless them.
— [Bride's Parents' Names]` },
      { title: '4. For friends and colleagues', text: `Hi all! 😊 [Name] and [Partner's Name] are getting engaged on [Date].
We'd love to see you at [Venue] from [Time].
Dinner and dancing after the rings — please come!
Details & map 👉 [Digital Invite Link]` },
      { title: '5. For relatives abroad', text: `We know you can't fly down for [Name]'s engagement on [Date], but we didn't want you to miss it.

The invitation, venue and schedule are all on this link — open it whenever it's morning where you are, and leave your blessings for the couple on the page. 🙏
[Digital Invite Link]` },
      { title: '6. In Hindi — for the family group', text: `सादर निमंत्रण 🙏

ईश्वर की कृपा से हमारे [पुत्र / पुत्री] [Name] की सगाई [Partner's Name] के साथ तय हुई है।

सगाई समारोह: [Date] को [Time] बजे
स्थान: [Venue, City]

आप सपरिवार पधारकर नवयुगल को अपना आशीर्वाद दें।
— [Parents' Names]` },
      { title: '7. Reminder, the day before', text: `Just a reminder 😊 [Name] & [Partner's Name]'s engagement is tomorrow, [Date], at [Time].
📍 [Venue] — map in the link: [Digital Invite Link]
See you there!` },
    ],
  },
  {
    id: 'ring-ceremony',
    toc: 'Ring ceremony',
    title: 'Ring Ceremony / Mangni Invitation Message (Formal)',
    intro: 'Formal wording for the main invitation — shared with family, extended family and every guest at the ceremony.',
    messages: [
      { title: '1. North Indian Mangni — both families hosting', text: `॥ श्री गणेशाय नमः ॥
With immense joy and God's blessings,
[Bride's Father's Name] & [Mother's Name]
along with
[Groom's Father's Name] & [Mother's Name]
cordially invite you to the

Mangni / Ring Ceremony
of their children

[Bride's Name] & [Groom's Name]

[Day], [Date] · [Time]
[Venue Name], [Address]
Lunch / Dinner will be served. Kindly grace us with your presence.` },
      { title: '2. South Indian Nishchayathartham (Tamil / Telugu families)', text: `With the blessings of Sri [Family Deity],
[Bride's Father's Name] & [Mother's Name]
joyfully announce the

Nishchayathartham (Engagement Ceremony)
of their daughter
[Bride's Name]
with
[Groom's Name]
Son of [Groom's Father's Name] & [Mother's Name]

Date: [Date] · Time: [Time]
[Kalyana Mandapam / Venue], [Address]
Kindly bless the couple with your presence.` },
      { title: '3. Modern, couple-hosted ring ceremony', text: `We're officially saying yes to forever.

[Name] & [Name]
invite you to our Ring Ceremony

[Date] · [Time]
[Venue], [Address]

Followed by dinner. We would love to celebrate with you.
RSVP: [WhatsApp Number]` },
      { title: '4. Religious blessing opening (formal)', text: `By the grace of God and with the blessings of our elders,
we joyfully announce the engagement ceremony of

[Bride's Name] & [Groom's Name]

[Day], [Date] at [Time]
[Venue Name], [City]

Your blessings will make this occasion truly special.` },
    ],
  },
  {
    id: 'ring-ceremony-whatsapp',
    toc: 'Ring ceremony (short)',
    title: 'Short Ring Ceremony Invitation Messages',
    intro: 'When the ring exchange is the main event of the day, lead with it. Short enough for WhatsApp, clear enough that nobody arrives after the rings.',
    messages: [
      { title: '1. Simple ring ceremony invite', text: `You're invited to the ring ceremony of [Name] & [Partner's Name] 💍
📅 [Date] · 🕖 [Time]
📍 [Venue, City]
Please join us and bless the couple!` },
      { title: '2. With the ring exchange time', text: `Ring ceremony of [Name] & [Partner's Name] 💍

Guests arrive: [Time]
Ring exchange: [Time] — please be seated by then!
Dinner: [Time] onwards

📍 [Venue, Address]` },
      { title: '3. Formal, from the parents', text: `[Father's Name] & [Mother's Name]
request the pleasure of your company
at the Ring Ceremony of their [son / daughter]

[Name]
with
[Partner's Name]

[Day], [Date] at [Time]
[Venue Name], [City]` },
      { title: '4. Hosted by the couple', text: `We're exchanging rings! 💍
[Name] & [Partner's Name] would love you there on [Date], [Time] at [Venue].
Come for the rings, stay for the food and the dancing. 🎶
RSVP: [Phone]` },
    ],
  },
  {
    id: 'roka',
    toc: 'Roka',
    title: 'Roka Ceremony Invitation Wording',
    intro: 'Roka is an intimate, family-only ceremony that formally marks the beginning of the alliance — usually before the engagement, with only the immediate families. Keep the invitation short and warm, and send it to that close circle only.',
    messages: [
      { title: '1. Short Roka WhatsApp message (close family only)', text: `With God's blessings, we are happy to share that [Name]'s Roka is on [Date] at [Time].
Venue: [Home / Hall Name, Address]
We request your presence and blessings on this auspicious occasion.` },
      { title: '2. Formal Roka with family names', text: `[Father's Name] & [Mother's Name]
request your presence at the Roka ceremony of their son / daughter

[Name]

[Day], [Date] at [Time]
[Venue / Home Address]
A small family lunch will follow. Your blessings mean everything.` },
      { title: '3. Simple English Roka', text: `It's official! We're celebrating [Name]'s Roka with a small family gathering.
[Date] · [Time] · [Venue]
Please join us for this special moment. See you there!` },
      { title: '4. Hindi / English bilingual Roka', text: `ईश्वर की कृपा से हमारे पुत्र / पुत्री [Name] की रोका की रस्म
[दिन], [तारीख] को [समय] बजे
[स्थान का नाम एवं पता] पर होगी।
We warmly request your presence and blessings on this happy occasion.` },
    ],
  },
  {
    id: 'sagai',
    toc: 'Sagai',
    title: 'Sagai Invitation Message',
    intro: 'Sagai is the name used across Rajasthan, Gujarat and much of North India for the formal engagement ceremony. These samples keep the warmth and the order of a traditional Sagai invitation.',
    messages: [
      { title: '1. Traditional joint-family Sagai', text: `॥ श्री गणेशाय नमः ॥
[Father's Name] परिवार एवं [Other Family's Name] परिवार
सहर्ष सूचित करते हैं कि
[Name] एवं [Name]
की सगाई की रस्म
[दिन], [तारीख] को [समय] बजे
[स्थान], [पता]
पर आयोजित होगी।
आपकी उपस्थिति एवं आशीर्वाद की प्रार्थना है।` },
      { title: '2. Simple WhatsApp Sagai message', text: `With great joy, we announce the Sagai of [Bride's Name] and [Groom's Name].
[Date] · [Time] · [Venue, City]
We humbly request your presence and blessings.
Full invitation: [Link]` },
      { title: '3. Formal Sagai with the ceremony schedule', text: `[Father's Name] & [Mother's Name] cordially invite you to the
Sagai Ceremony of [Bride's Name] & [Groom's Name]
[Day], [Date] at [Venue Name], [City]

Ceremony schedule:
11:00 AM — Tilak / Sagan ritual
12:00 PM — Ring exchange
1:00 PM — Family lunch

Kindly confirm your attendance at [WhatsApp Number].` },
    ],
  },
  {
    id: 'daughter',
    toc: 'For daughter',
    title: 'Engagement Invitation Message for Daughter',
    intro: "For parents announcing their daughter's engagement — warm, proud and ready to share with family and friends.",
    messages: [
      { title: '1. Proud parents — warm', text: `With hearts full of joy, we invite you to the engagement of our beloved daughter

[Daughter's Name] with [Groom's Name]

Date: [Date] · Time: [Time]
Venue: [Venue & Address]

Your blessings will make this milestone truly special.
— [Parents' Names]` },
      { title: '2. Simple in English', text: `Our daughter [Name] is getting engaged to [Name]! 💍
Join us on [Date] at [Time], [Venue].
Come shower the couple with your love and blessings.` },
      { title: '3. Traditional with family names', text: `[Father's Name] & [Mother's Name]
joyfully invite you to the engagement ceremony of their daughter

[Daughter's Full Name]
with [Groom's Name], son of [Groom's Parents' Names]

[Day, Date] · [Time] · [Venue, City]
Kindly grace the occasion with your blessings.` },
      { title: '4. Emotional', text: `Our little girl is getting engaged! 💛
[Daughter's Name] & [Groom's Name] · [Date] · [Venue], [City]
We would love to have you with us as we bless her.
[Invitation Link]` },
      { title: '5. Bilingual (Hindi + English)', text: `हमारी बिटिया [Name] की सगाई [Groom's Name] के साथ तय हुई है! 💍
[Date] · [Time] · [Venue]
We warmly invite you and your family to bless the couple.
— [Parents' Names]` },
    ],
  },
  {
    id: 'son',
    toc: 'For son',
    title: 'Engagement Invitation Message for Son',
    intro: "For parents announcing their son's engagement — dignified and warm wording for every family group.",
    messages: [
      { title: '1. Proud parents — warm', text: `With great happiness, we invite you to the engagement of our beloved son

[Son's Name] with [Bride's Name]

Date: [Date] · Time: [Time]
Venue: [Venue & Address]

Please join us to bless the couple.
— [Parents' Names]` },
      { title: '2. Simple in English', text: `Our son [Name] is getting engaged to [Name]! 💍
Join us on [Date] at [Time], [Venue].
Your presence will make the day complete.` },
      { title: '3. Traditional with family names', text: `[Father's Name] & [Mother's Name]
cordially invite you to the engagement ceremony of their son

[Son's Full Name]
with [Bride's Name], daughter of [Bride's Parents' Names]

[Day, Date] · [Time] · [Venue, City]
Your blessings are eagerly awaited.` },
      { title: '4. Short, for the family group', text: `Dear family, our son [Name]'s engagement with [Bride's Name] is on [Date] at [Venue], [City]! 🎊
Please join us with your family and bless the couple.
[Invitation Link]` },
      { title: "5. To the father's friends & colleagues", text: `Dear [Name],
It gives me great pleasure to invite you and your family to the engagement of my son [Son's Name] with [Bride's Name] on [Date] at [Venue], [City].
We would be honoured by your presence.
— [Your Name]` },
    ],
  },
  {
    id: 'my-engagement',
    toc: 'Your own engagement',
    title: 'My Engagement Invitation Message (From the Bride or Groom)',
    intro: 'When it is your own engagement, the invitation can sound like you — written in the first person, for friends, relatives and everyone in between.',
    messages: [
      { title: '1. Simple', text: `I'm getting engaged! 💍
[Your Name] & [Partner's Name] · [Date] · [Venue], [City]
I'd love for you to be there when we exchange rings.
[Invitation Link]` },
      { title: '2. To the friends group', text: `Guys, it's official — I'm getting engaged! 🥳
[Date] at [Venue], [City].
Come for the rings, stay for the party!
Details: [Invitation Link]` },
      { title: '3. Heartfelt, one-to-one', text: `Dear [Name],
I'm getting engaged to [Partner's Name] on [Date], and you were one of the first people I wanted to tell. ❤️
It would mean a lot to have you there — [Venue], [Time].` },
      { title: '4. To relatives, respectfully', text: `Namaste [Mama ji / Aunty ji],
With the blessings of the family, my engagement with [Partner's Name] is on [Date] at [Venue], [City].
I would be grateful for your blessings in person.` },
      { title: '5. Short', text: `We're engaged! 💍
Ring ceremony on [Date], [City].
Save the date!` },
    ],
  },
  {
    id: 'sister',
    toc: "Sister's engagement",
    title: "Sister's Engagement Invitation Message",
    intro: 'For brothers and sisters inviting their own friends and colleagues — proud, warm and easy to forward.',
    messages: [
      { title: '1. Simple', text: `My sister is getting engaged! 💍
[Sister's Name] & [Groom's Name]
📅 [Date] · 📍 [Venue], [City]
You have to be there! [Invitation Link]` },
      { title: '2. Formal, on behalf of the family', text: `Dear [Name],
I am delighted to invite you and your family to the engagement of my sister [Sister's Name] with [Groom's Name] on [Day], [Date] at [Venue], [City].
Your presence would mean a lot to our family.
— [Your Name]` },
      { title: '3. Elder sister (didi), to friends', text: `Big news in the family! 🎉 My didi [Sister's Name] is getting engaged on [Date].
Ring ceremony at [Venue], [Time] onwards — come celebrate with us!
[Invitation Link]` },
      { title: '4. Younger sister', text: `My little sister is getting engaged and I'm not ready! 🥹
[Sister's Name] & [Groom's Name] · [Date] · [City]
Please come and bless her.` },
      { title: '5. To colleagues', text: `Hi team, my sister [Sister's Name]'s engagement is on [Date] at [Venue], [City].
I'd be really happy to see you there — [Time] onwards.` },
    ],
  },
  {
    id: 'brother',
    toc: "Brother's engagement",
    title: "Brother's Engagement Invitation Message",
    intro: "For inviting your friends and colleagues to your brother's engagement — from a respectful note to a message your friends won't ignore.",
    messages: [
      { title: '1. Simple', text: `My brother is getting engaged! 🎊
[Brother's Name] & [Bride's Name]
📅 [Date] · 📍 [Venue], [City]
Come celebrate with us! [Invitation Link]` },
      { title: '2. Formal', text: `Dear [Name],
It is my pleasure to invite you and your family to the engagement of my brother [Brother's Name] with [Bride's Name] on [Day], [Date] at [Venue], [City].
We look forward to your presence and blessings.
— [Your Name]` },
      { title: '3. Bhai ki sagai, to friends', text: `Bhai ki sagai hai! 💍
[Brother's Name] & [Bride's Name] · [Date] · [Venue]
Dhol, dinner and dancing — you have to come! 🥁
[Invitation Link]` },
      { title: '4. Elder brother (bhaiya)', text: `Our [Bhaiya] [Brother's Name] is finally getting engaged! 💍
[Date] · [Venue], [City]
Please come and bless the couple.` },
      { title: '5. To colleagues', text: `Hi all, my brother [Brother's Name] is getting engaged on [Date].
The ring ceremony is at [Venue], [City] from [Time], and I'd love for you to join us.` },
    ],
  },
  {
    id: 'friends',
    toc: 'For friends',
    title: 'Engagement Invitation Messages for Friends',
    intro: "Relaxed and personal — for the school group, the college gang and the friend who has heard every chapter of the story.",
    messages: [
      { title: '1. You are family', text: `It's official — we're getting engaged! 💍
[Name] & [Partner's Name] · [Date] · [City]
You're not a guest, you're family. See you there!
[Invitation Link]` },
      { title: '2. For the college group', text: `Calling the whole gang! 🎉
[Name] is getting engaged on [Date] in [City].
Ring ceremony at [Time], party after. Be there!` },
      { title: '3. To a best friend', text: `[Friend's Name], you've heard every chapter of this story — now come and see the best one. ❤️
Our engagement is on [Date] at [Venue], [City].
Please come early!` },
      { title: "4. Inviting a friend's family", text: `Dear [Friend's Name],
We're getting engaged on [Date] at [Venue], [City], and we'd love for you to come with your family.
It wouldn't be the same without you.` },
      { title: '5. Short', text: `Ring ceremony alert! 💍
[Name] & [Partner's Name] — [Date], [Venue].
Don't miss it!` },
    ],
  },
  {
    id: 'colleagues',
    toc: 'For colleagues',
    title: 'Engagement Invitation Message for Colleagues & Office',
    intro: 'Polite, short and easy to say yes to — with the time and the venue up front.',
    messages: [
      { title: '1. Office WhatsApp group', text: `Dear all,
I am happy to share that I am getting engaged on [Date].
I would be delighted if you could join us at [Venue], [City], from [Time] onwards.
Invitation with the map: [Invitation Link]` },
      { title: '2. Email to your team', text: `Subject: Engagement invitation — [Your Name] & [Partner's Name]

Dear team,
I'm getting engaged on [Date], and I would love to celebrate with you. The ring ceremony is at [Venue], [Address], from [Time].
The invitation is here: [Invitation Link]

Warm regards,
[Your Name]` },
      { title: '3. To your manager', text: `Hi [Manager's Name],
I'm getting engaged on [Date] and would be honoured if you and your family could join us at [Venue], [City], at [Time].
Here is the invitation: [Invitation Link]
Thank you,
[Your Name]` },
      { title: '4. Short', text: `Hi team 👋 I'm getting engaged on [Date]!
Ring ceremony at [Venue], [Time] onwards.
Would love to see you there.` },
    ],
  },
  {
    id: 'we-cordially-invite',
    toc: '“We cordially invite”',
    title: '“We Cordially Invite You” — Formal Engagement Wording',
    intro: 'Classic formal phrasing for the engagement ceremony invitation — for printed cards and formal digital invitations alike.',
    messages: [
      { title: '1. Classic formal', text: `We cordially invite you to the engagement ceremony of

[Bride's Name] & [Groom's Name]

[Day], the [Date] · at [Time]
[Venue Name], [Address], [City]

Your gracious presence is requested. RSVP: [Phone]` },
      { title: '2. Formal — hosted by both families', text: `[Bride's Family Name] & [Groom's Family Name]
request the honour of your presence
at the engagement ceremony of

[Bride's Name] & [Groom's Name]

[Day, Date] · [Time] onwards
[Venue Name, Full Address]

Dinner to follow. Kindly confirm your attendance.` },
      { title: '3. Formal with a religious blessing', text: `By the grace of God and the blessings of our elders,
we cordially invite you to the engagement ceremony of

[Bride's Name] & [Groom's Name]

[Day, Date] · [Time]
[Venue, City]

Your blessings will make this occasion truly memorable.` },
    ],
  },
  {
    id: 'hindi',
    toc: 'In Hindi',
    title: 'Engagement Invitation Message in Hindi (सगाई का निमंत्रण)',
    intro: 'Hindi wording for the family group and for elders — a short WhatsApp message, the traditional card text, and versions for a daughter, son, brother or sister.',
    messages: [
      { title: '1. Short WhatsApp message', text: `सगाई का निमंत्रण 💍
[लड़के का नाम] संग [लड़की का नाम]
📅 [तारीख] · ⏰ [समय] · 📍 [स्थान]
आप सपरिवार पधारकर नवयुगल को आशीर्वाद दें।` },
      { title: '2. Traditional card wording', text: `॥ श्री गणेशाय नमः ॥
सादर आमंत्रण

हमारे सुपुत्र / सुपुत्री [नाम]
की सगाई (मंगनी) की रस्म
[नाम] के साथ
दिनांक [तारीख] को [समय] बजे [स्थान] पर सम्पन्न होगी।

इस शुभ अवसर पर आप सपरिवार सादर आमंत्रित हैं।
दर्शनाभिलाषी: [परिवार के नाम]` },
      { title: "3. Daughter's engagement (बेटी की सगाई)", text: `हमारी लाडली बिटिया [नाम] की सगाई [नाम] के साथ [तारीख] को है। 💐
आप सभी सपरिवार आमंत्रित हैं — आपका आशीर्वाद हमारे लिए सबसे अनमोल है।
— [माता-पिता के नाम]` },
      { title: "4. Son's engagement (बेटे की सगाई)", text: `हमारे बेटे [नाम] की सगाई [नाम] के साथ तय हुई है! 🎉
सगाई समारोह: [तारीख], [समय] बजे
स्थान: [स्थान]
आप ज़रूर पधारें।` },
      { title: "5. Brother's or sister's engagement", text: `मेरे भाई / मेरी बहन [नाम] की सगाई [तारीख] को [स्थान] में है! 💍
आप ज़रूर आइए और खुशियों में शामिल होइए।
निमंत्रण: [Invitation Link]` },
      { title: '6. Hinglish', text: `Humare ghar sagai hai! 💍
[Name] aur [Partner's Name] ki engagement [Date] ko [Venue] mein hai.
Aap sab parivaar sahit zaroor aaiye aur unhe aashirwad dijiye. 🙏` },
    ],
  },
  {
    id: 'mangni-nisbat',
    toc: 'Muslim Mangni / Nisbat',
    title: 'Muslim Engagement Invitation Message (Mangni / Nisbat)',
    intro: "Wording for a Mangni or Nisbat in Muslim families — opening with Bismillah, with the families' names as they appear on the printed card.",
    messages: [
      { title: '1. Formal', text: `Bismillahir Rahmanir Raheem

With the blessings of Allah,
[Father's Name] & [Mother's Name]
request the pleasure of your company at the Mangni (Nisbat) of their [son / daughter]

[Name]
with
[Name]
S/o / D/o [Parents' Names]

[Day], [Date] · [Time]
[Venue], [City]` },
      { title: '2. Simple WhatsApp', text: `Assalamu Alaikum 🌙
Alhamdulillah, the Mangni of [Name] & [Name] will take place on [Date] at [Venue], [City], Insha'Allah.
Please join us and make dua for the couple.` },
      { title: '3. Short', text: `[Name] & [Name]'s Mangni 💍
[Date] · [Venue]
Please join us with your family.` },
      { title: '4. With a dinner', text: `Alhamdulillah, [Name]'s nisbat has been fixed with [Name].
We invite you to a dinner to celebrate on [Date] at [Time], [Venue], [City].
— [Family Name]` },
    ],
  },
  {
    id: 'christian',
    toc: 'Christian engagement',
    title: 'Christian Engagement Invitation Wording',
    intro: 'For a church betrothal or an engagement party — with both venues, if the celebration moves after the blessing.',
    messages: [
      { title: '1. Couple-hosted', text: `Together with their families,
[Name] & [Name]
invite you to celebrate their engagement
on [Date] at [Time]
at [Venue], [City].` },
      { title: '2. Betrothal at church', text: `With joy and thanksgiving,
[Bride's Parents' Names] and [Groom's Parents' Names]
invite you to the betrothal of
[Name] & [Name]
at [Church Name], [City], on [Date] at [Time],
followed by a reception at [Venue].` },
      { title: '3. With a Bible verse', text: `"Love is patient, love is kind." — 1 Corinthians 13:4

[Name] & [Name] are engaged!
Please join us to celebrate on [Date] at [Venue], [City].` },
      { title: '4. Engagement party', text: `We're engaged! 💍
[Name] & [Name] · Engagement party on [Date] at [Venue].
Come celebrate with us!` },
    ],
  },
  {
    id: 'modern',
    toc: 'Modern & unique',
    title: 'Modern & Unique Engagement Invitation Wording',
    intro: 'For couples who want something a little different — playful, heartfelt and unmistakably yours.',
    messages: [
      { title: '1. Playful & unique', text: `Plot twist: we're getting engaged! 💍

After [X] years of [inside joke], [Name] & [Name] are making it official.

📅 [Date] · 🕖 [Time] · 📍 [Venue]

Come for the rings, stay for the food. RSVP: [Number]` },
      { title: '2. Heartfelt & modern', text: `Two families, one beautiful beginning.

[Name] & [Name] are getting engaged, and we'd love you there
as we say "yes" to forever.

[Date] · [Time] · [Venue, City]` },
      { title: '3. Save-the-date style', text: `She said yes! 💍 (Finally, some good news to share.)

Save the date for [Name] & [Name]'s ring ceremony
[Date] · [Venue, City]

Formal invite & details to follow 👉 [Digital Invite Link]` },
      { title: '4. Elegant & minimal', text: `[Name] & [Name]
are engaged.

Please join us to celebrate.
[Date] · [Time]
[Venue, City]` },
    ],
  },
  {
    id: 'reminders',
    toc: 'Reminders & thank-yous',
    title: 'Engagement Reminder & Thank-You Messages',
    intro: 'A reminder a week before and a thank-you after the ceremony — re-send the same invitation link, the timings and the map are already in it.',
    messages: [
      { title: '1. A week before', text: `Just one week to go! 💍
[Name] & [Partner's Name]'s engagement is on [Date] at [Venue].
All the details: [Invitation Link]` },
      { title: '2. On the morning', text: `Today's the day! 💐
Ring ceremony at [Time], [Venue].
Directions: [Map Link]` },
      { title: '3. RSVP reminder', text: `Hi [Name], we hope you can make it to [Name] & [Partner's Name]'s engagement on [Date]!
Could you confirm by [RSVP Date] so we can plan the arrangements? 🙏` },
      { title: '4. Thank you, after the engagement', text: `Thank you for being part of our engagement! 💛
Your blessings and your presence made the day so special.
— [Name] & [Partner's Name]` },
    ],
  },
]
