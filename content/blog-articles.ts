type ContentSection = { heading: string; body: string }
type FaqItem = { q: string; a: string }

type ContentBlock = {
  intro: string
  sections: ContentSection[]
  checklist: string[]
  faq: FaqItem[]
  links: Array<{ label: string; href: string }>
}

export const blogArticles: Record<string, ContentBlock> = {
  'indian-wedding-invitation-wording-for-whatsapp': {
    intro: `The WhatsApp message you send with a wedding invitation matters as much as the invitation itself. Most guests read the forwarding message before they click the link — and for distant relatives or older family members, the message may be all they read carefully. Getting the wording right means fewer follow-up calls, fewer confused aunties asking about the venue, and a first impression that feels as warm as the event itself.`,
    sections: [
      {
        heading: 'Formal wording samples for wedding WhatsApp messages',
        body: `Use these when sending to elders, the groom's family, or formal contacts.

**Sample 1 — Traditional, joint-family style:**
"With the blessings of [Grandfather's Name] and [Grandmother's Name], we joyfully invite you to the wedding of our beloved [Bride's Name] and [Groom's Name]. The wedding ceremony will take place on [Date] at [Time] at [Venue Name], [City]. Kindly grace us with your presence and blessings. — [Host Family Names]"

**Sample 2 — Religious, with invocation:**
"Shubh Vivah | By the grace of God, [Father's Name] & [Mother's Name] joyfully invite you to the wedding of their daughter [Bride's Name] with [Groom's Name], son of [Groom's Father's Name] & [Groom's Mother's Name]. [Date] | [Time] | [Venue]. We seek your blessings and presence. 🙏"

**Sample 3 — Muslim families:**
"In the name of Allah, the Most Gracious, the Most Merciful. [Father's Name] and [Mother's Name] cordially invite you to the Nikah ceremony of their beloved daughter [Bride's Name] and [Groom's Name]. [Date] | [Time] | [Venue]. Your duas and presence will be our honour."`,
      },
      {
        heading: 'Semi-formal and couple-led wording samples',
        body: `Use these when the couple is co-hosting or the event is more relaxed.

**Sample 4 — Couple-written, friendly tone:**
"Hey! [Bride's Name] & [Groom's Name] here 🎉 We're getting married! We'd love for you to be there as we tie the knot. [Date] | [Time] | [Venue Name], [City]. Click the link below for full details, schedule, and directions — see you there! 💛"

**Sample 5 — Sikh families:**
"Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh. With Guru's grace and the blessings of our families, we humbly invite you to the Anand Karaj of [Bride's Name] and [Groom's Name] on [Date] at [Time] at [Gurudwara Name / Venue]. Your presence will be our blessing."

**Sample 6 — Christian families:**
"To the glory of God, [Father's Name] and [Mother's Name] invite you to witness the Holy Matrimony of their daughter [Bride's Name] and [Groom's Name], son of [Groom's Parents' Names]. [Date] | [Time] | [Church / Venue Name]. Reception to follow at [Reception Venue]."

**Sample 7 — Short, practical message for groups:**
"Sharing the wedding invitation for [Bride's Name] & [Groom's Name]'s wedding on [Date] at [Venue], [City]. Tap the link for complete details, schedule, and venue map 📍"`,
      },
      {
        heading: 'What to include in the WhatsApp message (and what to leave out)',
        body: `The WhatsApp message should contain: the couple's names, the event (wedding/Nikah/Anand Karaj), the date, the venue city, and the link. That is enough. The invitation page itself handles venue address, schedule, map, and dress code. Do not try to put the full wedding programme into the message text — it looks overwhelming, gets skipped, and often contains line breaks that display strangely in different phones. If you are sending to a large group, a brief 3–4 line message with the link performs far better than a lengthy text. One specific addition that works well: the venue city in the message itself, since guests scanning a group chat will immediately know whether the event is local or requires travel.`,
      },
      {
        heading: 'Common wording mistakes to avoid',
        body: `The most frequent mistake is cramming the entire ceremony schedule into the WhatsApp message. This creates a wall of text that people scroll past. Other mistakes: using overly archaic language that doesn't match the family's usual communication style (it reads as copy-pasted from a template), forgetting to include the invitation link, and using "You are cordially invited" as an opener — it's so overused that it signals a generic message immediately. One specific mistake in Indian family groups: sending the invitation message without addressing whether it's for the wedding, Sangeet, Mehendi, or reception — if you're running multiple events, be clear which event the particular message refers to.`,
      },
      {
        heading: 'Regional language and bilingual approaches',
        body: `For family groups where Hindi, Tamil, Telugu, or other regional languages are dominant, a bilingual message often lands better. You can open with one line in the regional language and continue in English, or keep the entire message in the regional language for elders. For example: "आप सादर आमंत्रित हैं — [Bride's Name] एवं [Groom's Name] के शुभ विवाह में। [Date] | [Venue]" followed by the link. This approach shows respect for the family's cultural context without making the message inaccessible to younger relatives. The invitation page itself can carry the full formal wording — the WhatsApp message just needs to get people to click.`,
      },
      {
        heading: 'Timing: when to send and when to resend',
        body: `Send the main wedding invitation message 14–21 days before the wedding. For destination weddings or events requiring guests to book travel, send 4–6 weeks in advance. Send a reminder message 2–3 days before the event — this is when most guests will actually look at the venue details and map. The reminder can be shorter: "Reminder: [Bride's Name] & [Groom's Name]'s wedding is on [Date] at [Venue]. See you there! 🎉 [link]". Resending the same link is fine and preferable to creating a new message that might confuse people about whether details have changed.`,
      },
    ],
    checklist: [
      'Keep the WhatsApp message to 4–6 lines maximum — let the invitation page carry the full details.',
      'Always include the couple\'s full names in the message, not just first names.',
      'Mention the venue city in the message text so guests know if travel is needed.',
      'Paste the invitation link on a separate line so it is clearly clickable.',
      'Use a tone that matches your family\'s usual communication style — not more formal than your normal messages.',
      'Send a short reminder message 2–3 days before with the same link.',
      'For multi-event weddings, clarify in each message which event the link refers to.',
    ],
    faq: [
      {
        q: 'How long should the WhatsApp wedding invitation message be?',
        a: 'Aim for 4–6 lines of text including the link. The message needs to communicate who is getting married, the date, the city, and that there is a link for full details. Anything beyond that belongs on the invitation page itself. Long messages in WhatsApp groups are often skimmed or skipped entirely, so brevity actually improves how many people click through to the full invitation.',
      },
      {
        q: 'What if some guests don\'t speak English?',
        a: 'Write the WhatsApp message in the language your family uses daily. For Hindi-speaking families, a Hindi message followed by the invitation link works perfectly — the digital invitation page can be shared in any language you set it up in. For regional-language households (Tamil, Telugu, Marathi, Bengali), a bilingual opener with the regional language first signals respect and gets better responses than a purely English message.',
      },
      {
        q: 'Should I send the invitation individually or in a group?',
        a: 'Both work, but serve different purposes. Group broadcasts are efficient for the broad guest list. Individual messages are worth sending to VIP guests — close family members, the wedding party, and key guests — because it signals that the invitation is personal rather than a mass forward. For the groom\'s family especially, an individually sent message from the bride\'s family (or vice versa) is a gesture of warmth that groups do not convey.',
      },
    ],
    links: [
      { label: 'Free digital wedding invitation', href: '/wedding-invitation' },
      { label: 'Wedding invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
      { label: 'Indian wedding invitation wording', href: '/blog/indian-wedding-invitation-wording-for-whatsapp' },
    ],
  },

  'naming-ceremony-invitation-message-samples': {
    intro: `A naming ceremony invitation is one of the warmest invitations you will ever send. You are announcing not just an event, but the arrival of a name — the beginning of a child's identity. Whether you are hosting a Namakaran, a Naamkaran, or a Cradle ceremony, the message should feel joyful and personal. Here are eight ready-to-use samples plus everything you need to know about timing, format, and what to include.`,
    sections: [
      {
        heading: 'Ready-to-use naming ceremony invitation messages',
        body: `**Sample 1 — Formal English, baby boy:**
"We are overjoyed to invite you to the Namakaran ceremony of our little one on [Date] at [Time] at [Venue/Home Address]. We will be sharing our son's name with blessings and prayers. Kindly join us for the ceremony, followed by lunch. — [Parents' Names]"

**Sample 2 — Formal English, baby girl:**
"It is with great joy that we invite you to the naming ceremony of our beloved daughter on [Date] at [Time] at [Venue]. Her name will be revealed during the Namakaran pooja, followed by a family meal. We seek your blessings and presence. — [Parents' Names]"

**Sample 3 — Hindi style:**
"हमारे घर आए नन्हे मेहमान के नामकरण संस्कार में आप सादर आमंत्रित हैं। [Date] | [Time] | [Venue]. आपकी उपस्थिति और आशीर्वाद हमारे लिए बहुमूल्य होगा। — [Parents' Names]"

**Sample 4 — Bilingual (Hindi + English):**
"आप सादर आमंत्रित हैं! We are delighted to invite you to the Namakaran ceremony of our little blessing. [Date] | [Time] | [Venue]. Name reveal at 11:00 AM, followed by lunch. 🙏 — [Parents' Names]"

**Sample 5 — South Indian Cradle ceremony (Thodalutsavam / Thottil Ceremony):**
"With joyful hearts, [Parents' Names] invite you to the Cradle Ceremony (Thottil) of our little one on [Date] at [Time] at [Venue]. The naming will be followed by blessings and lunch. Your presence will make this day truly special."

**Sample 6 — Casual, for friend groups:**
"Our little one is getting a name! 🎉 Join us for [Baby's Name]'s Namakaran on [Date] at [Time] at [Venue]. Pooja at [Time], name reveal at [Time], and lunch to follow. Tap the link below for details and directions!"

**Sample 7 — Name reveal secret style:**
"We're keeping the name a surprise until the ceremony! 🤫 Join us for the Namakaran of our baby on [Date] at [Time] at [Venue]. All will be revealed at the auspicious moment. Lunch to follow. — [Parents' Names]"

**Sample 8 — Religious, formal:**
"By God's grace, [Parents' Names] joyfully invite you to the Namakaran Sanskar of their child on [Date] at [Muhurat Time] at [Venue]. The ceremony will begin with Ganesh Pooja, followed by the naming ritual and family blessings. We seek your presence and prayers."`,
      },
      {
        heading: 'What details go in the message vs what goes on the invitation page',
        body: `The WhatsApp message should include: the event type (Namakaran / naming ceremony), the baby's gender if you're comfortable sharing, the date and venue, and the invitation link. That is enough. The invitation page itself should carry: the full pooja schedule with timings, the complete address with a Maps link, parking information if needed, dress code (if any), and a photo of the baby. Trying to put all of this in the WhatsApp message creates a message no one reads fully. The invitation page is where guests go to get details — the message just needs to get them to click.`,
      },
      {
        heading: 'Timing: how many days before should you send the invitation?',
        body: `For local guests, send the naming ceremony invitation 7–10 days before the event. The ceremony is usually an intimate family occasion, so most guests will be nearby. If family is coming from another city, send at least 2–3 weeks in advance. A naming ceremony often follows the baby's birth by 10–21 days depending on community tradition, so you may not have much lead time — digital invitations solve this because they can be created and sent within an hour once details are confirmed. Send a reminder message the day before for guests who need to be reminded of the time and venue.`,
      },
      {
        heading: 'Regional variations: Namakaran, Naamkaran, and Cradle ceremony',
        body: `The naming ceremony goes by different names across India. In North India (Hindi belt), it is Namakaran Sanskar, typically held on the 10th, 11th, or 12th day after birth, or on an auspicious date determined by the family priest. In South India, the Tamil equivalent is Naamkaranam or Thirunaama, often combined with the Valaikappu or held separately. The Telugu/Kannada equivalent is Namakaranam. In Bengal, it is Annaprashan for food introduction, but the naming ceremony is called Naamkaran. The Thodalutsavam or Cradle ceremony in Tamil families combines the naming and the first time the baby is placed in a cradle. Each variation has slightly different elements — include the local term in your invitation so the ceremony feels authentic to your tradition.`,
      },
    ],
    checklist: [
      'Confirm the muhurat time with your family priest before sending invitations.',
      'Mention whether the name will be revealed at the ceremony or shared in advance.',
      'Include the full ceremony schedule: pooja start, name reveal, blessings, lunch.',
      'Add a Maps link for guests who may not know your home address precisely.',
      'If family is coming from another city, send the invitation at least 2–3 weeks ahead.',
      'Upload a photo of the baby to the invitation page — this is the most-viewed part.',
      'Send a reminder message the day before with the same link.',
    ],
    faq: [
      {
        q: 'Can I send an invitation link instead of just a text message?',
        a: 'Yes, and it works much better. A digital invitation link gives you a dedicated page where you can include the full pooja schedule, venue map, baby photos, and a blessings section where family and friends can leave wishes. The link generates a preview card in WhatsApp showing the baby\'s photo and ceremony details — guests can tap to open the full invitation. You still write a short WhatsApp message, but the link does the heavy lifting of sharing all the event details clearly.',
      },
      {
        q: 'When do I send the reminder message?',
        a: 'Send a reminder the evening before the ceremony, or the morning of — something like "Reminder: [Baby]\'s Namakaran is today at [Time] at [Venue]. Here is the link for directions: [link]". For guests coming from out of town who need to confirm their arrival, send the reminder 2 days before. Keep the reminder short — it just needs to surface the time and the link.',
      },
      {
        q: 'What if the naming ceremony is only for close family — do I still need a proper invitation?',
        a: 'A digital invitation is worthwhile even for small gatherings because it handles the practical details cleanly. Guests get the venue address, pooja timing, and schedule in one place without you needing to answer the same questions individually. The blessings section also works especially well for intimate family events — it becomes a meaningful digital record of the baby\'s first family occasion.',
      },
    ],
    links: [
      { label: 'Free Namakaran invitation', href: '/namakaran-invitation' },
      { label: 'Digital invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
    ],
  },

  'roka-ceremony-invitation-ideas-and-wording': {
    intro: `Roka is the moment a marriage is formalised in the eyes of both families — before the rings, before the formal engagement party, before the wedding date is set. Because it sits at an unusual point in the wedding journey (significant but intimate), the invitation needs to strike the right balance: formal enough to honour the occasion, personal enough to reflect the families' warmth. Here is everything you need for a Roka invitation that works.`,
    sections: [
      {
        heading: 'Six ready-to-use Roka and Sagai invitation message samples',
        body: `**Sample 1 — Formal, from the bride's family:**
"With great joy and gratitude, [Bride's Father's Name] and [Bride's Mother's Name] invite you to the Roka ceremony of their daughter [Bride's Name] with [Groom's Name], son of [Groom's Parents' Names], on [Date] at [Time] at [Venue]. Kindly grace this auspicious occasion with your presence and blessings."

**Sample 2 — From both families jointly:**
"The families of [Bride's Name] and [Groom's Name] joyfully invite you to celebrate their Roka/Mangni on [Date] at [Time] at [Venue], [City]. Please join us for this special beginning. — [Both Families' Names]"

**Sample 3 — Casual, for friend groups:**
"[Bride's Name] said yes! 🎉 We're celebrating with a Roka on [Date] at [Venue]. Join us at [Time] for the ceremony, followed by dinner. Tap the link for full details."

**Sample 4 — Short WhatsApp group message:**
"Sharing the invitation for [Bride's Name] & [Groom's Name]'s Roka ceremony on [Date] at [Venue], [City]. Tap below for schedule and directions. 🙏"

**Sample 5 — Sagai, more formal North Indian style:**
"With the blessings of our elders, [Father's Name] & [Mother's Name] cordially invite you to the Sagai of their daughter [Bride's Name] with [Groom's Name]. [Date] | [Time] | [Venue Name], [City]. Your presence will bring joy to this auspicious occasion."

**Sample 6 — Mangni, religious tone:**
"By God's grace, [Parents' Names] joyfully invite you to the Mangni ceremony of [Bride's Name] and [Groom's Name] on [Date] at [Time] at [Venue]. The ceremony will begin with a short pooja, followed by ring exchange and dinner."`,
      },
      {
        heading: 'Roka vs Mangni vs Sagai — which term to use when',
        body: `These three terms are often used interchangeably but carry different meanings in different communities. Roka (literally "stop" or "hold") is the initial family-to-family agreement ceremony where both families formally agree to the match. It is typically intimate — only the immediate family attends. No rings are usually exchanged at a Roka. Mangni is the formal ring exchange ceremony, more widely celebrated, with a larger guest list. Sagai is the North Indian equivalent of Mangni — a ring exchange that marks the official engagement. In practice, many families use Roka and Sagai interchangeably for the same event. Use the term your own family and community recognises — if your family says "Roka" for the ring ceremony, use Roka. The invitation should feel authentic, not technically correct by someone else's definition.`,
      },
      {
        heading: 'What the Roka invitation should communicate vs the full engagement',
        body: `A Roka invitation communicates one thing above all: this is an intimate, close-family occasion. Unlike a Sangeet or wedding, the Roka is not a production. The invitation tone should reflect that — warm, personal, and without the event-listing that characterises larger celebrations. Include: the date, time, venue (usually a family home or restaurant), who is hosting, and a brief note about the ceremony. You do not need a detailed schedule on a Roka invitation — typically it is a short pooja, a gift exchange or tilak ceremony, and a meal. Save the elaborate scheduling for the Engagement or Wedding invitations.`,
      },
      {
        heading: 'Who to invite to a Roka',
        body: `The Roka guest list is typically limited to immediate family and close family friends from both sides. Think: parents, siblings, grandparents, and perhaps two or three closest family friends. It is not the event for distant relatives, office colleagues, or neighbours. This is actually part of its meaning — the intimacy signals that the families trust and honour each other enough to formalise the match in a private setting before announcing it publicly. When creating the digital invitation, consider making the access direct (no password needed) but keeping the WhatsApp sharing to a small, specific group rather than broadcasting to extended family networks. The full engagement event can reach the broader network.`,
      },
    ],
    checklist: [
      'Use the ceremony term your family actually uses (Roka, Sagai, or Mangni) — not a term borrowed from a template.',
      'Keep the guest list tight — Roka is typically close family only.',
      'Include both families\' names in the invitation for a proper joint introduction.',
      'Note if there is a small pooja before the ring exchange so guests know to arrive on time.',
      'Add a venue Maps link — even for a home event, guests travelling from another part of the city need it.',
      'Avoid elaborate ceremony scheduling — a Roka is usually one or two hours, not a full-day event.',
      'Send 7–10 days in advance, with a reminder the day before.',
    ],
    faq: [
      {
        q: 'Can we send a Roka invitation digitally even though it is an intimate event?',
        a: 'Absolutely. A digital invitation works well for Roka because the guest list is small and personal — you can share it individually rather than to a group. The invitation page can carry the venue address and map, which is useful even for family members who have not visited the host\'s home before. A digital invite also makes it easy to share a reminder link the day before without any extra effort.',
      },
      {
        q: 'How formal should a Roka invitation be?',
        a: 'Match the formality of your family\'s culture. If your family communicates formally at big occasions, a formal invitation is appropriate. If your family is more casual and everyone already knows the couple, a warm and personal invitation message works fine. The key signal to send is that this is a significant occasion — not just a dinner — so whatever your baseline, step it up slightly. A short pooja mention and both families\' names are the two elements that signal the right level of occasion.',
      },
      {
        q: 'Should the Roka invitation mention the wedding date if it has been decided?',
        a: 'It depends on your family\'s preference. Some families prefer to announce the wedding date at the Roka itself as part of the celebration. In that case, leave it off the invitation and let the Roka be the occasion for the announcement. If the wedding date is already publicly known within the family, including it in the invitation is fine — it can read as "On the occasion of [Bride\'s Name] and [Groom\'s Name]\'s Roka, with their wedding set for [Date]." This adds context and excitement without overshadowing the Roka itself.',
      },
    ],
    links: [
      { label: 'Free digital engagement invitation', href: '/engagement-invitation' },
      { label: 'Invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
    ],
  },

  'baby-shower-invitation-wording-ideas-for-india': {
    intro: `Baby shower invitations in India carry more variety than most hosts realise. You might be hosting a Godh Bharai in Rajasthan, a Seemantham in Andhra, a Valaikappu in Tamil Nadu, or a thoroughly modern gender-reveal baby shower with cake and confetti. Each has a different tone, guest list, and set of expectations. Here are seven invitation samples plus guidance on what to include, what to skip, and how early to send.`,
    sections: [
      {
        heading: 'Seven ready-to-use baby shower invitation samples',
        body: `**Sample 1 — Godh Bharai, traditional:**
"With great joy and the blessings of our family, we invite you to the Godh Bharai ceremony of [Mother-to-be's Name] on [Date] at [Time] at [Venue/Home Address]. Join us for rituals, blessings, and a celebratory meal. — [Host's Name / Family Name]"

**Sample 2 — Seemantham, formal:**
"[Family Name] joyfully invites you to the Seemantham ceremony of [Mother-to-be's Name] on [Date] at [Time] at [Venue]. The ceremony will begin at [Muhurat Time] followed by blessings and lunch. Your presence and prayers are our honour."

**Sample 3 — Modern baby shower, English:**
"A little one is on the way and we're celebrating! 🎀 Join us for a baby shower in honour of [Mother-to-be's Name] on [Date] at [Time] at [Venue]. Refreshments and activities to follow. RSVP by [Date] — [Host's Name]"

**Sample 4 — Gender reveal:**
"He or She — who will it be? 💛 Join us for a gender reveal celebration for [Mother-to-be's Name] on [Date] at [Time] at [Venue]. The big reveal is at [Time]. Light refreshments to follow. Can't wait to share the news together!"

**Sample 5 — First-time parents, warm tone:**
"We're going to be parents! 🥹 [Father's Name] and [Mother's Name] invite you to celebrate their little one on [Date] at [Venue], [Time]. Come shower us with love and blessings as we prepare to welcome our baby."

**Sample 6 — Valaikappu (South Indian bangle ceremony):**
"With joyful hearts, [Family Name] invites you to the Valaikappu ceremony of [Mother-to-be's Name] on [Date] at [Time] at [Venue]. The ceremony will begin with a pooja followed by the bangle tradition, blessings, and lunch."

**Sample 7 — Short WhatsApp group message:**
"Sharing the invitation for [Name]'s Godh Bharai on [Date] at [Venue]. Tap the link for details, schedule, and directions. See you there! 🙏"`,
      },
      {
        heading: 'Godh Bharai vs Seemantham vs modern baby shower — how invitation tone differs',
        body: `Godh Bharai (common in Hindi-speaking states) is rooted in ritual and family blessings — the invitation tone is warm, devotional, and community-centred. It is usually women-only or predominantly women, and the ceremony involves filling the mother-to-be's lap (godi) with fruits, sweets, and gifts. Seemantham (Telugu/Kannada) and Valaikappu (Tamil) are similarly ritual-focused, held in the 7th or 9th month, and are more formally structured with specific ceremony timings. A modern baby shower is more casual, often gender-neutral, activity-based (games, cake, gift opening), and draws on Western baby shower conventions. The invitation tone for Godh Bharai should feel auspicious; for Seemantham, it should acknowledge the ceremony structure; for a modern baby shower, it can be playful and upbeat. Avoid applying the same wording template to all three.`,
      },
      {
        heading: 'What to include in the invitation (and what to mention about gifts)',
        body: `Include: the mother-to-be's name, the event type, date, time, venue, ceremony schedule, and a note about dress code if there is one (for Godh Bharai, women often wear traditional attire). If you have a gift registry, include it on the invitation page rather than in the WhatsApp message — mentioning it in the message can feel presumptuous. Similarly, parking information belongs on the invitation page, not the message. One element many hosts forget: if the event is at a home address, include a Maps pin or landmark — "third house from [Landmark]" is not sufficient for guests navigating in an unfamiliar area. For events in venues, note whether parking is available or whether guests should use a nearby lot.`,
      },
    ],
    checklist: [
      'Specify the ceremony type in the invitation (Godh Bharai, Seemantham, Valaikappu, or baby shower).',
      'Include whether the event is women-only or open to all.',
      'List the ceremony schedule: pooja/rituals, main event, food.',
      'Add a venue Maps link — especially important for home addresses.',
      'Note dress code if there are traditional attire expectations.',
      'If including a gift registry, put it on the invitation page, not the WhatsApp message.',
      'Send the invitation 10–14 days before; 3 weeks if family is travelling.',
    ],
    faq: [
      {
        q: 'How early should I send a baby shower invitation?',
        a: 'Send the invitation 10–14 days before the event for local guests. If close family members are travelling from another city — parents, in-laws, siblings — send it 3 weeks in advance so they can book travel. Baby showers in India are often decided and planned quickly due to the pregnancy timeline, so digital invitations are invaluable here because they can be created and sent within hours of confirming the date and venue.',
      },
      {
        q: 'What if the baby shower is a women-only event?',
        a: 'State it clearly in the invitation: "This is a women-only celebration" or "Ladies\' celebration" — do not leave it ambiguous. Families navigate this differently, and male relatives or husbands\' friends may otherwise assume they are invited. For Godh Bharai specifically, it is traditionally women-only, though many modern families include husbands and brothers. Decide in advance and communicate it in the invitation so no one is surprised or awkwardly turned away.',
      },
      {
        q: 'Should I include a gift registry link in the invitation?',
        a: 'Including a registry on the invitation page (not the WhatsApp message) is increasingly accepted and appreciated in urban Indian families — it removes the guesswork for guests and ensures the parents actually receive useful items. Frame it gently: "If you\'d like to bring a gift, we\'ve put together a small list of things we need." Keep it optional and avoid making the registry the focus of the invitation. Older family members may prefer the traditional approach of bringing sweets or hand-selecting a gift — both are equally welcome.',
      },
    ],
    links: [
      { label: 'Free Namakaran invitation', href: '/namakaran-invitation' },
      { label: 'Digital invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
    ],
  },

  'godh-bharai-invitation-ideas-for-whatsapp': {
    intro: `Godh Bharai is one of the most joyful ceremonies in a North Indian family's calendar — the mother-to-be is celebrated, blessed, and surrounded by the women of the family in a ritual that goes back generations. The invitation should carry that same warmth. Here are six ready-to-use Godh Bharai WhatsApp invitation messages, plus everything you need to know about making the invitation feel like the occasion deserves.`,
    sections: [
      {
        heading: 'Six ready-to-use Godh Bharai invitation messages',
        body: `**Sample 1 — Formal, from the family:**
"With great joy, [Host's Name] invites you to the Godh Bharai ceremony of [Mother-to-be's Name] on [Date] at [Time] at [Venue]. We seek your blessings and loving presence as we celebrate this beautiful milestone. Lunch to follow the ceremony."

**Sample 2 — Casual, from close friends:**
"Our girl is going to be a mama! 🥹 Come celebrate [Name]'s Godh Bharai on [Date] at [Time] at [Venue]. Traditional ceremony followed by lunch and lots of love. RSVP by [Date]!"

**Sample 3 — Religious tone:**
"By the grace of God and the blessings of our elders, we joyfully invite you to the Godh Bharai of [Mother-to-be's Name] on [Date] at [Time] at [Venue/Home]. The ceremony will begin with a pooja, followed by the Godh Bharai ritual and a family meal. 🙏"

**Sample 4 — Bilingual (Hindi + English):**
"गोद भराई की शुभ बेला में आप सादर आमंत्रित हैं! Joining us to celebrate [Mother-to-be's Name]'s Godh Bharai on [Date] at [Time] at [Venue]. Ceremony + blessings + lunch 💛 Tap the link for details."

**Sample 5 — Short group message:**
"Sharing [Name]'s Godh Bharai invitation! 🎀 [Date] | [Time] | [Venue]. Tap below for details and directions."

**Sample 6 — Theme-specific (floral theme):**
"Flowers for our blooming mama 🌸 You're invited to [Name]'s Floral Godh Bharai on [Date] at [Time] at [Venue]. Dress in florals or pastels! Ceremony, blessings, and a floral lunch to follow."`,
      },
      {
        heading: 'Godh Bharai themes and how the invitation design should match',
        body: `Godh Bharai themes have grown far more elaborate in the last decade, particularly in urban families. Popular themes include: floral (marigold, rose motifs, pastel colours), royal (deep magenta, gold, regal typography), Rajasthani folk art (bright colours, mirror work references), and modern minimal (blush, ivory, and clean typography). The invitation design should preview the theme — a floral Godh Bharai with a plain invitation creates a jarring disconnect. On ShareInvite, you can match the invitation card colour and style to your theme, and upload photos that signal the aesthetic. For a decorated venue, the invitation photo can show the floral backdrop or the decorated chowki as a teaser. This creates anticipation and also helps guests who want to dress thematically.`,
      },
      {
        heading: 'What ceremonies happen during Godh Bharai — so the schedule reflects reality',
        body: `A typical Godh Bharai sequence runs as follows: Ganesh pooja or a brief prayer opens the ceremony. Then comes the main Godh Bharai ritual — the mother-to-be is seated and female family members fill her lap (godi) with fruits, coconuts, sweets, and sometimes bangles and sarees. In many families, the maternal grandmother performs the central filling. This is followed by mehendi (henna), if included, gifts, blessings from elders, and finally a lunch or tea spread. Knowing this sequence helps you list the schedule accurately in the invitation. A common mistake is just listing "Ceremony and Lunch" — guests like knowing whether there is mehendi (so they can plan accordingly), whether rituals start at a specific muhurat, and roughly how long the event runs.`,
      },
    ],
    checklist: [
      'Mention the ceremony type ("Godh Bharai") clearly at the top of the invitation.',
      'Include the ceremony schedule: pooja, Godh Bharai ritual, mehendi (if any), lunch.',
      'If the event has a theme, mention it so guests can dress accordingly.',
      'Note whether it is women-only or family inclusive.',
      'Upload a photo of the mother-to-be or the decorated venue.',
      'Include a Maps link for the home venue.',
      'Send the invitation 10–14 days before the ceremony.',
    ],
    faq: [
      {
        q: 'How is a Godh Bharai different from a regular baby shower?',
        a: 'Godh Bharai is a ritual ceremony rooted in Hindu tradition — it is not simply a party to celebrate a pregnancy. The core ritual involves family women filling the expecting mother\'s lap with auspicious items (fruits, coconut, cloth, sweets) as a symbolic blessing for a safe delivery. A modern baby shower is typically more casual, party-oriented, and often includes games, a cake, and gift opening. Many Indian families today blend both — the Godh Bharai ritual followed by a more party-like celebration with food and activities. The invitation should reflect which format you are following so guests arrive with the right expectations.',
      },
      {
        q: 'Can men attend Godh Bharai?',
        a: 'Traditionally, Godh Bharai is a women-only ceremony — the core ritual specifically involves female family members. In practice, many modern urban families invite the husband, brothers, and male family friends to the celebration that follows the ritual (the lunch or party portion). If you are following the traditional women-only format, state it clearly in the invitation. If men are welcome for the celebration portion, note "ceremony for ladies, followed by lunch for all family" so there is no confusion.',
      },
    ],
    links: [
      { label: 'Free Namakaran invitation', href: '/namakaran-invitation' },
      { label: 'Digital invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
    ],
  },

  'birthday-invitation-text-for-whatsapp-groups': {
    intro: `A birthday invitation text for WhatsApp has to do something tricky: feel personal in a medium where everyone gets the same message. The key is picking the right sample for the right occasion — a first birthday message reads completely differently from a 50th milestone, and a surprise party message needs to handle the logistics without spoiling the surprise. Here are eight ready-to-use birthday invitation texts for Indian families.`,
    sections: [
      {
        heading: 'Eight ready-to-use birthday invitation texts',
        body: `**Sample 1 — Child\'s first birthday:**
"Baby [Name] is turning ONE! 🎂 Join us for a celebration of this beautiful milestone on [Date] at [Time] at [Venue]. Cake cutting at [Time], followed by dinner. Come make memories with us! — [Parents' Names]"

**Sample 2 — Adult milestone (25th/30th):**
"[Name] is turning [Age] and we're celebrating in style! Join us for a birthday bash on [Date] at [Time] at [Venue]. Dinner and dancing to follow. Dress code: [Theme/Colour]. RSVP by [Date]."

**Sample 3 — 50th/60th milestone (family tone):**
"Our beloved [Name] is celebrating a golden [50/60] years! 🌟 Please join us for a milestone birthday celebration on [Date] at [Time] at [Venue]. The evening will include a special programme honouring [him/her] followed by dinner. Your presence will make this evening truly memorable."

**Sample 4 — Surprise party:**
"SURPRISE ALERT 🤫 — We're throwing [Name] a surprise birthday party on [Date] at [Time] at [Venue]. PLEASE do not mention this to [him/her]! Arrive by [Time] (15 minutes before the guest of honour). Tap the link for details — mum's the word! 😄"

**Sample 5 — Destination birthday:**
"[Name] is celebrating [Age] in [City/Resort Name]! 🎉 Join us for a weekend birthday getaway on [Date–Date] at [Venue Name]. Please RSVP by [Date] so we can plan accommodation. Tap the link for the full itinerary and to confirm."

**Sample 6 — Simple home celebration:**
"Joining us for [Name]'s birthday at home! 🎂 [Date] | [Time] | [Address]. Cake cutting at [Time], dinner to follow. Just family and close friends — see you there! — [Host's Name]"

**Sample 7 — Child's themed party:**
"[Name] is turning [Age] with a [Theme] party! 🦸 Join us for a fun-filled birthday celebration on [Date] at [Time] at [Venue]. Games, cake, and dinner to follow. Dress as your favourite [Theme character] if you'd like!"

**Sample 8 — Group short message:**
"Sharing [Name]'s birthday invite! 🎉 [Date] | [Time] | [Venue]. Tap the link for full details and directions."`,
      },
      {
        heading: 'How to write for a WhatsApp group vs an individual chat',
        body: `In a group, your message competes with dozens of other notifications. Keep it to 3–4 lines: who, when, where, and the link. No need for elaborate preamble. In an individual chat, you have more latitude — add a personal note ("I really hope you can make it, [Name]" or "It won't be the same without you there"). For surprise parties, never send the message to a group that includes the birthday person. Create a separate group or use broadcast lists that exclude them. One practical tip for large Indian family groups: send the group message, then follow up with individual messages to VIP guests (grandparents, close friends, out-of-city family) with an extra personal note. The group message handles logistics; the individual message handles relationships.`,
      },
      {
        heading: 'How to send the invite link alongside the text',
        body: `Create the digital birthday invitation on ShareInvite first, get the shareable link, and then compose your WhatsApp message. Paste the link on a new line after your message text — do not embed it in the middle of the text, because WhatsApp generates a preview card from the link and it can break up your message in an awkward way. The link preview card will show the invitation image, title, and a description snippet, which does much of the work for you. When forwarding to a group, send the text message first, then the link as a follow-up — some guests prefer the text message summary and only tap the link if they need directions.`,
      },
    ],
    checklist: [
      'Match the message tone to the occasion: playful for children, warm for milestones, formal for 50th/60th.',
      'Include the invite link on a separate line below the message text.',
      'For surprise parties, explicitly warn recipients not to tell the birthday person.',
      'Mention dress code or theme if guests need to prepare.',
      'Include the time of key moments (cake cutting, dinner) for guests who cannot stay the whole event.',
      'Send individual follow-ups to VIP guests after the group message.',
      'Send a reminder message the day before with just the time, venue, and link.',
    ],
    faq: [
      {
        q: 'How long should a WhatsApp birthday invite text be?',
        a: 'For a group message, 3–5 lines is ideal. Include: who the party is for and the milestone, date and time, venue, one line about what\'s happening (cake cutting, dinner, theme), and the invitation link. Anything more gets skimmed in a busy group. For individual messages to close friends or family, 6–8 lines is fine because you can add personal notes that would feel odd in a group setting.',
      },
      {
        q: 'Should I send it in the group or individually?',
        a: 'Both, in sequence. Send the group message first to cover everyone simultaneously. Then send individual messages to the guests who matter most — parents, grandparents, siblings, best friends, and out-of-town guests who need to plan travel. The individual message can be identical to the group message or personalised. The important thing is that these guests receive a direct invitation, not just a group notification, which signals that their presence specifically matters.',
      },
    ],
    links: [
      { label: 'Free digital birthday invitation', href: '/birthday-invitation' },
      { label: 'Birthday invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
    ],
  },

  'how-to-make-a-digital-griha-pravesh-invitation': {
    intro: `Griha Pravesh is one of the most significant ceremonies in an Indian family's life — the first entry into a new home, marked by pooja, ritual, and a gathering of family and friends who bless the space. The invitation must work hard: it needs to communicate the muhurat time precisely (guests who arrive late miss the most important part), give an address that works for first-time visitors, and convey the warmth of the occasion. Here is a step-by-step guide to creating a digital Griha Pravesh invitation that does all of this well.`,
    sections: [
      {
        heading: 'Step 1: Start with the muhurat time — everything else follows',
        body: `Before you open any invitation tool, confirm the muhurat time with your family priest or astrologer. The muhurat is the auspicious time window for the first entry — in many traditions, the family enters the home during a specific 10–30 minute window, and missing it is not acceptable. Once you have this time, build the invitation schedule around it. If the muhurat is at 10:15 AM, the invitation should tell guests to arrive by 10:00 AM. The pooja typically begins before the muhurat — usually 30–45 minutes before — with Ganesh Pooja and other preparatory rituals. Your schedule might read: 9:30 AM: Ganesh Pooja begins | 10:00 AM: Guests arrive | 10:15 AM: Griha Pravesh muhurat (entry through decorated door) | 11:00 AM: Pooja and havan | 1:00 PM: Lunch.`,
      },
      {
        heading: 'Step 2: Enter venue details with a precise Maps link',
        body: `New construction addresses in India — especially in upcoming residential layouts and gated communities — are notoriously difficult to find from text alone. On ShareInvite, you can add a Google Maps link to the exact location of your new home. For apartment buildings, use the pin for the main gate, not the building, since Maps often drops the pin in an unhelpful place inside a large complex. Include the tower number and flat number in the address text, and add a note like "Enter through Gate 2 on [Road Name], take the lift to floor [X]." Include a nearby landmark: "Opposite [Landmark] or next to [Petrol Pump]." These small additions prevent the flood of "Where exactly is this?" WhatsApp messages on the morning of the ceremony.`,
      },
      {
        heading: 'Step 3: Add the pooja schedule, parking notes, and a home photo',
        body: `After venue and muhurat, fill in the rest of the invitation. Upload a photo of your new home — the exterior, the decorated entrance, or even the keys — as a personal touch that makes the invitation feel celebratory rather than functional. Add parking instructions: "Street parking available on [Road Name]" or "Basement parking in Tower B, access from Gate 3." Add any dress code notes if relevant. Many families ask guests to wear traditional attire or a specific colour for the Griha Pravesh. Once all fields are complete, preview the invitation on your phone before sharing — check that the Maps link opens correctly, the photo loads, and the schedule is clear.`,
      },
      {
        heading: 'Step 4: Get the shareable link and write the WhatsApp message',
        body: `Once your invitation is published, copy the shareable link from ShareInvite. Write a short WhatsApp message (4–5 lines) for each group you are sending to. Include the muhurat time in the message itself — this is critical enough to mention explicitly rather than leaving guests to find it in the invitation page. Example: "[Family Name] invites you to our Griha Pravesh on [Date]. Muhurat: [Time]. Pooja at [Time], lunch to follow. [Address], [City]. [Link] — Please find directions in the invitation." Send this message to your family groups, friend groups, and neighbours.`,
      },
      {
        heading: 'Regional variations: Gruhapravesham, Ghar Pravesh, and Vastu Puja',
        body: `The ceremony has different names and slightly different customs across regions. Griha Pravesh is the Sanskrit/North Indian term. Gruhapravesham is the South Indian (Telugu/Kannada/Tamil) variant — the ceremony sequence is similar but may include additional rituals like entering with a pot of boiling milk (symbolising prosperity overflowing). Ghar Pravesh is the common Hindi term. Vastu Pooja is a related ceremony focused specifically on blessing the structure of the home according to Vastu Shastra — it may be performed at the same time as Griha Pravesh or separately. Use the term your family uses in the invitation — and if your family uses multiple terms across different linguistic backgrounds, both can appear: "Griha Pravesh / Gruhapravesham."`,
      },
    ],
    checklist: [
      'Confirm the exact muhurat time before creating the invitation.',
      'Include the full ceremony schedule starting from Ganesh Pooja.',
      'Add a Google Maps link pinned to the main gate or entrance, not just the building.',
      'Include entry instructions for gated communities or apartment complexes.',
      'Add parking notes.',
      'Upload a photo of the new home exterior or entrance.',
      'Mention if traditional attire or a specific colour is expected.',
      'Send 10–14 days before; resend link as reminder 2 days before.',
    ],
    faq: [
      {
        q: 'Should I include the full pooja schedule in the invitation?',
        a: 'Yes, include the schedule — but keep it concise. Guests need to know the muhurat time to plan their arrival, and knowing when lunch is served helps guests who are coming from farther away. You do not need to list every individual ritual. A schedule like "9:30 AM: Ganesh Pooja | 10:15 AM: Griha Pravesh muhurat | 11:00 AM: Havan and blessings | 1:00 PM: Lunch" is enough. Avoid listing rituals guests are not involved in — it creates confusion about whether they need to bring anything.',
      },
      {
        q: 'What if the muhurat time changes after I have already sent the invitation?',
        a: 'This is exactly where a digital invitation outperforms a printed card. Log back into ShareInvite, update the muhurat time and schedule, and save. The same link all guests received will now show the updated information automatically. Send a short WhatsApp message to your groups: "Update: The muhurat time has changed to [New Time]. Please check the invitation link for the updated schedule — [link]." Guests who click the link will see the correct information immediately. No reprinting, no resending a new file.',
      },
    ],
    links: [
      { label: 'Free Griha Pravesh invitation', href: '/griha-pravesh-invitation' },
      { label: 'Digital invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
    ],
  },

  'first-birthday-invitation-ideas-for-indian-families': {
    intro: `A child's first birthday is as much a celebration for the parents as it is for the baby — and most of the guests know this. The invitation sets the tone for what will likely be a significant family gathering, possibly the first time all the relatives have gathered since the baby's birth. Here are five ready-to-use invitation messages, popular themes for Indian first birthdays, and everything you need to get the logistics right for a family event that may include guests from other cities.`,
    sections: [
      {
        heading: 'Five ready-to-use first birthday invitation messages',
        body: `**Sample 1 — Warm, parents-led:**
"Our little one is turning ONE! 🎂 [Baby's Name] invites you to celebrate this beautiful milestone on [Date] at [Time] at [Venue]. Cake cutting at [Time], dinner to follow. Come share in our joy! — [Parents' Names]"

**Sample 2 — With milestone stats (height/weight at birth):**
"[Baby's Name] arrived weighing [Weight] and measuring [Height] — and one year later, [he/she] has taken over our hearts completely! 🥹 Join us for [his/her] first birthday on [Date] at [Time] at [Venue]. See you there!"

**Sample 3 — Themed party:**
"The little prince/princess is turning ONE! 👑 [Baby's Name]'s Royal First Birthday is on [Date] at [Time] at [Venue]. Dress your little ones in royal colours if you'd like! Cake, dinner, and lots of love to follow."

**Sample 4 — Religious blessing tone:**
"With gratitude to God for the gift of [Baby's Name], we invite you to celebrate [his/her] first birthday with us. [Date] | [Time] | [Venue]. The evening will begin with a small pooja for blessings, followed by cake cutting and dinner. — [Parents' Names]"

**Sample 5 — Short WhatsApp group message:**
"[Baby's Name] is ONE! 🎉 Join us on [Date] at [Time] at [Venue] to celebrate. Tap the link for full details, directions, and photos: [link]"`,
      },
      {
        heading: 'Popular themes for Indian first birthday parties',
        body: `Indian first birthdays have developed a rich theme culture. Among the most popular in current years: Maa Ki Ladli / Baap Ka Beta (a sentimental celebration of the parents' bond with the baby), Bollywood-inspired themes (film poster styling, retro motifs), Royal Royale (regal photography sets, crown decor), Floral Garden (pastel flowers, butterflies, greenery), and Jungle Safari (animals, earthy colours, popular with boys). For South Indian families, the Annaprashan (first rice-feeding ceremony) is often combined with or precedes the first birthday, and the invitation should mention both if applicable. The theme should be visible on the invitation — a Jungle Safari invitation should not look like a floral garden party. Upload a themed photo or use a template that echoes the palette.`,
      },
      {
        heading: 'What to include: milestone stats, Annaprashan photos, and a wish section',
        body: `First birthday invitations have the richest content possibilities of any event invitation. Include a photo of the baby — ideally a professional shoot or a charming recent photo — as the centrepiece. Many parents add milestone stats (birth weight and height, current weight, first word, first steps date) as a warm personal touch. If you had an Annaprashan ceremony, a photo from that event in the gallery creates continuity. Enable the guest wishes section on the invitation page — first birthdays generate an outpouring of messages from relatives who cannot attend, and a digital blessings page becomes a keepsake for the family. Include the full party schedule (arrival, pooja if any, cake cutting, dinner, goodbye) so guests with young children can plan nap times and departure.`,
      },
      {
        heading: 'Planning the invitation timeline for out-of-town family',
        body: `First birthdays in Indian families often involve relatives from other cities — grandparents, cousins, and aunts who would not miss this milestone. For these guests, send the invitation 3–4 weeks in advance to give them time to book travel and accommodation. Include the city in the WhatsApp message text so they can immediately gauge whether travel is needed. If you are hosting guests at your home, the invitation can carry a note about accommodation — "We have space for [X] guests staying with us; please reach out to confirm" or a nearby hotel recommendation. Send a reminder to out-of-town guests specifically, 1 week before, to confirm their arrival plans.`,
      },
    ],
    checklist: [
      'Upload a clear, high-quality photo of the baby to the invitation.',
      'Include a themed design that matches your party aesthetic.',
      'List the full schedule: arrival, pooja (if any), cake cutting, dinner.',
      'Add the venue Maps link — first birthdays are often at banquet halls or restaurants guests may not know.',
      'Enable the blessings section for family members who cannot attend.',
      'Send 3–4 weeks early if significant family is travelling from other cities.',
      'Send a separate reminder to out-of-town guests to confirm travel plans.',
    ],
    faq: [
      {
        q: 'Should the invitation theme match the party theme?',
        a: 'It should, as much as possible. The invitation is the first visual impression of the party, and a theme mismatch creates a slight dissonance — guests expect one thing and arrive at another. At minimum, use a similar colour palette. Ideally, upload a photo that telegraphs the theme: a baby in a royal outfit for a royal theme, a woodland animal backdrop for a jungle theme. Guests who enjoy matching their outfits or children\'s attire to the theme will appreciate the visual cue.',
      },
      {
        q: 'How early should I send the invitation for a first birthday with out-of-town family?',
        a: 'Send 3–4 weeks before the party for any guests who need to travel. First birthdays are often on a specific date (the actual birthday) with less flexibility than other events, which means guests cannot simply choose a more convenient weekend. Give family members maximum lead time to book flights or trains. For local guests, 10–14 days is sufficient. You can send the invitation in two waves: out-of-town family first, then a broader local group 10 days before.',
      },
    ],
    links: [
      { label: 'Free digital birthday invitation', href: '/birthday-invitation' },
      { label: 'Birthday invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
    ],
  },

  'engagement-invitation-wording-for-ring-ceremony': {
    intro: `The ring ceremony invitation is the first formal communication between two families announcing their union to the world. The wording carries weight — it needs to represent both families correctly, set the right tone for the occasion, and communicate the practical details clearly. Whether you are going for a formal family announcement or a couple-led modern invite, here are seven samples plus everything you need to know about getting the wording right.`,
    sections: [
      {
        heading: 'Seven ring ceremony invitation wording samples',
        body: `**Sample 1 — Formal, both families listed:**
"[Bride's Father's Name] & [Bride's Mother's Name] of [Hometown/City] along with [Groom's Father's Name] & [Groom's Mother's Name] of [Hometown/City] joyfully invite you to the Ring Ceremony of their children [Bride's Name] and [Groom's Name]. [Date] | [Time] | [Venue], [City]. Your blessings and presence are our honour."

**Sample 2 — Modern, couple-led:**
"[Bride's Name] & [Groom's Name] are getting engaged! We're celebrating our ring ceremony on [Date] at [Time] at [Venue Name], [City]. Join us for this milestone and celebrate with us. Dinner to follow. — [Couple's Names / Both Families]"

**Sample 3 — Simple WhatsApp text:**
"Sharing the invitation for [Bride's Name] & [Groom's Name]'s Ring Ceremony on [Date] at [Venue], [City]. Tap the link for full details, schedule, and directions. 🎉"

**Sample 4 — Bilingual, Hindi + English:**
"हार्दिक आमंत्रण — [Bride's Name] एवं [Groom's Name] के रिंग सेरेमनी / सगाई में। [Date] | [Time] | [Venue]. With the blessings of both families, we invite you to this auspicious occasion. 🙏"

**Sample 5 — Religious blessing tone:**
"By God's grace and the blessings of our elders, [Family Names] joyfully invite you to the Ring Ceremony of [Bride's Name] and [Groom's Name] on [Date] at [Time] at [Venue]. May you bring your love and blessings to this new beginning."

**Sample 6 — Formal, single-family hosting:**
"[Bride's Father's Name] and [Bride's Mother's Name] cordially invite you to the Ring Ceremony of their daughter [Bride's Name] with [Groom's Name], son of [Groom's Parents' Names], on [Date] at [Time] at [Venue Name], [City]. Kindly grace this occasion with your presence."

**Sample 7 — Short, for distant contacts:**
"[Bride's Name] & [Groom's Name] are getting engaged on [Date] at [Venue], [City]. Sharing the invitation — you are warmly invited! [Link]"`,
      },
      {
        heading: 'Ring ceremony vs engagement vs Roka — which wording fits which event',
        body: `These three terms overlap but describe different moments. Ring ceremony is the specific event where rings are exchanged — the most visual and publicly celebrated part of an engagement. Engagement as a term is broader and encompasses the entire betrothal period, but colloquially refers to the same ring exchange event. Roka is the earlier, more intimate family agreement ceremony — typically before rings are exchanged. When writing invitation wording: use "Ring Ceremony" for the ring exchange event; use "Sagai" or "Mangni" for North Indian communities where those terms are standard; use "Nishchayathartham" or "Nischitartham" for South Indian Telugu and Kannadiga families; use "Nischitartham" or "Nichayathartham" for Tamil families. The invitation should use the word your family actually uses, not a generic English term that may feel unfamiliar.`,
      },
      {
        heading: 'How to introduce both families\' names correctly',
        body: `The traditional format presents both families symmetrically: "The family of [Bride's Name]: [Father's Name] and [Mother's Name] of [City] and the family of [Groom's Name]: [Father's Name] and [Mother's Name] of [City] joyfully invite you..." If the families are from different cities or states, including the city is meaningful — it shows that people have come together across distance. If only one family is hosting (usually the bride's family for North Indian ceremonies), the groom's family can be referenced as "family of [Groom's Name]" without full names, or you can list both with equal prominence. Avoid listing the groom's family as a footnote — it reads as impolite and will be noticed.`,
      },
    ],
    checklist: [
      'Include both families\' names with equal prominence.',
      'Use the ceremony term your community recognises (Ring Ceremony, Sagai, Mangni, Nischitartham).',
      'Include the ring exchange timing in the schedule — guests often plan around this moment.',
      'Add a dress code if families are coordinating outfits or colours.',
      'Include a Maps link — engagement venues are often unfamiliar banquet halls.',
      'For formal invitations, list the couple\'s full names, not just first names.',
      'Send 10–14 days before; 3 weeks if family is travelling.',
    ],
    faq: [
      {
        q: 'Should both families\' names appear on the ring ceremony invitation?',
        a: 'Yes, ideally both families should appear for a ring ceremony. Traditionally in North India, the bride\'s family hosts and leads the invitation. However, including the groom\'s family alongside — "along with [Groom\'s Father\'s Name] and [Groom\'s Mother\'s Name]" — is now common and expected. It signals mutual celebration and respect. For more modern couples who are co-hosting or paying for the event themselves, listing both families equally or leading with the couple\'s own names is entirely appropriate.',
      },
      {
        q: 'Who writes the invitation — the bride\'s family or the groom\'s?',
        a: 'Traditionally, the bride\'s family writes and sends the engagement invitation in North Indian customs, since they host the event. The groom\'s family may send their own invitation to their relatives. In South Indian traditions, both families may jointly issue the invitation. In modern practice, especially when the couple is closely involved in planning, the wording can come from the couple themselves with both family names appearing below. The practical answer: whoever is organising the event writes it — just ensure both families are represented in the content.',
      },
    ],
    links: [
      { label: 'Free digital engagement invitation', href: '/engagement-invitation' },
      { label: 'Invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
    ],
  },

  'seemantham-invitation-message-examples': {
    intro: `Seemantham is one of the most sacred ceremonies in Telugu and Kannada families — a formal celebration of the expecting mother and a ritual blessing for the safe arrival of the child. Unlike a casual baby shower, Seemantham follows a specific ritual sequence tied to the month of pregnancy and community tradition. The invitation needs to reflect this — not just announce a date and venue, but communicate the nature of the ceremony for guests who may be attending from across the community.`,
    sections: [
      {
        heading: 'Six Seemantham invitation message samples',
        body: `**Sample 1 — Telugu, formal (in English):**
"[Family Name] joyfully invites you to the Seemantham ceremony of [Mother-to-be's Name] on [Date] at [Muhurat Time] at [Venue Name], [City]. The ceremony will include Seemantham rituals followed by lunch. Your blessings and presence are our honour."

**Sample 2 — Telugu, bilingual:**
"శుభాకాంక్షలు! [Family Name] వారు [Mother-to-be's Name] గారి సీమంతం సందర్భంగా మీ అందరినీ ఆహ్వానిస్తున్నారు. [Date] | [Time] | [Venue]. Followed by lunch. Your presence and blessings are sought. 🙏"

**Sample 3 — Tamil Seemantham (Valaikappu variant):**
"With great joy, [Family Name] invites you to the Valaikappu / Seemantham ceremony of [Mother-to-be's Name] on [Date] at [Muhurat Time] at [Venue Name], [City]. Ceremony followed by blessings and lunch."

**Sample 4 — Formal English, both families listed:**
"The families of [Mother-to-be's Father's Name] and [Husband's Father's Name] joyfully invite you to the Seemantham ceremony of [Mother-to-be's Name] on [Date] at [Muhurat Time] at [Venue]. Lunch to follow. Kindly grace us with your blessings and presence."

**Sample 5 — Short WhatsApp group message:**
"Sharing [Name]'s Seemantham invitation — [Date] | [Time] | [Venue], [City]. Tap below for the full schedule and directions. 🙏"

**Sample 6 — Modern, warm tone:**
"Our family is growing! 🌸 Please join us to celebrate [Mother-to-be's Name]'s Seemantham on [Date] at [Time] at [Venue Name], [City]. Traditional ceremony, blessings, and lunch to follow. We look forward to having you with us."`,
      },
      {
        heading: 'What is Seemantham and how it differs from Godh Bharai or a regular baby shower',
        body: `Seemantham is a Hindu ceremony from Vedic tradition observed in Andhra Pradesh, Telangana, Karnataka, and Tamil Nadu communities. Its name derives from Sanskrit roots related to parting of hair — in the full traditional ritual, the husband draws a line through his wife's parted hair with a porcupine quill or gold object while chanting Vedic mantras. The ceremony is held in the 7th month of pregnancy (some families observe the 5th) at an auspicious muhurat time, making the timing more structured than a casual baby shower. The focus is sacred blessing — for the mother and the unborn child — and the mood is reverent and joyful at once. This distinguishes it sharply from a Godh Bharai (which is more celebratory and gift-oriented) and from a modern baby shower (which is recreational). The invitation should signal this ceremonial nature with appropriate language — "muhurat," "blessings," "pooja" — rather than party-style wording.`,
      },
      {
        heading: 'Ceremony schedule that the invitation should list',
        body: `A standard Seemantham programme might run as follows: Muhurat begins with Ganesh Pooja and invocation. The main Seemantham ritual follows — which may include the Gajananam (elephant step), Mangalasnaanam (auspicious bath), bangle ceremony, and the actual Seemantham hair-parting ritual performed by the husband. This is followed by family blessings, gift giving, and a full lunch. In Telugu households, the lunch is often a traditional feast and is a major part of the occasion. The invitation should list the muhurat time prominently — guests understand that arriving after the muhurat means missing the core ceremony. Include the full address with a Maps link, since Seemantham venues are often community halls or the family home in a residential area.`,
      },
      {
        heading: 'Who to invite — community norms',
        body: `Seemantham guest lists follow community norms that vary by family. In most Telugu and Kannada families, Seemantham is a women-centric ceremony in its core ritual, with men attending the social portion (lunch). Inviting extended family, community elders, and neighbours is standard — unlike a Godh Bharai, which tends to be more intimate. Many families also invite the mother-to-be's school friends, college friends, and her husband's family colleagues. The occasion is significant enough for a broader list. If the family is hosting the event in their home city but the mother-to-be is visiting from another city (a common pattern), the invitation may need to address two separate groups: the local community and distant family who may attend specifically for this occasion.`,
      },
    ],
    checklist: [
      'Confirm the muhurat time before creating the invitation.',
      'Use the term "Seemantham" (or "Valaikappu" for Tamil families) in the invitation heading.',
      'List the ceremony sequence: Ganesh Pooja, main ritual, blessings, lunch.',
      'Include both families\' names — maternal and paternal sides.',
      'Add a venue Maps link with clear entry instructions.',
      'Note if the ceremony is predominantly women-only or family-inclusive.',
      'Send 10–14 days before; 3 weeks for out-of-city family.',
    ],
    faq: [
      {
        q: 'When is Seemantham typically held (which month of pregnancy)?',
        a: 'Seemantham is most commonly held in the 7th month of pregnancy in Telugu and Kannada tradition, at an auspicious muhurat determined by the family astrologer or priest. Some families observe it in the 5th month. The exact timing may depend on the family\'s regional tradition and the astrologer\'s recommendation. Tamil Valaikappu is also typically in the 7th month. If the ceremony is being held in a different month due to practical reasons, the invitation does not need to explain this — just state the date.',
      },
      {
        q: 'Is Seemantham women-only?',
        a: 'The core Seemantham ritual — performed by the husband — is participated in by women in the family, but the husband is the primary performer, so men are not excluded from the ceremony itself. In practice, many families invite all family members to the full event. The social portion (lunch) is typically mixed. If your family\'s tradition is women-only for the ritual portion, state it clearly in the invitation so male relatives know whether they are expected to attend the ceremony or only the meal.',
      },
    ],
    links: [
      { label: 'Free Namakaran invitation', href: '/namakaran-invitation' },
      { label: 'Digital invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
    ],
  },

  'housewarming-invitation-wording-for-griha-pravesh': {
    intro: `A housewarming invitation for a Griha Pravesh ceremony needs to work on two levels: it must communicate the muhurat time with precision (guests who miss it miss the most important part), and it must help guests find an address that may be unfamiliar, in a new construction area or an apartment complex with multiple buildings. Here are six samples covering the main formats Indian families use, plus guidance on what to always include and what to leave out.`,
    sections: [
      {
        heading: 'Six housewarming invitation message samples',
        body: `**Sample 1 — Religious/traditional:**
"With the blessings of [Deity/God] and our elders, [Family Name] joyfully invites you to the Griha Pravesh ceremony of our new home. [Date] | Muhurat: [Time] | [Full Address], [City]. Pooja at [Time], lunch to follow. Please grace us with your presence and blessings. 🙏"

**Sample 2 — Modern, warm:**
"We're home! 🏡 [Family Name] invites you to celebrate our Griha Pravesh on [Date] at [Venue/Address], [City]. Muhurat at [Time], pooja from [Time], lunch at [Time]. Tap the link for full details and directions."

**Sample 3 — Short WhatsApp group message:**
"Sharing our Griha Pravesh invitation! [Date] | Muhurat: [Time] | [Address], [City]. Tap the link for the full schedule and Google Maps directions. 🙏 — [Family Name]"

**Sample 4 — Formal, printed-card style:**
"[Family Name] along with [Extended Family Reference] cordially invite you to the auspicious Griha Pravesh ceremony on [Date] at [Muhurat Time] at [Venue Name / Address]. The ceremony includes Vastu Pooja, Griha Pravesh, and Lakshmi Pooja, followed by a traditional lunch. Your presence and blessings will sanctify our new home."

**Sample 5 — Bilingual (Hindi + English):**
"गृह प्रवेश के शुभ अवसर पर आप सादर आमंत्रित हैं। [Date] | मुहूर्त: [Time] | [Address]. Pooja followed by lunch. We look forward to your presence and blessings. 🙏 — [Family Name]"

**Sample 6 — Apartment-specific:**
"[Family Name] invites you to our Griha Pravesh at [Apartment Complex Name], Tower [X], Floor [X], [City] on [Date]. Muhurat: [Time]. Enter from Gate [X] on [Road Name]. Pooja at [Time], lunch to follow. Tap the link for the Google Maps pin and full details."`,
      },
      {
        heading: 'What to always include in a Griha Pravesh invitation',
        body: `Three things must appear in every Griha Pravesh invitation, no matter how brief: the muhurat time (mark it prominently as "Muhurat: [Time]" not buried in a schedule), the complete address including apartment number and tower/building if applicable, and a Google Maps link. Beyond these, include the ceremony schedule — guests need to know whether the pooja runs for 30 minutes or 3 hours to plan their day. Dress code is worth including if you are expecting traditional attire. A personal message from the family — even one sentence about the joy of moving into the new home — elevates the invitation from a logistical notice to a genuine celebration.`,
      },
      {
        heading: 'What to leave out of the digital invitation',
        body: `A common mistake in Griha Pravesh invitations is including the gift wish list in the invitation itself — this is considered inappropriate in most Indian families and signals that the host values gifts over guests. Leave this out entirely. Similarly, avoid including detailed cost information about the new home (how many bedrooms, which builder, price range) which occasionally appears as an attempt to contextualise the celebration. The invitation should not include internal family notes about who is contributing to the costs or the pooja arrangements — keep those conversations separate. On the digital page, avoid uploading interior photos of a home that is still under setup; a clean exterior or front door photo is more appropriate.`,
      },
    ],
    checklist: [
      'Place the muhurat time prominently, labelled as "Muhurat" not just listed in the schedule.',
      'Include the complete address: street, apartment/tower, floor, city, landmark.',
      'Add a Google Maps link pinned to the main entry gate for apartments.',
      'Include parking instructions specific to the building.',
      'List the ceremony schedule clearly: Ganesh Pooja, Vastu Pooja, Lakshmi Pooja, Griha Pravesh entry, havan, lunch.',
      'Add a warm family message — even one sentence.',
      'Send 10–14 days before; resend the link as a reminder 2 days before.',
    ],
    faq: [
      {
        q: 'Should I mention the muhurat time in the main WhatsApp message?',
        a: 'Yes, always. The muhurat time is the single most critical piece of information for a Griha Pravesh guest. Include it in the WhatsApp message itself, not only on the invitation page. Write it clearly: "Muhurat: 10:15 AM" in the first few lines of the message. Guests who only skim the WhatsApp message (rather than opening the invitation link) need to see this immediately. Many guests in large WhatsApp groups read the first line and decide whether to arrive on time based on that alone.',
      },
      {
        q: 'How formal should a housewarming invitation be?',
        a: 'Match the formality to your guest list and family culture. A Griha Pravesh is an auspicious religious ceremony, so the base tone should be respectful and warm — more formal than a birthday party, less elaborate than a wedding. For family groups, a warm and personal tone works well. For office contacts or neighbours you know less well, a slightly more formal tone is appropriate. The key is that the invitation communicates this is a meaningful ceremony, not just a housewarming party with drinks — that distinction matters for guests making travel and arrival time decisions.',
      },
    ],
    links: [
      { label: 'Free Griha Pravesh invitation', href: '/griha-pravesh-invitation' },
      { label: 'Digital invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
    ],
  },

  'namakaran-invitation-ideas-for-baby-boys': {
    intro: `A Namakaran invitation for a baby boy is one of the most joyful invitations you will create — the entire occasion is a celebration of a new life and the name that will carry him forward. This guide covers five invitation message samples specifically for baby boys, ideas for the name reveal moment, what ceremony details to include in the invitation schedule, and photo gallery ideas that make the invitation feel like a keepsake rather than just a notice.`,
    sections: [
      {
        heading: 'Five Namakaran invitation message samples for baby boys',
        body: `**Sample 1 — Formal, family-led:**
"With hearts full of joy, [Parents' Names] invite you to the Namakaran ceremony of their son on [Date] at [Muhurat Time] at [Venue/Home Address]. Our little one's name will be revealed with prayers and family blessings. Lunch to follow. Kindly grace this auspicious occasion. 🙏"

**Sample 2 — Name already known, celebratory:**
"[Baby's Name] is here! 🎉 We invite you to the Namakaran ceremony of our baby boy [Baby's Name] on [Date] at [Time] at [Venue]. Pooja at [Time], name announcement, blessings, and lunch to follow."

**Sample 3 — Name reveal surprise:**
"We're keeping his name a secret until the ceremony! 🤫 Join us for our son's Namakaran on [Date] at [Muhurat Time] at [Venue]. All will be revealed with the blessing of our family. Lunch to follow. — [Parents' Names]"

**Sample 4 — Religious, Sanskrit reference:**
"By the grace of [Deity] and the blessings of our elders, [Parents' Names] joyfully invite you to the Namakaran Sanskar of their son on [Date] at [Muhurat Time] at [Venue/Home]. The ceremony will include Ganesh Pooja, Namakaran ritual, and family blessings. Prasad and lunch to follow."

**Sample 5 — Bilingual (Hindi):**
"हमारे नन्हे बेटे के नामकरण संस्कार में आप सादर आमंत्रित हैं। [Date] | मुहूर्त: [Time] | [Venue]. पूजा के बाद दोपहर के भोजन का आयोजन है। आशीर्वाद की कृपा बनाए रखें। — [Parents' Names]"`,
      },
      {
        heading: 'Name reveal ideas — keeping the name secret vs announcing early',
        body: `Indian families take different approaches to the name reveal at a Namakaran. In the traditional approach, the name is whispered into the baby's right ear by the father or grandfather as the first moment of the ceremony — and guests discover it in that moment. This makes the ceremony itself the reveal event, which adds emotional resonance to the gathering. In the modern approach, many families share the name in advance (especially for invitations to people they are close to) and the ceremony becomes a celebration of the name already chosen. A third approach: share the name with close family only and let broader guests discover it at the ceremony. Your invitation should signal which approach you are taking — "name to be revealed at the ceremony" or "join us to celebrate [Baby's Name]'s Namakaran." Ambiguity creates awkward questions.`,
      },
      {
        heading: 'Ceremony details to list in the schedule',
        body: `A Namakaran programme typically runs as follows: Ganesh Pooja or an opening prayer (15–20 minutes), followed by the core Namakaran ritual in which the name is whispered into the baby's ear and then announced to the gathering. In many families, the grandfather performs this. Then come family blessings — elders place the baby in their lap and bless him. Gifts and sweets follow, and the event concludes with lunch or prasad. Include this sequence in your invitation schedule. Guests, especially those who have not attended a Namakaran before, appreciate knowing what will happen and when. Include the muhurat time if the ceremony must begin at a specific auspicious time, and note the expected duration so guests with young children can plan accordingly.`,
      },
      {
        heading: 'Photo gallery ideas for baby boy Namakaran invitations',
        body: `The invitation page's photo gallery is the first thing guests will notice after the headline. For a baby boy Namakaran, use: a clear close-up of the baby's face (the best single photo for an invitation), a family photo from the maternity shoot or the first days at home, a photo from the hospital arrival if the family is comfortable sharing, and optionally a name-written-in-henna or name-card photo if you have one. Avoid overly edited or heavily filtered photos — natural light photos work better and feel more personal. If the ceremony has a theme (Annaprashan-meets-Namakaran, for example, for families combining ceremonies), use a photo from the venue setup or a symbolic photo that hints at the theme.`,
      },
    ],
    checklist: [
      'Decide in advance whether the name will be revealed at the ceremony or shared in the invitation.',
      'Include the muhurat time if there is a specific auspicious timing for the ceremony.',
      'List the ceremony schedule: Ganesh Pooja, Namakaran ritual, blessings, lunch.',
      'Upload a clear, recent photo of the baby.',
      'Add a Maps link for the venue — even for home addresses.',
      'Enable the blessings section so family members who cannot attend can leave wishes.',
      'Send 7–10 days before; 2–3 weeks for out-of-city family.',
    ],
    faq: [
      {
        q: 'How do I mention the baby\'s name in the invitation if it is being revealed at the ceremony?',
        a: 'If you are keeping the name a secret until the ceremony, simply use "our son" or "our little one" throughout the invitation without naming him. The heading of the invitation can read "Namakaran Ceremony" or "[Parents\' Names] & Family invite you to their son\'s Namakaran." In the invitation message, write "His name will be revealed at the ceremony" so guests know it is an intentional reveal and not an omission. This builds pleasant anticipation and makes the ceremony feel more special.',
      },
    ],
    links: [
      { label: 'Free Namakaran invitation', href: '/namakaran-invitation' },
      { label: 'Digital invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
    ],
  },

  'namakaran-invitation-ideas-for-baby-girls': {
    intro: `A baby girl's Namakaran is celebrated with particular warmth in Indian families — she is the Lakshmi of the home, the Goddess's gift, and many families pour that reverence into the ceremony with flowers, music, and a gathering that feels as joyful as any festival. The invitation should carry that same warmth. Here are five invitation samples for a baby girl's Namakaran, design and motif ideas, wording samples with the poetic quality traditionally reserved for daughters, and guidance on what to include for the ceremony schedule.`,
    sections: [
      {
        heading: 'Five Namakaran invitation message samples for baby girls',
        body: `**Sample 1 — Formal, devotional tone:**
"With hearts filled with gratitude, [Parents' Names] invite you to the Namakaran ceremony of their daughter on [Date] at [Muhurat Time] at [Venue/Home Address]. Our little Lakshmi's name will be revealed with the blessings of our elders and the grace of God. Prasad and lunch to follow. 🙏"

**Sample 2 — Celebratory, name revealed:**
"Our little princess has a name! 👑 Please join us for [Baby's Name]'s Namakaran on [Date] at [Time] at [Venue]. Pooja at [Time], naming ceremony, blessings, and lunch to follow. — [Parents' Names]"

**Sample 3 — South Indian, Lakshmi reference:**
"With the blessings of Goddess Lakshmi, [Family Name] joyfully invites you to the Namakaranam of their daughter on [Date] at [Muhurat Time] at [Venue], [City]. The ceremony will begin with Ganesh Pooja followed by the naming ritual, family blessings, and a traditional lunch. Your presence is our joy."

**Sample 4 — Name reveal, poetic:**
"A flower has bloomed in our home 🌸 — and she will be given her name with the blessings of family. Join us for our daughter's Namakaran ceremony on [Date] at [Muhurat Time] at [Venue]. The ceremony, blessings, and lunch will follow. We await your presence and love. — [Parents' Names]"

**Sample 5 — Bilingual, Hindi + English:**
"हमारी नन्ही परी के नामकरण संस्कार में आप सादर आमंत्रित हैं 🌸 [Date] | मुहूर्त: [Time] | [Venue]. Pooja and name reveal at [Time], lunch to follow. Your blessings are our greatest gift. — [Parents' Names]"`,
      },
      {
        heading: 'Flower, princess, and goddess motif suggestions for the invitation design',
        body: `Baby girl Namakaran invitations traditionally draw on flower, goddess, and princess motifs — and these work beautifully in digital formats. Marigold and lotus motifs are the most auspicious and widely recognised across Hindu traditions. Rose and jasmine motifs have a softer, contemporary feel that works well for modern-themed ceremonies. For South Indian families where Goddess Lakshmi and Parvati references are common, a temple flower garland design or a Kolam (rangoli) border evokes the right cultural context without being overly ornate. For North Indian families, a soft pink or yellow palette with floral borders signals a baby girl celebration clearly. Avoid overly fussy or heavily decorated designs — the baby's photo should remain the centrepiece, and a clean design lets it breathe.`,
      },
      {
        heading: '"Lakshmi Swarupa" and other respectful references for the invitation',
        body: `Many South Indian families, particularly in Tamil Nadu, Andhra, and Karnataka, use devotional references to describe a baby girl — "Lakshmi Swarupa" (embodiment of Lakshmi), "Ammavari Varam" (gift of the Goddess), or simply "Devi Swarupam" (form of the Goddess). These references are deeply meaningful in the community and signal the family's reverence for the child. In North Indian families, "Ghar Ki Lakshmi" is the common phrase. Including one such reference in the invitation — in the body text or as a tagline below the baby's photo — adds the right note of devotion without making the invitation feel overtly religious. Use the phrase that your family actually uses, not one borrowed from a different regional tradition.`,
      },
      {
        heading: 'Ceremony schedule and photo gallery for baby girl Namakaran',
        body: `The ceremony schedule for a baby girl Namakaran follows the same structure as for a boy — Ganesh Pooja, the naming ritual, blessings, lunch — but many families add specific elements for a daughter: the placing of the baby in a cradle decorated with flowers and beads (a tradition in some communities), the tying of black thread or silver anklets for protection, and the singing of lullabies or devotional songs by the women of the family. If your ceremony includes these elements, list them in the schedule so guests know what to expect. For the photo gallery, use a close-up of the baby girl's face, a photo with her mother, and if available, a photo with the maternal grandmother — who often plays a central role in the naming ceremony. A "before and after" photo series (first day home vs. ceremony day) is a popular and touching addition.`,
      },
    ],
    checklist: [
      'Use a design with floral or devotional motifs appropriate to your community tradition.',
      'Include the muhurat time clearly in the invitation.',
      'Use a devotional or cultural reference (Lakshmi Swarupa, Ghar Ki Lakshmi) if it fits your family.',
      'List the ceremony schedule including any specific traditions for girls (cradle, anklets, lullabies).',
      'Upload a clear photo of the baby girl — close-up, natural light.',
      'Enable the blessings section for family who cannot attend.',
      'Send 7–10 days before; 2–3 weeks for out-of-city family.',
    ],
    faq: [
      {
        q: 'Is the invitation tone traditionally different for a baby girl\'s Namakaran compared to a boy\'s?',
        a: 'Traditionally, yes — invitations for baby girls have tended toward more poetic and devotional language in many regional traditions, drawing on references to Goddesses, flowers, and divine grace. In practice today, many families use similar tones for both. However, if your family observes this tradition, using slightly more lyrical wording for your daughter\'s Namakaran invitation — "a flower has bloomed in our home," "our Lakshmi has arrived" — is both authentic and resonant. The guests who know your family will appreciate it.',
      },
      {
        q: 'What if the baby girl\'s name has not been decided yet when we are creating the invitation?',
        a: 'This is common — many families keep the name deliberation going until the ceremony day itself, especially when the astrologer\'s input is involved. In this case, create the invitation without the baby\'s name and use phrases like "our daughter," "our little one," or "Ghar Ki Lakshmi" as placeholders. Once the name is decided (even hours before the ceremony), you can update the invitation page with the name, and the same link will show the update automatically. If you decide the name during the ceremony itself, the invitation does not need to be updated — it has already served its purpose.',
      },
    ],
    links: [
      { label: 'Free Namakaran invitation', href: '/namakaran-invitation' },
      { label: 'Digital invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
    ],
  },

  'how-to-create-a-whatsapp-wedding-invitation': {
    intro: `WhatsApp is how Indian wedding invitations actually reach guests — not email, not post, not Instagram. The question is not whether to use WhatsApp but how to use it properly: what goes on the invitation page, what goes in the forwarding message, how to handle multiple groups without losing your mind, and why sending a link instead of an image file changes everything. This is a complete step-by-step guide.`,
    sections: [
      {
        heading: 'Step 1: Create your digital wedding invitation',
        body: `Go to shareinvite.in/create and choose a wedding template. Fill in the basic details: bride and groom names, wedding date, muhurat time, venue name and address, and the ceremony schedule (Sangeet, Mehendi, Baraat, Varmala, Pheras, Reception — with timings for each). Upload a couple photo to the gallery if you have one — this is the detail that generates the most responses from guests. Add background music if you want the invitation to have an atmosphere. Add a Google Maps link to your venue. Preview the page on your phone before moving forward — what you see is exactly what guests will see. This entire setup takes 15–20 minutes for a basic invitation.`,
      },
      {
        heading: 'Step 2: Get the shareable link and set up the WhatsApp message',
        body: `Once your invitation is published, copy the shareable link. Now write the WhatsApp message that will accompany the link. This message is what guests read first — it should be short (4–5 lines), mention the couple's names, the date, the city, and tell guests the link has full details. Example: "[Bride's Name] & [Groom's Name] are getting married! We joyfully invite you to our wedding celebrations on [Date] at [Venue Name], [City]. Click the link below for the complete schedule, venue details, and directions. We look forward to celebrating with you! — [Family Names]" Paste the link below the text. Do not embed the link inside the sentence — WhatsApp renders links better when they appear on a line by themselves.`,
      },
      {
        heading: 'Step 3: How to share across multiple groups',
        body: `Indian weddings typically require sending to multiple WhatsApp groups: bride's family, groom's family, bride's friends, groom's friends, school/college groups, office colleagues, and family groups for each city of extended family. The core invitation message can be identical across groups — what changes is the introduction. For the bride's family group, the message comes from the bride's parents; for the groom's side, from the groom's parents. Keep a note of which groups you have sent to, and do not resend the same message to a group — resending creates duplicate notifications and signals disorganisation. A systematic approach: list your groups by category (family, friends, professional), write one version for each category, and send in a single session so nothing is missed.`,
      },
      {
        heading: 'The invitation link vs the WhatsApp image — why the link is better',
        body: `Most families have the habit of creating a graphic or video invitation and sending it as a file in WhatsApp. This approach has several problems: image files do not contain the venue address, map, or schedule — guests need to ask separately; the image quality often degrades when forwarded multiple times; and the image gets buried in the media section and is hard to retrieve on the day of the event. A link, by contrast, always works: it opens the same page every time, contains the map, schedule, and full details, and the host can update it if anything changes. The WhatsApp preview card for the link — the thumbnail image with the title — is often more visually striking than the image file anyway, because it shows on a clean card without the compression artefacts of a forwarded image.`,
      },
    ],
    checklist: [
      'Complete the invitation page fully before generating the shareable link.',
      'Test the link on both Android and iPhone before sharing to any group.',
      'Write the WhatsApp message before opening any group — draft it first.',
      'List all the WhatsApp groups you plan to send to and check them off as you go.',
      'Use the same link for all groups — no need to create multiple invitations for different groups.',
      'Do not resend the same message to a group you have already sent to.',
      'Schedule a reminder to resend the link 2–3 days before the wedding.',
    ],
    faq: [
      {
        q: 'Will the invitation link show a preview in WhatsApp?',
        a: 'Yes. ShareInvite generates Open Graph metadata for every invitation page, which means WhatsApp generates a preview card showing the invitation image, the event title (e.g., "Ananya & Vihaan\'s Wedding"), and a short description. This preview appears automatically when you paste the link into a WhatsApp message before sending. You will see it in your own chat before forwarding to groups — if the image looks correct and the title is right, the invitation is set up correctly.',
      },
      {
        q: 'Can I track who opened the invitation?',
        a: 'ShareInvite shows you the number of views your invitation page has received, so you can see the total number of guests who have opened the link. This is useful for gauging reach and deciding whether to send reminders to groups that may have missed the invitation. Detailed per-person tracking (who specifically opened it) is not available for guest privacy reasons, but the aggregate view count is visible in your dashboard.',
      },
    ],
    links: [
      { label: 'Free digital wedding invitation', href: '/wedding-invitation' },
      { label: 'Wedding invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
      { label: 'Indian wedding invitation wording', href: '/blog/indian-wedding-invitation-wording-for-whatsapp' },
    ],
  },

  'my-college-friend-got-engaged-his-whatsapp-digital-invitation-left-everyone-speechless': {
    intro: `Some things you just don't see coming. Rohan — and yes I am changing his name, he will know who he is — was the last person in our BCom batch we expected to get engaged quietly, without warning, without so much as a heads-up in the group chat. He was also the person who, twice in his life, fell for someone in circumstances that made everyone around him hold their breath. The second time, we were all quietly certain it wouldn't work. We were wrong. And the invitation he sent when it did work is actually part of the reason I built ShareInvite.`,
    sections: [
      {
        heading: 'The principal\'s office — a college romance that didn\'t survive the rules',
        body: `We were in our second year of BCom together. The kind of year where you're still figuring out whether you're an assets-side or a liabilities-side person, academically and otherwise. Rohan had started talking to a girl in class — Shruti — and it was one of those things the entire batch knew about before either of them admitted it. Notes shared during lectures. Suddenly synchronized breaks. The kind of eye contact that makes surrounding classmates deeply uncomfortable.

By the time the principal found out, it had been going on for almost a year. We never got the full story of who reported it or how — these things have a way of travelling in colleges with narrow corridors. What we do know is that on a Tuesday afternoon, both of them were called in. Parents were summoned. There were very polite, very formal conversations in that room. Outside it, apparently, both families had considerably stronger opinions.

The relationship continued for a few months after that. Rohan was not someone who gave up easily on things. But eventually it ended — gradually, the way those things do when the outside pressure accumulates faster than the inside resolve. He didn't talk about it much. We didn't ask. The group moved on.`,
      },
      {
        heading: 'MBA, a different city, a different girl — and the cautious hope nobody said out loud',
        body: `After BCom, everyone scattered. Some went for CA. A few joined family businesses. I moved to Bengaluru to start building what would eventually become ShareInvite — I'd been obsessed with the idea of digital invitations for Indian families since I noticed how badly designed most of them were, and how much families were overpaying for printed cards that nobody kept. Rohan got into an MBA programme in Pune.

The updates from him were infrequent in that first year. The group chat was mostly memes and cricket observations. Then, one afternoon, he mentioned someone named Kavya. Casually. The way you mention someone when you're trying very hard to sound casual about something that isn't casual at all.

She was at a different MBA college in Pune. They'd met at a common friend's farewell party. Conversations had started. He didn't frame it as anything serious. We all read between the lines anyway.

The next few months brought occasional updates. They were spending time together. They had an argument about something (he was vague, we didn't push). They'd sorted it out. She was smart, apparently — the kind of smart where she called him out on things and he found it refreshing rather than annoying. He showed up to one group meetup when he visited Bengaluru, and Kavya came up in conversation naturally enough that we started to understand this was real.`,
      },
      {
        heading: 'The relationship everyone doubted — and the silence before the storm',
        body: `By his final year of MBA, the relationship had been going for over a year. Two different colleges, two different exam calendars, two different placement seasons stacking on top of each other. Rohan and Kavya were navigating all of it from the same city but with almost no overlap in their schedules.

In the group chat — and I will be honest about this because it's relevant to the point of the story — there was a quiet consensus that it wouldn't survive placements. Not because of any problem with either of them specifically. Just because final-year MBA is genuinely brutal, both families would start asking questions about timelines, and relationships at that stage either accelerate into something permanent or fall apart under the weight of everything else. Most of us thought it would be the latter.

Placements happened. Rohan got a decent offer and stayed in Pune. Kavya's company had offices in both Pune and Mumbai. The group chat drifted further. Months passed where nobody mentioned their relationship at all — it had faded into background information. It was just "a fact about Rohan," filed next to "he supports Mumbai Indians" and "he will always order butter chicken regardless of the menu."

Then one Sunday morning in February, the group exploded.`,
      },
      {
        heading: 'The WhatsApp status that nobody expected — and the ten minutes that followed',
        body: `Rohan had posted a status. A link. One of those digital invitation links that opens directly in your phone browser without downloading anything. Someone saw it first and sent it to the group chat with just: "bhai."

That was enough. Within ninety seconds there were twenty messages.

"Wait wait wait."
"IS THIS WHAT I THINK IT IS."
"He actually did it."
"Who knew??? Nobody told me anything???"

They had gotten engaged. A small family ceremony two weeks earlier, both families present, completely off the group's radar. The status was the formal announcement — and attached to it was the full digital invitation for the engagement celebration the following weekend.

Someone called him. He picked up laughing. He'd apparently told exactly two people in the group beforehand and sworn them to silence, which is the kind of thing that turns a normal engagement announcement into a story your entire friend group tells for years.

The messages about the shock lasted about ten minutes. Then people actually opened the link. And that's when the second wave started.`,
      },
      {
        heading: 'What he actually built — and why it stopped people mid-scroll',
        body: `The invitation was built on ShareInvite — I'll be transparent that I'm the founder, so I know this platform better than most, but I also want to be honest: even if I hadn't built it, I would have stopped to look at what Rohan had put together.

He'd used the IndianEngagement template. Both his and Kavya's names in the main heading. Below that, a photo — not a professional shoot, just a good picture of the two of them from a trip they'd taken to Coorg, natural light, they were both laughing at something. It looked real because it was real. Below the photo, the ceremony details: venue name, timing, address, and a Google Maps link embedded directly into the page so guests could navigate with one tap.

But the thing that got people talking more than the design was the features he had actually used instead of leaving blank. Background music — something soft and instrumental — started playing automatically when the page opened. There was a wishes section at the bottom where guests could leave messages, and by the time the group got to it, a few people had already written something. There was a small photo gallery with three pictures from the Coorg trip.

"How much did this cost?" someone asked in the group. The assumption was that anything that looked this good must be expensive.

Rohan sent a screenshot of the pricing. It was less than what most of us spend on a decent dinner out.

One of the girls in our group — who had gotten engaged herself the previous year and spent significantly more on just the printed invitation cards — sent back a single emoji: 🥹

At the engagement party the following weekend, three separate people asked Rohan who had designed the invitation. He sent them the ShareInvite link each time. One of them created their own invitation for a birthday party two weeks later. Another used it for a Griha Pravesh six months after that.`,
      },
      {
        heading: 'What actually made it work — and what anyone can replicate',
        body: `Looking back at what Rohan did, the thing that set his invitation apart wasn't any single feature. It was that he didn't treat the invitation as a formality. He spent an extra twenty minutes filling in everything instead of sharing a half-blank page. He used a real photo instead of a placeholder. He turned on the music. He enabled the wishes section, which meant guests had something to interact with rather than just read. He pinned the Maps link to the correct entrance of the venue, not just the building address.

The pricing point mattered too — not because guests see what you paid, but because when you know something is affordable, you don't feel pressure to cut corners. He added the gallery because he had the pictures and it wasn't going to cost him anything extra. That detail — the Coorg trip photos — was what made the group realise this relationship was serious and joyful and real, not just a formal announcement.

For anyone planning an engagement in India right now, whether it is a ring ceremony, a Mangni, a Sagai, or a Roka followed by a larger celebration: a proper digital invitation page is not the expensive part of what you are planning. It is one of the cheapest things you will do — and for most of your guests, especially the ones receiving it on WhatsApp, it is the first impression of your event. It is worth the twenty minutes.`,
      },
    ],
    checklist: [
      'Use a real, personal photo of the couple — a candid in good light works better than a formal portrait.',
      'Turn on background music — it creates atmosphere from the moment the page opens.',
      'Enable the guest wishes section so the invitation becomes interactive, not just informational.',
      'Add a Google Maps pin to the exact entrance of the venue, not just the street address.',
      'List both families\' names with equal prominence in the invitation.',
      'Include the ceremony schedule with the ring exchange timing clearly marked.',
      'Add a photo gallery — even two or three pictures from a trip together tells the story.',
      'Test the link on both Android and iPhone before forwarding to any group.',
    ],
    faq: [
      {
        q: 'What features should a digital engagement invitation have?',
        a: 'At minimum: both families\' names, couple\'s names, date, venue with a Google Maps link, and the ceremony schedule with the ring exchange timing. For a genuinely memorable invitation: a couple photo, background music, a guest wishes section, and a photo gallery. These are the features that separate a real digital invitation from a forwarded WhatsApp image. All of them are available on ShareInvite templates without any design skills needed.',
      },
      {
        q: 'How much does a digital engagement invitation cost in India?',
        a: 'On ShareInvite, premium engagement templates start at ₹499 — which includes all features: music, photo gallery, Google Maps, guest wishes, and a shareable WhatsApp link. For context, printed engagement card sets for a guest list of 200 typically cost several times this, without any of the interactive features or the ability to update details after sending.',
      },
      {
        q: 'Can guests leave wishes or respond through a digital engagement invitation?',
        a: 'Yes. ShareInvite includes a guest wishes section on every invitation page. Guests open the link, read the invitation, and can leave a message or blessings directly on the page. The host approves and displays these. It turns the invitation into a keepsake — a digital record of everyone\'s wishes from before the ceremony, which couples often revisit long after the event.',
      },
      {
        q: 'Is a digital invitation appropriate for a formal Indian engagement ceremony?',
        a: 'Completely appropriate, and increasingly the default. A well-designed digital engagement invitation carries the same formality as a printed card — both families\' names displayed correctly, traditional design, a ceremony schedule — with the practical advantages of a digital format: guests can navigate to the venue, revisit the schedule, and respond from the same link. Most families today use a digital link for the broad guest list and reserve printed cards, if any, for elder relatives who prefer a physical keepsake.',
      },
    ],
    links: [
      { label: 'Create a digital engagement invitation', href: '/engagement-invitation' },
      { label: 'Browse engagement invitation templates', href: '/templates' },
      { label: 'Engagement invitation wording guide', href: '/engagement-invitation-wording' },
      { label: 'Roka ceremony invitation ideas', href: '/blog/roka-ceremony-invitation-ideas-and-wording' },
    ],
  },

  'best-engagement-invitation-ideas': {
    intro: `Most engagement invitations get scrolled past in about two seconds. The couple's names appear, the date appears, and the guest moves on to the next notification in their WhatsApp. The invitations that actually get read — that get screenshotted and forwarded and talked about at the event itself — are doing something specific. They feel like they were made by someone who cared, not by someone who filled in a template and hit send.

After seeing thousands of engagement invitations created on ShareInvite, the pattern is consistent. It is not the most ornate designs that generate the most wishes and the most genuine responses. It is the ones where the couple uploaded a real photo, wrote one personal line, and used the right name for their ceremony. A couple from Pune who used a photo from their road trip to Coorg got three times more wishes than couples who used a formal portrait from a studio — not because the photo was technically better, but because it communicated something true about who they are.

This guide is about the ideas that actually work for engagement invitations in Indian families — across ceremony types, family structures, and how people actually share things on WhatsApp. It will also tell you what does not work, because there are a few common mistakes that are easy to avoid once you know what to look for.`,
    sections: [
      {
        heading: 'The first thing guests see — and why most invitations get it wrong',
        body: `The first thing a guest sees when they open an engagement invitation link is not the couple's names. It is the photo — or the absence of one. Invitations that use a placeholder graphic or leave the photo section blank read as incomplete, regardless of how well-written the rest of the content is. The photo communicates that the couple exists, that there is a real story here, and that this invitation was made with effort.

The second mistake is trying to say everything in the opening. Invitations that lead with three paragraphs of formal family lineage — "the esteemed family of [Father's name], son of [Grandfather's name], residing in [hometown] since [year]" — lose most guests before they reach the date and venue. This information has its place in a printed card handed to an elder, but on a phone screen, it becomes an obstacle. The opening of a digital engagement invitation should communicate: who is getting engaged, when, where, and one line that tells you this is worth attending.

The invitations that get read are specific. Not "Please join us for our joyous occasion" but "We are celebrating Neha and Arjun's Sagai on the 14th, and there will be music and rain" (it was a monsoon wedding in Pune — the hosts leaned into it). Guests who receive a specific, real-sounding line stop to read the rest. Guests who receive a generic opener put the phone down.`,
      },
      {
        heading: 'Ideas that work for Roka, Mangni, Sagai, and ring ceremonies',
        body: `Each of these ceremonies is different, and the invitation should reflect that — not just in the title line but in the tone and what it promises guests.

A Roka is intimate. Immediate family, maybe one or two close family friends. The invitation should feel accordingly personal — warm, not formal. You do not need a schedule with seven events. A Roka invitation that says "Please join both families for the Roka of Meera and Sameer on [date] at [venue], followed by a family lunch" has done its job. Long, elaborate Roka invitations feel mismatched with the occasion and can create the impression that the guest list is larger than it actually is.

A Mangni or Sagai is bigger. This is the formal ring exchange, and the guest list expands accordingly. The invitation should name both families prominently, include the ring exchange timing (guests plan around this moment, not the general start time), and include a dress code if families are coordinating colours. A Sagai where the bride's side is wearing coral and the groom's side is wearing blue-green needs that detail in the invitation — otherwise guests arrive in random outfits and the photos look chaotic.

A Nishchayathartham or ring ceremony in South Indian families has a distinct ceremonial weight. These invitations should carry both family names in full, acknowledge the auspicious occasion clearly, and include the muhurat time if one has been set. Leaving out the muhurat from a Nishchayathartham invitation is the equivalent of leaving out the venue — it is the most critical piece of timing information for guests who take the ceremony seriously.

In all cases, use the term your family actually uses. If your family says "Sagai," write Sagai. If they say "ring ceremony," write ring ceremony. Borrowing a more formal or more casual term from a template creates a small but noticeable disconnect that guests feel even if they cannot name it.`,
      },
      {
        heading: 'The photo, the music, and the one line that makes it personal',
        body: `The photo is the most important creative decision in a digital engagement invitation. Not because guests will not attend if the photo is bad, but because the photo is what people actually remember about the invitation. A month after the ceremony, ask any guest what the invitation looked like — they will describe the photo, not the font.

What works: a photo where both people look genuinely happy, in natural light, doing something that is normal for them. The Coorg road trip photo from the Pune couple. A photo from a chai stall in Banaras. A candid from a friend's wedding where the two of them are talking in the background. The photo does not need to be professionally shot — in fact, overly posed studio photos often work less well because they look like every other engagement announcement.

What does not work: photos taken in dim indoor light where faces are hard to see, photos where one person looks significantly more dressed up than the other (it looks like two different shoots spliced together), and stock-style photos where both people are looking at the camera with the same stiff smile. Guests can tell the difference between a photo that was taken for the invitation and a photo that was simply good enough to use.

Background music is the detail that most couples skip and then regret. An engagement invitation with music that actually matches the couple — not generic instrumental, but something they would actually listen to — creates an atmosphere from the moment the page opens. The invitation becomes an experience rather than a notice. Couples who pick music they love report that guests mention it at the event: "I loved what was playing when I opened the link." Couples who leave it on default or skip it report no such feedback, because there is no feedback to give.

The one line that makes it personal can be anywhere in the invitation — in the host note, in the couple's message, even in the music choice. It just needs to be true. "We met at a bad corporate event and now we're the best thing that happened to each other" is a real line from a real invitation on ShareInvite. Guests remember it because it sounds like a real person said it.`,
      },
      {
        heading: 'How to include both families without making the invitation look like a company memo',
        body: `The standard format for including both families is: "The family of [Bride's Name] — [Father's Name] and [Mother's Name] of [City] — along with the family of [Groom's Name] — [Father's Name] and [Mother's Name] of [City] — joyfully invite you." This format works. It is the clearest, most symmetrical way to give both families equal prominence, which matters to everyone involved even when nobody says so explicitly.

The mistake is when this section grows. Names of grandparents, uncles and aunts, siblings with their own titles — sometimes all appearing before the actual event details. This turns the top of the invitation into a family census that guests scroll through to find the date. Keep the host section to the parents and, if it is the tradition of the family, the paternal grandparents. Everyone else gets acknowledged through their presence at the event, not through the invitation text.

For families from different cities or different states, including the city matters. "The family of [Name], Jaipur" and "the family of [Name], Hyderabad" communicates that two families from different parts of India have come together, which adds context and warmth. For families of the same city, the city is less necessary and can be dropped.

When both families have distinctive last names or community backgrounds that guests would recognise — a Reddy family and an Iyer family at a cross-community engagement, for example — the names carry cultural information that guests find meaningful. Do not hide this behind generic phrasing. Let the names speak.

The couple themselves can appear either below the family names or leading the invitation, depending on who is driving the narrative. A parent-led ceremony typically has parents listed first with the couple below. A couple-led engagement where they are organising and paying for the event can reasonably lead with their own names and list parents below as "hosted with love by [parent names]." Both formats are appropriate — pick the one that accurately reflects who is actually throwing the event.`,
      },
      {
        heading: 'What the wish section does that nothing else in an invitation can',
        body: `There is a specific type of guest at every Indian engagement: the relative or close friend who cannot travel. The grandparent in another city. The childhood friend now living abroad. The college batch mate with a newborn at home. These people would come if they could, and they feel their absence from the event. The wish section in a digital engagement invitation is the only part of the invitation that reaches back to them.

When you enable the wishes section on an engagement invitation, something shifts. Guests do not just receive the invitation — they participate in it. They leave a message. And those messages accumulate before the event happens, so the couple and family can read through them at any point. At the event itself, a family member who flew in from the US and a cousin who could not leave work both appear in the same section, with equal presence. Distance stops being a reason for absence from the celebration.

The wish section also does something unexpected for the guests who do attend. Seeing that forty people have already left wishes before they arrive makes the event feel significant in a way that a headcount cannot. It is social proof of a different kind — not numbers, but names and faces and specific messages. "Your grandmother wrote something in Tamil, the whole family cried" is a real account from a ShareInvite engagement. The grandmother was in Coimbatore. She had never typed a wish on a digital platform before. The couple still have the message.

One practical point: approve wishes before they appear publicly on the page. The approval step takes thirty seconds, and it means the visible wish section stays warm and genuine rather than accidentally including a family dispute disguised as a blessing. Enable the section, but stay involved with it.`,
      },
    ],
    checklist: [
      'Use a real photo of the couple — a candid in natural light outperforms a formal portrait almost every time.',
      'Use the ceremony name your family actually uses: Roka, Mangni, Sagai, Nishchayathartham, ring ceremony.',
      'Include both families\' names with equal prominence — never list one as a footnote to the other.',
      'Add the ring exchange timing to the schedule separately from the general start time.',
      'Choose background music that actually matches the couple\'s taste, not a generic instrumental.',
      'Enable the wishes section so guests who cannot travel can still participate.',
      'Include a Google Maps link to the exact venue entrance, not just the address text.',
      'Write one personal line somewhere in the invitation that sounds like a real person said it.',
    ],
    faq: [
      {
        q: 'What is the difference between a Roka, Mangni, Sagai, and ring ceremony invitation?',
        a: 'A Roka is the earliest and most intimate ceremony — the family agreement moment, usually with only immediate family. The invitation should be warm and brief, reflecting the small gathering. A Mangni is the formal ring exchange, more widely celebrated, with a larger guest list and a fuller event schedule. Sagai is the North Indian equivalent of Mangni — a ring exchange that marks the official engagement, typically with both families present and a meal or event following. Nishchayathartham is the South Indian (primarily Telugu) formal engagement ceremony, often with a set muhurat time. Ring ceremony is the English term most urban families use and is interchangeable with Mangni or Sagai in casual usage. The key is to use the term your family actually uses — the invitation should feel like it came from your house, not from a template library.',
      },
      {
        q: 'Should the engagement invitation photo be a professional shoot or is a casual photo fine?',
        a: 'A casual photo in good natural light almost always outperforms a formal studio portrait for engagement invitations. The reason is simple: guests can tell when a photo is real, and a real photo communicates that the couple is genuinely happy together. A studio portrait can look stiff — both people dressed up, facing the camera in a specific pose — and it reads as an announcement rather than an invitation. The best engagement invitation photos are ones where both people are clearly comfortable: a trip photo, a festival photo, even a good phone photo from an ordinary day. If you have had a professional pre-wedding shoot, use the candid frames from that shoot rather than the posed ones.',
      },
      {
        q: 'How early should an engagement invitation be sent?',
        a: 'Send the engagement invitation 10 to 14 days before the ceremony for a local guest list. If family is travelling from another city — which is common for Indian engagements, especially when both families are from different states — send it 3 to 4 weeks in advance. The engagement is often a one-time date tied to family schedules, muhurat, or venue availability, so guests have less flexibility than they might for other events. Give out-of-city guests maximum lead time. A digital invitation can be created in an hour, so there is no reason to wait until a week before and then scramble.',
      },
      {
        q: 'Can both families\' names appear equally on the invitation when they are co-hosting?',
        a: 'Yes, and this is increasingly the norm. The format that works best for co-hosted engagements lists both families symmetrically: "The family of [Bride\'s Name] and the family of [Groom\'s Name] joyfully invite you." Each family can then be listed by the parents\' names below. Avoid the format where one family is listed fully and the other appears as a brief afterthought — guests notice, and so will the family whose names are smaller. For couples who are co-hosting independently of parents (planning and paying for the event themselves), leading with the couple\'s names and listing parents below as "hosted with love by [parent names]" is entirely appropriate and increasingly common for urban Indian engagements.',
      },
    ],
    links: [
      { label: 'Create a digital engagement invitation', href: '/engagement-invitation' },
      { label: 'Engagement invitation templates', href: '/templates' },
      { label: 'Engagement invitation wording guide', href: '/engagement-invitation-wording' },
      { label: 'Roka ceremony invitation ideas', href: '/blog/roka-ceremony-invitation-ideas-and-wording' },
    ],
  },

  'why-digital-invitations-are-growing-in-india': {
    intro: `The first time I noticed the shift was not in a survey or a market report. It was watching my neighbour's family — a joint household of three generations in a three-bedroom flat in Pune — trying to figure out what to do when the wedding hall changed six days before the ceremony. They had already printed and distributed three hundred physical cards. The new venue was on the other side of the city. The uncle who had done the card printing was not happy. The mother-in-law, who had hand-delivered forty cards to relatives in her colony, was even less happy. By the time everything was explained via individual phone calls, two elderly relatives still showed up at the wrong address on the wedding morning.

That story is not unusual. I have heard versions of it from hundreds of families since I started ShareInvite in 2026 — the venue that changed, the muhurat that shifted by an hour, the hall whose name was spelled wrong on a thousand printed cards. Physical invitations are beautiful objects and genuinely meaningful in Indian culture. But they are also fragile in ways that nobody talks about. The shift to digital is not happening because Indians have stopped caring about tradition. It is happening because the practical problems with physical cards were always real, and now there is a better option.

What I want to write about here is the actual texture of that shift — not the version that shows up in tech press releases about India's digital adoption rate, but the version I have observed in the way real families navigate a real cultural tension. How convenience came first, how culture caught up, and why the acceleration happened faster than even I expected when I started building this.`,
    sections: [
      {
        heading: 'It started with convenience, not culture',
        body: `Nobody decided that digital invitations were culturally acceptable and then switched. It happened the other way around. Families switched because something went wrong — a date change, a venue change, an out-of-city family member who needed directions at 7 AM on the wedding day — and the WhatsApp link was already there, already sent, already updateable. The cultural acceptance came quietly, after the fact, once enough people had experienced it working.

The Bengaluru tech worker whose parents are in Hyderabad and whose in-laws are in Chennai is the clearest case study of why geography drove this before anything else. Printed cards require someone to physically deliver them, or to post them, or to bring them on a visit. For families spread across cities — which is now a majority of urban Indian families in their thirties — the logistics of physically distributing a card to everyone who matters is genuinely complicated. You end up with a two-tier system where close local relatives get a proper printed card and distant relatives get a photo of the card on WhatsApp. Once you are already sharing the card on WhatsApp, the question becomes: why not share something better on WhatsApp?

The other driver was last-minute logistics, which are a structural feature of Indian event planning rather than an exception. Venues get double-booked. Muhurats get revised when the astrologer recalculates. Caterers change. The baraat timing shifts because the groom's side negotiated a later start. None of this is unusual — it is simply how events unfold when you are coordinating between multiple families, priests, venues, and caterers simultaneously. A printed card cannot handle any of these changes. A digital invitation, with the same link all guests already have, updates for everyone at once.`,
      },
      {
        heading: 'WhatsApp changed what an invitation could do',
        body: `Before WhatsApp became India's default communication layer, digital invitations made sense in theory but struggled in practice. Email felt impersonal to families for whom the invitation ritual carries relational weight. SMS had no visual space. Social media was public in ways that felt wrong for a private family ceremony.

WhatsApp changed this because it is already where Indian families live. It is where the family group chat is. It is where the wedding planning happens. It is where the venue directions get shared and where the out-of-city uncle asks what time to arrive. The invitation fits naturally into this context in a way it never did in email. When someone in the family group receives a wedding invitation link, they are receiving it in the same place where they already have a relationship with the sender. It does not feel like a notification from a platform. It feels like a message from family.

But WhatsApp did something else that is less obvious: it turned the invitation into a navigable object. A printed card is a static document. A WhatsApp link to a digital invitation is a door — guests tap it and get the full schedule, the venue address, a Google Maps pin, and a blessings section where they can leave a message. The card cannot do any of this. For guests who are driving to an unfamiliar wedding hall on a weeknight, that Maps pin is worth more than the design of the card itself. I have had families tell me the single feature that sold them on digital invitations was not anything visual — it was that guests stopped calling them for directions. When I hear that, I understand exactly what is actually happening here. It is not about going digital. It is about removing friction from a process that was full of it.`,
      },
      {
        heading: 'The moment families stopped worrying about whether digital was \'proper\'',
        body: `There was a period — roughly two to three years before ShareInvite launched — when the specific objection I kept hearing from families was not about cost or quality. It was about whether sending a digital invitation would read as cheap. As cutting corners. Whether the elders in the family, or the in-laws' family, would take offence at receiving a link instead of a card.

This is a real cultural concern and I want to take it seriously rather than dismiss it. In Indian family culture, the invitation is not just logistical communication — it is a statement of how much you value the guest. Printed cards have traditionally carried this weight because they represent effort, expense, and the physical act of delivery. An uncle who received a hand-delivered card with a box of sweets was being honoured in a way that a WhatsApp message could not replicate.

What changed was not that families decided to care less about this signal. What changed is that the quality of digital invitations crossed a threshold where they began to signal effort and care in their own right. A well-designed invitation page with a couple's photo, background music, a ceremony schedule laid out properly, and a guest wishes section is not a cheaper version of a card. It is a different kind of thing that carries its own markers of care. The moment a family elder received a digital invitation, opened it, saw a photograph of the couple and a wishes section with heartfelt messages already in it, and then left their own blessing — that is when the cultural objection faded.

In joint family households in cities like Ahmedabad and Kolkata where I have talked to families, the tipping point was often when the family elder themselves mentioned receiving a digital invitation they loved. Once the seventy-year-old grandmother says the invitation was beautiful, the younger generation stops worrying about whether digital is acceptable. The grandmother has already decided.`,
      },
      {
        heading: 'What the numbers from Indian weddings actually show',
        body: `I want to be careful here because the numbers that get cited in pieces about India's digital adoption are often national internet penetration figures that do not say anything specific about invitation behaviour. What I can share is what I have observed directly through ShareInvite.

The events where families adopt digital invitations fastest are not the most modern or tech-forward events. They are the most complex ones. Large North Indian weddings with five or six sub-events — Mehendi, Sangeet, Haldi, Baraat, Pheras, Reception — spanning three days and two venues benefit enormously from a single invitation page that lists everything in one place. Multi-event weddings are where the case for digital invitations is most obvious, because the alternative is a printed card that either crams everything onto one dense page or requires multiple separate cards.

The second pattern: families with significant out-of-city guests adopt digital faster. When a meaningful portion of your guest list is in another city and needs to book travel, a digital invitation with clear event-by-event schedules and venue Maps links does real work that a physical card cannot. Families whose weddings bring together guests from Mumbai, Delhi, and Hyderabad have a genuine logistical need that printed cards were never designed to meet.

The third pattern is the one that surprised me most: older guests are not the holdouts. The resistance to digital invitations, where it still exists, tends to come from the middle generation — parents in their fifties who are conscious of social signals and what the extended family will think. The younger generation wants digital for practical reasons. The older generation often embraces it once they experience it. The parents are the ones who need the most convincing, and they are usually convinced by seeing a well-made invitation rather than by any argument.`,
      },
      {
        heading: 'Why the shift accelerated faster than anyone expected',
        body: `When I started ShareInvite, I expected the adoption curve to be slow. Indian families are, reasonably, conservative about changing rituals that carry social and emotional weight. I built for a five-year timeline to reach the point where digital invitations would feel normal rather than novel.

It happened much faster than that. The acceleration had several causes, but the most significant was the pandemic. Two years of weddings conducted under guest limits and last-minute permission changes created a generation of Indian families who had direct experience of what happens when your physical invitations are useless the moment conditions change. Families who had printed cards that became invalid when guest caps changed, who had to manage real-time communication with hundreds of guests about whether the event was happening and in what form, learned in the most direct way possible why updateable digital invitations matter.

The second accelerant was the smartphone camera. As the quality of phone cameras improved and pre-wedding photography became a standard part of middle-class wedding culture, couples had genuinely beautiful images they wanted to share. A printed card could carry one photo, at low resolution, with significant printing cost. A digital invitation could carry a gallery of photos at full resolution, with background music, for a fraction of the cost. The invitation became a better canvas for the content families actually wanted to share.

The third accelerant was word of mouth within family networks — specifically, the moment when a guest at one event received a digital invitation they genuinely admired and then used the same platform for their own event. Digital invitations are shared via WhatsApp, which means every invitation is also a product demonstration to everyone who receives it. When someone receives a beautiful digital invitation for a cousin's wedding and thinks "I want this for mine," the discovery and adoption happen in the same moment. This is a fundamentally different marketing dynamic than any physical product, and it is why the growth has been faster than I modeled.

There is something else worth saying, which is less comfortable to state plainly: physical printed cards have been getting worse for a decade, not better. The economics of print shops in mid-sized Indian cities have deteriorated. Design quality has flatlined. Prices have gone up as volumes have gone down. The gap between what a good digital invitation can be and what an average physical card actually looks like has widened considerably. Families switching to digital are not just getting convenience — they are often getting a better-looking invitation than they would have gotten from the printer, at lower cost, with features the printer could never provide.`,
      },
    ],
    checklist: [
      'Send the invitation as a WhatsApp link, not an image file — a link stays navigable and updateable; an image gets buried in media.',
      'Include a Google Maps pin to the exact gate or entrance, not just the venue name — this is the feature guests use most on the wedding day itself.',
      'Enable the guest wishes section so the invitation becomes interactive and the host sees who has engaged with it.',
      'Update the invitation rather than resend it if details change — all guests who already have the link will see the update automatically.',
      'List every sub-event with timings on the invitation page: Mehendi, Sangeet, Baraat, Pheras, Reception — one page does all of it.',
      'Upload a couple photo or family photo to the invitation — the visual is what makes guests feel they received something personal rather than a logistics notice.',
      'Send a reminder two to three days before the event via the same link — most guests look up venue details on the day or the day before.',
      'For multi-city guest lists, mention the venue city in the WhatsApp message text itself so distant family can immediately assess whether travel is needed.',
    ],
    faq: [
      {
        q: 'Are digital invitations considered appropriate for formal Indian ceremonies like weddings and Griha Pravesh?',
        a: 'Yes, and increasingly they are the default for the broad guest list. Many families use a digital invitation for the full guest list and reserve printed cards, if any, for elder relatives who prefer a physical keepsake — but even this distinction is fading as digital invitations have improved in quality and as more elders have received and appreciated digital invitations from other family events. A well-designed digital invitation that displays both families\' names correctly, carries the full ceremony schedule, and includes the venue map communicates the same formality as a printed card.',
      },
      {
        q: 'Do Indian elders and older family members accept digital invitations?',
        a: 'Generally yes, and often with more enthusiasm than the middle generation. The practical features — the Maps link, the reminder message, the ability to revisit the invitation schedule — are often more useful to older relatives navigating an unfamiliar area than to younger guests. The resistance to digital invitations, where it exists, is usually in the fifty-to-sixty age group who are thinking about social signals to their own peer group. The resistance is better handled by showing them a well-made invitation than by arguing about the principle.',
      },
      {
        q: 'Why is WhatsApp the distribution channel for digital invitations in India rather than email?',
        a: 'Because WhatsApp is already where Indian families communicate. The family group chat, the wedding planning coordination, the last-minute logistics — all of it happens on WhatsApp. An invitation sent there arrives in the context of an existing relationship rather than in a cluttered inbox. It also arrives as a link that generates a preview card showing the invitation image and event title, which functions as a visual announcement in the group. Email has a place for corporate or distant contacts but has never been the primary way Indian families communicate for personal events.',
      },
      {
        q: 'What happens if event details change after the digital invitation has been sent?',
        a: 'This is one of the strongest practical arguments for digital invitations. Update the invitation page and the same link all guests already have will show the new information immediately — no resending, no explaining, no follow-up calls to everyone who received the old version. For a venue or muhurat change, send a short WhatsApp message to your groups noting what has changed and pointing to the same link for updated details. Guests who ignored the original link will often open it when they receive the update message, so the notification of a change also catches up stragglers who had not read the full invitation.',
      },
    ],
    links: [
      { label: 'Create a digital invitation', href: '/create' },
      { label: 'Wedding invitation templates', href: '/templates' },
      { label: 'Digital invitation guide', href: '/digital-invitation' },
      { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
    ],
  },

  'digital-wedding-invitation-vs-printed-cards': {
    intro: `The honest answer is that most Indian families in 2026 are not choosing between digital and printed. They are using both — but for completely different reasons. The printed card goes to grandparents, the groom's family elders, and the three or four relatives for whom receiving a physical card in an envelope is part of how they know they were genuinely invited. The digital link goes to everyone else, which is usually the other four hundred and fifty people on the list.

This is not a compromise. It is actually the more thoughtful approach, once you accept that the two formats are not doing the same job. A printed card is a cultural artifact. A digital invitation is a logistical tool. When families try to make one format do both jobs, they end up with either a printed card that no one can navigate from or a digital invitation that feels ceremonially thin.

What I want to do in this piece is be honest about what each format is actually good at — because most of what gets written on this topic is either defensive about printed cards or overselling digital. Having watched thousands of families work through this on ShareInvite since we launched in 2026, there are things I know about how this plays out in practice that do not show up in the comparison articles.`,
    sections: [
      {
        heading: 'The honest answer most comparison articles will not give you',
        body: `Printed cards are not obsolete. They are still the right choice for certain guests and certain relationships. An elder in the groom's family who has never received a digital invitation and for whom a hand-delivered card with sweets is the proper way to be invited — giving that person a WhatsApp link is a real cultural misstep. The card is not just informational; it is relational. It communicates that the hosts thought of this person specifically and made an effort on their behalf.

The mistake is extending this logic to the entire guest list. Printing four hundred cards costs real money — typically ₹15,000 to ₹40,000 for a mid-range job with courier or local delivery — and most of those cards serve the same function as the WhatsApp message that gets sent anyway. The card recipient reads it once, notes the date, and then searches their WhatsApp on the morning of the wedding for the venue address. The card is somewhere in a bag. The phone has the map.

The relevant question is not "digital or printed" but "which guests need a printed card and why." For most families, that list is genuinely small — fifteen to thirty people. Printing forty cards for the inner circle is a reasonable decision. Printing five hundred because tradition says so, while also sending a WhatsApp link to every single person on the list, is paying twice for the same communication.`,
      },
      {
        heading: 'When printed cards are actually the right choice',
        body: `Printed cards remain the right choice in specific situations, and it is worth naming them clearly rather than pretending the decision is always obvious.

Elders who are not on WhatsApp or do not use smartphones — and there are still many in this category, particularly in joint households in smaller cities — genuinely need a physical card. They cannot open a link. The card is not a nicety for them; it is the only format they can actually use.

Families where the invitation itself is part of the ceremony — where the act of delivering the card in person, sometimes with sweets or prasad, is how relationships are maintained — should not digitise this. The value of the invitation in these contexts is the delivery, not the information it contains.

High-end weddings where the card itself is a luxury object — embossed, with ribbon, in a custom box — are using the card as a statement about the scale of the occasion. A beautifully produced physical card communicates a level of investment that a digital link, however well-designed, cannot quite replicate. For this use case, the printed card is not a logistical choice; it is an aesthetic one.

Outside these specific situations, the case for printed cards is mostly sentimental rather than practical. Sentiment matters, but it is worth being honest about the cost of acting on it at scale.`,
      },
      {
        heading: 'What a digital invitation can do that a printed card never could',
        body: `The difference that matters most in practice is not the design. It is the Maps pin.

On the morning of a wedding, a meaningful percentage of guests — especially those who are not familiar with the venue area, or who are navigating in a new city — will call the host for directions. On a day that is already logistically complex, these calls are a tax on the host's attention at the worst possible time. A digital invitation with a Google Maps link pinned to the main gate of the venue eliminates almost all of these calls. I have had hosts come back to ShareInvite after their event specifically to mention this: "No one called us for directions. It was the first time."

The second thing a digital invitation can do that a printed card cannot is be updated after it is sent. When the wedding hall double-books a room and the ceremony location changes three days before the event — and this happens more often than anyone admits — a digital invitation is edited once and all five hundred guests have the correct venue the moment they open the link. The printed cards are already distributed with the wrong address. The host sends a WhatsApp message explaining the change. Half the guests miss the message. Some arrive at the wrong location.

The third thing is the guest wishes section. A printed card generates no response — it is a one-way communication. A digital invitation page where guests can leave a blessing or a message creates a record that hosts and couples return to for years. For guests who cannot attend — the relative who is abroad, the friend who is sick, the elderly family member who cannot travel — the wishes section is the only way to participate in the ceremony. Families consistently tell us this feature, which most people overlook when creating an invitation, turns out to be one of the things they value most after the event.`,
      },
      {
        heading: 'The cost comparison — and why the real number surprises most families',
        body: `The visible cost of printed cards is the printing and delivery. For a wedding of three hundred guests, mid-range printed cards with envelopes, local courier or delivery, and design typically cost between ₹20,000 and ₹50,000. Premium cards — thick paper, embossing, box packaging — can cost significantly more.

But there is a hidden cost that rarely gets calculated: the time and coordination involved in printing, distributing, and tracking down who has and has not received a card. In joint households where the responsibility is split between family members, this coordination is real labour. The cousin who is supposed to deliver forty cards to relatives in another neighbourhood. The aunt who was going to bring cards to her colony but forgot. The ten cards that need to be posted to out-of-city family, requiring someone to go to the post office. This time has a cost even if it is not a line item.

A digital invitation on ShareInvite starts free. Premium templates — the ones that look genuinely good — start at ₹499. At that price point, the comparison to printed cards is not competitive; it is absurd. The premium invitation costs less than the printing cost for ten printed cards, can be shared with any number of guests, and updates automatically if anything changes.

What most families end up doing is a hybrid: twenty-five to thirty printed cards for the inner circle, costing ₹2,000 to ₹5,000 with quality printing, and a ShareInvite link for everyone else. This combination costs a fraction of a full printed run and does the communication job better for ninety percent of the guest list.`,
      },
      {
        heading: 'How most Indian families are actually solving this in 2026',
        body: `The pattern I observe most consistently in 2026 is the hybrid approach — not as a compromise, but as a deliberate strategy that uses each format for what it is best at.

A typical Bengaluru wedding: twenty to thirty printed cards, hand-delivered or couriered, for the closest family elders on both sides. A ShareInvite link shared across twelve WhatsApp groups covering the rest of the guest list. The same link serves as the primary reference for venue navigation on the day. After the event, the wishes section has 140 messages — relatives who came, relatives who could not come, a childhood friend who is now in Canada.

This approach also solves the specific Indian problem of multiple events. A five-event wedding — Mehendi, Sangeet, Haldi, Ceremony, Reception — is very difficult to communicate cleanly on a single printed card without making it look cluttered. A digital invitation page handles multiple events naturally, with each event listed clearly with its own time and venue. Different guests attend different events; they can check the schedule rather than calling to ask which event they are supposed to attend.

The families who are still printing five hundred cards and also sending a WhatsApp link are typically the ones who have not recalibrated since the last time they planned a large event. Once they see the cost breakdown and talk to a family that did the hybrid approach, the conversation changes quickly. It is hard to argue for spending ₹40,000 on something that fifty percent of recipients lose before the event day.`,
      },
    ],
    checklist: [
      'Identify the 20–30 guests who genuinely need a printed card — elders, inner circle, those without smartphones.',
      'For everyone else, create a ShareInvite digital invitation with the complete schedule, venue map, and wishes section.',
      'Always pin Google Maps to the main gate or entrance, not the building centre — especially for new venues.',
      'Enable the guest wishes section — it is what guests remember most after the event.',
      'Test the WhatsApp link preview before sharing to any group.',
      'If anything changes (venue, timing), update the digital invitation immediately — the same link updates for all guests.',
      'Send a reminder reshare of the link 2 days before the event — this is when most guests look up the venue.',
      'Budget for 20–30 quality printed cards rather than 500 mid-range ones — the savings are significant.',
    ],
    faq: [
      {
        q: 'Is it considered rude to not send a printed card to guests?',
        a: 'For most guests, no — a well-designed digital invitation link on WhatsApp is now widely accepted across urban and semi-urban India. The exception is elderly family members for whom a physical card is part of how they understand being properly invited. For these specific guests — typically fifteen to thirty people in a family — a printed card is still the appropriate choice. For everyone else, a premium digital invitation communicates as much care and effort as a printed card, especially when the design is polished and the content is complete.',
      },
      {
        q: 'What does a digital wedding invitation actually cost in India?',
        a: 'On ShareInvite, a digital wedding invitation starts free. Premium templates — the ones that look genuinely good on WhatsApp — start at ₹499 as a one-time cost. This covers unlimited guest access, all features (Maps, music, gallery, wishes, RSVP), and the ability to update the invitation if details change. Compare this to printed cards: a mid-range print run of three hundred cards typically costs ₹15,000 to ₹40,000 with design and delivery.',
      },
      {
        q: 'Can I do both — send printed cards and a digital invitation?',
        a: 'Yes, and this is what most families do. A typical approach is twenty-five to thirty printed cards for elders and inner circle, and a ShareInvite link for everyone else. The digital invitation does the practical work — navigation, schedule reference, updates — while the printed cards carry the cultural and relational weight for the guests who value them. The total cost of this hybrid approach is usually lower than a full printed run.',
      },
      {
        q: 'What happens if I need to change the venue or timing after sending?',
        a: 'With a digital invitation, you update it once on ShareInvite and all guests see the correct information the next time they open the link. No resending required. With printed cards, there is no clean solution — you have to send a WhatsApp message or make calls explaining the change, and some guests will still arrive with the wrong information. Last-minute changes to venue or timing are common in Indian event planning, which is one of the strongest practical arguments for digital invitations.',
      },
    ],
    links: [
      { label: 'Free digital wedding invitation', href: '/wedding-invitation' },
      { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
      { label: 'Wedding invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
    ],
  },

  'online-rsvp-guide-for-indian-weddings': {
    intro: `RSVP at an Indian wedding is not what it looks like in American films — a card mailed back with a polite checkbox. It is a running negotiation that happens in WhatsApp messages, phone calls, family group chats, and through intermediaries over a period of weeks. "Tell didi we are definitely coming but Rahul might not make it" is a completely normal RSVP at an Indian wedding. So is a family of seven that RSVPs as "definitely yes" and shows up as twelve, or confirms two and sends none.

This is not a complaint. It is just the reality of how Indian family event attendance works, and any guide to RSVP for Indian weddings has to start from this reality rather than from the assumption that guests respond in a linear, predictable way. The tools and systems that work for Western event RSVPs mostly do not work here, because they are built on different assumptions about how people commit to attending things.

What does work — what I have seen work repeatedly across hundreds of weddings on ShareInvite — is a combination of digital wishlist-style response, WhatsApp-native sharing, and a host mindset that treats RSVP as a conversation rather than a form. Here is what that actually looks like in practice.`,
    sections: [
      {
        heading: 'Why standard RSVP tools fail for Indian weddings',
        body: `Most RSVP tools are built for the Western event paradigm: send an invitation, receive a yes/no response per person, close the list on a specific date, give the venue a headcount. This paradigm assumes that guests know whether they are attending, decide individually, and communicate their decision directly to the host. None of these assumptions hold cleanly for Indian family events.

Indian wedding attendance is often a family-level decision, not an individual one. When one family member cannot attend, the family may still send a representative. When one family member decides to come, the guest count may quietly expand by two or three. Extended family decisions ripple through sub-groups — the question "are Chacha's family coming?" does not have a single answer until about forty-eight hours before the event. Building a headcount plan around firm RSVP responses leads to catering that is consistently off.

The second failure: most RSVP tools require guests to click a link and fill out a form. For Indian wedding guests — many of whom will simply respond in WhatsApp chat rather than through any dedicated system — this adds a step that most people skip. The host then has to chase form responses while also managing WhatsApp confirmations, which doubles the work rather than reducing it.

What Indian families actually need from an RSVP system is something that captures intent from the people who will use it, gives a directional sense of attendance, and does not create overhead for guests who prefer to communicate in the way they already do.`,
      },
      {
        heading: 'How the guest wishes section works as a soft RSVP',
        body: `The guest wishes section on a ShareInvite invitation page is not formally an RSVP mechanism — but in practice, it functions as one. When a guest opens the invitation and leaves a message ("We will definitely be there — so excited for both of you"), the host knows that guest has seen the invitation and is planning to attend. When a guest leaves a message that says "We will try to make it — wishing you all the happiness in the world," the host knows there is uncertainty. Both of these are more useful than no response.

This soft-RSVP function works because it fits how Indian guests naturally communicate. Leaving a blessing or a congratulatory message is not a formal commitment; it is a relational act. Guests who would not fill out an RSVP form will leave a wishes message because the act of leaving a message is culturally natural. The host gets a view of who has engaged with the invitation, which is a reasonable proxy for attendance intent.

For the host, the wishes section gives something valuable: a list of guests who have seen and responded to the invitation, versus those who have not. This is the most practically useful thing a digital invitation can offer for planning purposes — not a headcount, but a signal of who is paying attention. Follow-up calls can then be targeted to the guests you have not heard from rather than sent broadly.`,
      },
      {
        heading: 'What actually works for getting attendance numbers',
        body: `The most effective RSVP strategy for an Indian wedding is a combination of three things: the digital invitation with a wishes section that captures soft confirmation, a WhatsApp message to each family unit asking directly for a count, and a final confirmation call to caterers and venue based on experience rather than firm numbers.

The WhatsApp message asking for counts should be sent to family units, not individuals. "Hi Sharma Uncle, will you all be coming for the reception? How many in your family should we count?" works better than a mass RSVP request because it is addressed to the decision-maker for that family unit. The response may not be exact — "maybe five or six of us" — but it is directional.

One practical approach used by hosts who manage large Indian weddings well: add ten to fifteen percent to the confirmed headcount for catering purposes. Indian wedding caterers know this; they build their own buffer into their estimates. If you tell a caterer three hundred guests and you are genuinely planning for three hundred, you will run short on food. If you tell them three hundred and they plan for three hundred and twenty, you will be close. The "final headcount" for an Indian wedding is always an estimate with a range, and the experienced hosts budget accordingly.

The digital invitation helps most not with the headcount itself but with reducing the volume of individually fielded questions. A guest who knows the venue, schedule, and details from the invitation page generates fewer WhatsApp messages to the host. This frees up the host's attention for the family-unit confirmation conversations that actually matter.`,
      },
      {
        heading: 'Managing the out-of-city guest problem',
        body: `Out-of-city guests require a different RSVP conversation entirely, because their confirmation involves travel planning. A family in Kolkata attending a wedding in Pune needs to book flights or train tickets, arrange accommodation, and coordinate multiple people's schedules. Their RSVP timeline is different from a local guest — they are likely to commit or decline earlier, because they have to, and you need to know earlier because you may be arranging accommodation.

Send the digital invitation to out-of-city guests at least three to four weeks before the event. For destination weddings or events involving significant travel, six weeks is appropriate. Include in the WhatsApp message something that signals you know travel is involved: "We know you would need to plan the trip — let us know if you need any help with accommodation." This is not just hospitality; it is an invitation to begin the RSVP conversation.

For guests staying with the host family, the invitation page can include a note about accommodation — "We have space for some guests; please reach out if you need to stay" — which makes the logistics transparent without putting it awkwardly in the host's individual messages. Knowing who is travelling and whether they need accommodation is the most practically important RSVP information for planning purposes, separate from the total headcount.`,
      },
      {
        heading: 'The reminder — and when to send it',
        body: `Send a reminder two to three days before the event. Not one week before — that is too early, and guests have not started thinking about weekend logistics yet. Not the day before — by then, people who need to arrange travel or childcare have already made their decisions. Two to three days out is when guests are actively planning the week ahead and will actually process a reminder.

The reminder does not need to be elaborate. Re-forward the same ShareInvite link with a short message: "Just a reminder for [Bride] and [Groom]'s wedding on [Day] at [Venue]. Here is the link for schedule and directions — see you there!" Three lines. The link. Done. Guests who have been meaning to check the venue details do it now. Guests who were on the fence make their final decision.

For large guest lists, the reminder across all WhatsApp groups takes fifteen minutes with a digital invitation — it is a copy-paste of the same message. The logistics of reminder-sending with physical cards is significantly more complex, involving individual calls or messages to each family unit. The digital reminder is so much less friction that many hosts send it earlier and more specifically — a personal message to key guests they are most hoping to see, alongside the general group broadcast.`,
      },
    ],
    checklist: [
      'Enable the guest wishes section — it serves as a soft RSVP that fits how Indian guests communicate.',
      'Send the invitation to out-of-city guests 3–4 weeks before the event.',
      'Follow up with a WhatsApp message to each family unit asking for a directional headcount.',
      'Tell your caterer a number ten to fifteen percent above your confirmed headcount.',
      'Include accommodation info in the invitation page for guests who need to travel.',
      'Send a reminder 2–3 days before with the same ShareInvite link.',
      'Use the wishes section to identify who has not responded, then follow up with those specific guests.',
      'Build your headcount plan around ranges, not exact numbers — Indian wedding attendance is always directional.',
    ],
    faq: [
      {
        q: 'Should I use a formal RSVP system for an Indian wedding?',
        a: 'Formal RSVP tools built for Western events — response cards, form submissions, dedicated RSVP apps — tend to add friction without improving accuracy for Indian weddings. The more effective approach is the ShareInvite wishes section as a soft RSVP, combined with a targeted WhatsApp message to each family unit asking for a count. This matches how Indian families actually communicate and gives you more actionable information than a form.',
      },
      {
        q: 'How do I get a headcount for catering when people do not confirm?',
        a: 'Indian wedding caterers plan for buffer — most quote for the stated number and prepare for ten to twenty percent more. Give your caterer a number slightly above your directional estimate and let them build their buffer on top of that. Never give a caterer your "minimum possible" number for a large Indian wedding; the catering math does not work in your favour. Indian event catering has evolved around exactly this variable-attendance reality.',
      },
      {
        q: 'What is the best way to remind guests about a wedding in India?',
        a: 'Re-forward the same ShareInvite invitation link in a short WhatsApp message two to three days before the event. This is when guests are actively planning the week ahead. The reminder message should be brief — three lines, the link, and done. For your closest guests and family, send a personal message rather than only a group broadcast. Guests who receive a personal reminder from the host are more likely to attend and arrive on time.',
      },
      {
        q: 'How far in advance should I send wedding invitations in India?',
        a: 'For local guests, 14–21 days before the wedding is standard. For guests who need to travel from another city, send 3–4 weeks in advance. For destination weddings or events requiring significant travel and accommodation planning, 6 weeks gives guests enough time to book and coordinate. A digital invitation makes it easy to send in batches — out-of-city guests first, local guests a week later — without creating separate materials for each group.',
      },
    ],
    links: [
      { label: 'Create a digital wedding invitation', href: '/wedding-invitation' },
      { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
      { label: 'Online RSVP platform', href: '/online-rsvp' },
      { label: 'Browse invitation templates', href: '/templates' },
    ],
  },

  'budget-friendly-wedding-invitation-ideas': {
    intro: `The invitation budget conversation at most Indian wedding planning sessions goes something like this: the family sits down, someone mentions a figure, someone else says that is not enough for good quality, and then the number quietly doubles before anything specific has been decided. This happens partly because invitation costs are genuinely opaque — most families do not know what things actually cost until they are already talking to a printer — and partly because the invitation is the first public-facing piece of the wedding, and no one wants to look like they cut corners on the first impression.

The good news is that the options available in 2026 make it genuinely possible to have a high-quality wedding invitation experience at a fraction of what families were spending five years ago. Not because anyone lowered their standards, but because digital invitations changed the economics of the whole category. The budget-friendly path now is not to compromise on quality; it is to allocate the invitation budget more carefully between what guests actually notice and what they do not.

Having worked with thousands of families on ShareInvite, I can tell you what guests notice. It is not the weight of the paper. It is not whether the envelope has a wax seal. It is whether the invitation tells them where to go, when to be there, and whether it feels like it was made by someone who cared. All of that is achievable without the budget that most families assume they need.`,
    sections: [
      {
        heading: 'Where the invitation budget actually goes — and where it does not need to',
        body: `Most Indian wedding invitation budgets are allocated across three things: design, printing, and distribution. Of these, distribution is the largest hidden cost — not in direct money but in time and coordination. Getting five hundred printed cards into the right hands before a wedding involves personal deliveries, couriers, and postage, plus the follow-up to confirm receipt. This coordination cost rarely appears in the invitation budget but is real.

Design is the second area where families overpay for things that do not create value. A custom hand-lettered design on thick cotton paper costs significantly more than a well-chosen template. For the majority of guests who will see the card once, quickly, and then tuck it into a drawer, the difference in design investment is invisible. The guests who care about the design are usually the couple themselves and a small circle of close family — not the four hundred people receiving the card.

Printing itself is where the cost differences are most visible and most negotiable. The range between budget printing and premium printing is enormous. A basic offset print run costs dramatically less than letterpress or foil-stamped cards, but most guests receiving the basic print cannot tell the difference unless they are specifically looking for it. The tactile premium of a luxury card is meaningful for perhaps twenty guests. For the other four hundred and eighty, it is invisible.

The budget insight that consistently surprises families: the per-card cost of printing is much lower for the elders-and-inner-circle list than they expect, because that list is short. Twenty-five beautiful printed cards cost a fraction of five hundred mid-range ones — and look better.`,
      },
      {
        heading: 'The real cost of a digital invitation — and what that frees up',
        body: `A premium digital invitation on ShareInvite costs ₹499. That is the complete cost: design, distribution, unlimited guests, all features. No courier. No printing. No envelope stuffing. The same link goes to four hundred and fifty guests simultaneously.

What does ₹499 deliver? A professionally designed invitation page with the couple's names in premium display typography, a photo gallery, background music, a Google Maps link, a ceremony schedule, a countdown timer, a guest wishes section, and a shareable WhatsApp link that generates a preview card when forwarded. The WhatsApp preview — the thumbnail image and title that appears before guests open the link — is often more visually striking than a WhatsApp-forwarded image of a printed card.

What this frees up in the invitation budget is significant. If a family was planning to spend ₹30,000 on a full print run for three hundred guests, shifting to a digital invitation for the broad guest list and a thirty-card premium print run for the inner circle costs roughly ₹5,000 to ₹8,000 total — a saving of ₹22,000 to ₹25,000. That money can go toward catering, decor, photography, or just back into the family's budget. It does not need to go anywhere; the invitation is genuinely handled.

For families planning their first major event on a real budget — younger couples, families without the multi-generation wedding planning infrastructure that some joint households have — this math changes the conversation entirely. The invitation is no longer a large line item.`,
      },
      {
        heading: 'Budget ideas that actually work — and the ones that look cheap',
        body: `There are budget moves that save money without any visible compromise, and there are budget moves that guests notice in an unflattering way. Knowing which is which saves families from false economies.

Budget moves that work: Digital invitation for the bulk of the guest list (guests genuinely prefer the navigability). A shorter, well-designed printed card for the inner circle (twenty to thirty cards, quality over quantity). A simple but clearly readable WhatsApp sharing message rather than an elaborate image file (image files degrade on forwarding; links do not). Choosing a pre-designed digital template over a custom-built one (the best ShareInvite templates are better than most custom work in the same price range).

Budget moves that look cheap: Low-resolution printed cards where the text is hard to read. Cards printed on thin paper that feel flimsy. Photocopy-quality printing. A digital invitation with a placeholder photo or no photo at all. A WhatsApp image file so compressed from forwarding that the text is illegible. These are the things guests notice, even if they do not say so.

The general principle: cut on quantity, not quality. Thirty beautiful cards cost less than three hundred mediocre ones. One well-designed digital invitation reaches five hundred people for ₹499. The budget path is not to make a worse invitation for more people — it is to make a better invitation and distribute it more efficiently.`,
      },
      {
        heading: 'What couples overlook — the small investments with the biggest impact',
        body: `The single highest-impact element of any digital invitation is the photo. Families spend significant money on print design and then use a blurry phone photo from two years ago. The photo budget should be zero — but the photo choice should be deliberate. A good phone photo in natural light, with both people looking at ease, does more work than a professional studio portrait shot in flat indoor lighting. The couples who take twenty minutes to find the right photo before publishing their invitation consistently get more wishes, more responses, and more comments at the event.

Background music is the second overlooked investment. On ShareInvite, adding music to an invitation costs nothing extra — it is included in the feature set. But most couples either skip it or use the default option. An invitation that plays a song the couple actually loves, from the moment it opens, creates an experience rather than just displaying information. Guests who open an invitation and hear music that surprises or moves them comment on it. Guests who open an invitation with no music comment on nothing.

The wishes section deserves planning, not an afterthought. Enabling it is a checkbox; actually getting guests to leave wishes requires that the host mention it in the sharing message. "Use the link below to see all the details — and leave a blessing for [Couple] on the page" doubles the number of wishes received compared to just sending the link. This takes five extra words in the WhatsApp message and costs nothing.`,
      },
      {
        heading: 'A realistic invitation budget breakdown for Indian weddings in 2026',
        body: `For a wedding of three hundred guests, here is what a well-considered budget allocation looks like in 2026, based on patterns I see work consistently.

Digital invitation for the broad guest list (₹499): This covers everyone who will receive the invitation primarily through WhatsApp — friends, work colleagues, extended family, neighbours. All features included. Shareable to any number of guests for this flat cost.

Premium printed cards for the inner circle (₹3,000–₹6,000): Twenty-five to thirty cards, well-printed on good paper, with envelopes. These go to immediate family on both sides, close elders, and the handful of people for whom a physical card is culturally the right choice. At this quantity, a good printer can produce quality work for this range.

Delivery of printed cards (₹0–₹1,500): For a list of twenty-five to thirty, most can be hand-delivered by family members visiting relatives over the two-week period before the wedding. A small number may need to be posted, which adds minimal cost.

Total invitation spend: ₹4,000–₹8,000 for a three-hundred-guest wedding. Compare this to ₹25,000–₹50,000 for a full printed run with delivery. The difference is real money that shows up in the wedding budget elsewhere.

The families who feel most at peace with their invitation spending, in my experience, are not the ones who spent the least — they are the ones who understood what they were buying. When you know that the ₹499 digital invitation is reaching everyone who will actually use the map and schedule, and the ₹5,000 printed cards are going to the thirty people for whom the physical card carries meaning, the spend feels intentional rather than squeezed.`,
      },
    ],
    checklist: [
      'Print only for the inner circle — twenty-five to thirty cards is almost always enough for the people who truly need a physical card.',
      'Use a premium digital template (₹499) for the broad guest list — it looks better than a forwarded image file.',
      'Spend time choosing the right photo — it is free and has the highest impact on how the invitation is received.',
      'Enable background music and pick something the couple actually listens to, not the default.',
      'Mention the wishes section explicitly in the WhatsApp sharing message to increase guest participation.',
      'Pin the Google Maps link to the main gate, not the building — this is the detail guests use most on the event day.',
      'Send out-of-city guests the invitation 3–4 weeks early — this is the group most likely to need lead time.',
      'Budget for the reminder, not just the initial send — resharing the link two days before is the most effective second touch.',
    ],
    faq: [
      {
        q: 'How much should a wedding invitation cost for 300 guests in India?',
        a: 'A well-allocated invitation budget for 300 guests in 2026 is ₹4,000 to ₹8,000. This covers a ShareInvite premium digital invitation (₹499) for the broad guest list and 25–30 quality printed cards (₹3,000–₹6,000) for elders and inner circle. A full printed run for 300 guests typically costs ₹20,000–₹50,000 with design and delivery. The digital-plus-selective-print approach costs significantly less and serves the guest list better.',
      },
      {
        q: 'Is it acceptable to only send digital wedding invitations?',
        a: 'For most guests, yes — a digital invitation on ShareInvite is widely accepted and often preferred because of the navigation and schedule features. The guests who specifically need a printed card are usually a small group: elderly family members without smartphones, and close relatives for whom a physical card is culturally meaningful. For those 20–30 people, a printed card is worth printing. For everyone else, a digital invitation communicates as much care at a fraction of the cost.',
      },
      {
        q: 'What are the must-have elements of a budget wedding invitation?',
        a: 'The non-negotiables are: a clear photo of the couple, the ceremony schedule with all event timings, the venue address with a Google Maps pin, and a shareable WhatsApp link that generates a proper preview card. Background music and a guest wishes section are low-cost additions that significantly improve how the invitation is received. Everything else — custom typography, elaborate design, premium packaging — is optional and often invisible to most guests.',
      },
      {
        q: 'How do I make a wedding invitation look expensive on a budget?',
        a: 'The three things that make a wedding invitation look expensive without actually being expensive: a great couple photo (free, requires only good light and a good moment), a premium template with quality typography (₹499 on ShareInvite), and background music that fits the mood (included). The design variables that feel premium to guests are these three things — not paper weight or envelope type, which guests assess briefly and forget. A digital invitation that does these three things well consistently reads as high-quality across all guest demographics.',
      },
    ],
    links: [
      { label: 'Free digital wedding invitation', href: '/wedding-invitation' },
      { label: 'Wedding invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
      { label: 'Digital vs printed invitations', href: '/blog/digital-wedding-invitation-vs-printed-cards' },
    ],
  },

  'best-digital-wedding-invitation-templates-in-india': {
    intro: `Choosing a wedding invitation template is one of the first visual decisions a couple makes together — and it sets the tone for everything that follows. The template signals to guests whether your wedding will be traditional, cinematic, royal, or modern. Here is a complete guide to the five wedding invitation templates on ShareInvite, how each one works visually, which couple type it is best for, and how to choose based on your actual wedding style.`,
    sections: [
      {
        heading: 'Elegant Wedding template — clean, timeless, versatile',
        body: `The Elegant Wedding template is the most universally suitable of ShareInvite's wedding templates. It uses clean display typography, a warm ivory and gold colour palette, and a layout that presents the couple's names and wedding details with maximum readability. There is no heavy ornamentation — just the right typographic weight and spacing. This template works best for couples who want a premium-feeling invitation without a specific thematic commitment: it fits equally well for a Brahmin wedding in Chennai, a Punjabi reception in Delhi, or a destination wedding in Udaipur. It is the template to choose when both families have different aesthetic preferences and you need something that pleases everyone. View it at /templates/elegant-wedding.`,
      },
      {
        heading: 'Indian Wedding template — traditional motifs, festive warmth',
        body: `The Indian Wedding template is built for families who want the invitation to feel specifically and proudly Indian. It uses traditional motifs — intricate borders, floral patterns, and warm reds and golds — that echo the aesthetic of physical printed cards, but with the interactivity of a digital page. This template is ideal for weddings with a traditional ceremonial focus: Muhurt-led schedules, joint-family hosting, and guest lists where elders and traditional family members are a significant presence. The design communicates respect for tradition without feeling dated. It works especially well for North Indian joint-family weddings and South Indian weddings where the ceremonial sequence is the centrepiece. View it at /templates/indian-wedding.`,
      },
      {
        heading: 'Cinematic Night template — dark, dramatic, for modern couples',
        body: `The Cinematic Night template is ShareInvite's most visually striking option — a dark, deep-navy or near-black background with gold and white typography that creates a dramatic, film-poster aesthetic. This is the template for couples who want their wedding to feel like an event — not just a ceremony. It is particularly popular with younger, urban couples in cities like Mumbai, Bengaluru, and Hyderabad who are planning weddings with professional photography, curated decor, and a reception that functions as a party. The dark background makes couple photos pop dramatically, which is why it works best when you have a high-quality pre-wedding or engagement shoot photo to upload. It also works well for evening and night-time receptions. View it at /templates/cinematic-night.`,
      },
      {
        heading: 'KGF Wedding template — bold, filmy, unapologetically Indian',
        body: `The KGF Wedding template draws on the cinematic universe of the blockbuster franchise — bold typography, high-contrast gold-on-black or gold-on-dark palettes, and a visual energy that is louder and more assertive than the other templates. This is the template for couples who want their wedding invitation to make a statement. It is most popular for large, high-energy North Indian and South Indian weddings where the celebration is big and the family has a sense of humour about leaning into the filmy aesthetic. It pairs naturally with baraat-heavy Punjabi weddings and grand South Indian reception events. Guests who receive this invitation know immediately what kind of celebration they are in for — and they are usually delighted. View it at /templates/kgf-wedding.`,
      },
      {
        heading: 'Royal Deco template — art deco elegance, regal and refined',
        body: `The Royal Deco template uses art deco aesthetics — geometric patterns, gold linework, symmetrical layouts, and a refined typographic hierarchy — to create an invitation that feels aristocratic without being traditional in the Hindu ceremonial sense. This template is ideal for couples planning a palace wedding, a heritage hotel reception, or any event where the setting is grand and the aesthetic is opulent rather than folksy. It is the only ShareInvite template that works equally well for Hindu, Muslim, Christian, and secular weddings because its visual language is architectural rather than religious. For Muslim Nikah ceremonies with a formal reception, the Royal Deco template provides the right formal elegance. View it at /templates/royal-deco.`,
      },
      {
        heading: 'How to choose based on your wedding style',
        body: `The simplest decision framework: if your wedding is traditional and family-led, choose Indian Wedding or Elegant Wedding. If it is modern and couple-led, choose Cinematic Night or Royal Deco. If it is large, energy-filled, and unapologetically filmy, KGF Wedding is your template. The second filter is your couple photo — do you have a striking pre-wedding shoot with dramatic lighting? That photo belongs on Cinematic Night or KGF. Do you have a warm, natural-light portrait? Elegant Wedding or Indian Wedding will showcase it better. The final filter is your family: who is the primary audience of the invitation? If older family members and elders are the majority, a familiar-feeling warm template will land better than a dark cinematic one.`,
      },
    ],
    checklist: [
      'Preview each template on your phone before choosing — what looks good on a laptop may differ on mobile.',
      'Upload a high-quality couple photo that suits the template style (dark photo for dark templates, bright for warm templates).',
      'Fill in the complete ceremony schedule before finalising — check how it looks in your chosen template.',
      'Test the Google Maps link in the invitation before sharing.',
      'Check the WhatsApp preview card (link thumbnail) by pasting the link in a test chat.',
      'Share the invitation link with one trusted person to review before the full send.',
    ],
    faq: [
      {
        q: 'Can I preview templates before creating my invitation?',
        a: 'Yes. ShareInvite shows live previews of all templates at /templates before you begin creating. You can browse each template in full detail — including the mobile layout — and switch between templates when filling in your invitation details. If you change your template after entering details, your content is preserved and simply restyled in the new template, so you are not starting over.',
      },
      {
        q: 'Are premium templates worth it?',
        a: 'ShareInvite\'s most popular templates — including Cinematic Night and Royal Deco — are available as part of the paid plan. For a wedding where visual presentation matters to the couple and guests, a premium template is worth the upgrade: the design quality is noticeably higher than free alternatives, and the WhatsApp preview card looks professional rather than generic. The cost is minimal compared to the printing budget for physical cards, and the invitation is shared with hundreds of guests. Think of it as the design investment for your primary digital communication piece.',
      },
      {
        q: 'What customisation is possible across all templates?',
        a: 'All ShareInvite templates support: couple names, wedding date and time, venue name and address with Google Maps, full ceremony schedule (unlimited events with timings), a photo gallery of up to several photos, background music, a custom personal message from the hosts, and a guest wishes section. The colour palette and typography are fixed per template to maintain visual coherence, but all content fields are fully customisable. You cannot currently change individual fonts or colours within a template — choose the template whose overall palette matches your wedding theme.',
      },
    ],
    links: [
      { label: 'Free digital wedding invitation', href: '/wedding-invitation' },
      { label: 'Wedding invitation templates', href: '/templates' },
      { label: 'Create your invitation', href: '/create' },
      { label: 'Indian wedding invitation wording', href: '/blog/indian-wedding-invitation-wording-for-whatsapp' },
    ],
  },
}
