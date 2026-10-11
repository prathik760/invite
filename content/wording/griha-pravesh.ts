import type { WordingSectionData } from '@/components/wording/WordingSection'

/**
 * Griha Pravesh / housewarming invitation messages, in page order. Section ids
 * are the jump-link anchors on /griha-pravesh-invitation-wording — keep them
 * stable (formal, whatsapp, housewarming-english, modern, hindi, regional and
 * satyanarayan-pooja are the ones the page has always had).
 */
export const GRIHA_SECTIONS: WordingSectionData[] = [
  {
    id: 'formal',
    toc: 'Formal',
    title: 'Formal Griha Pravesh Invitation Message',
    intro: 'Formal invitations work best for printed cards and for sending to elders and extended family. They carry a respectful, warm tone and include all ceremony details.',
    messages: [
      { title: '1. Traditional — Vastu Puja, Ganesh Puja, family blessings', text: `With the blessings of our elders and the grace of the Almighty, we joyfully invite you to the Griha Pravesh ceremony of our new home.
Vastu Puja & Ganesh Puja: [Muhurat Time]
Grah Shanti: [Time]
Lunch: [Time] onwards
Date: [Date]
New Address: [Full Address, City]
We seek your blessings and heartfelt presence on this auspicious occasion.
— [Host Family Names]
Contact: [Phone Number]` },
      { title: '2. Apartment / flat move-in (urban setting)', text: `We are delighted to invite you to the Griha Pravesh of our new home.
[Flat/Apartment Name & Number]
[Society Name, Wing, Floor]
[Area, City — PIN]
Muhurat: [Time] on [Date]
Ganesh Puja → Lakshmi Puja → Grah Shanti → Lunch
Parking: [Parking instructions — visitor parking at Gate No. / basement level]
Entry: [Building entry instructions if applicable]
Please grace us with your blessings on this memorable day.
— [Father's Name], [Mother's Name] & Family` },
      { title: '3. South Indian — Gruhapravesham style', text: `With the blessings of Sri [Family Deity / God] and our elders,
[Father's Name] and [Mother's Name]
cordially invite you to the
Gruhapravesham
of our new residence
Muhurtam: [Time] on [Day], [Date]
Address: [Full Address, City]
Ganapathi Puja — [Time]
Gruhapravesham Muhurtam — [Time]
Lunch — [Time] onwards
Your presence and blessings would be the greatest gift.
RSVP: [Phone Number]` },
      { title: '4. North Indian — with Lakshmi Puja', text: `We request the pleasure of your company at the
Griha Pravesh & Lakshmi Puja
of our new home.
[Host Name(s)]
[New Address, City]
Shubh Muhurat: [Date] at [Time]
Ganesh Puja: [Time]
Griha Pravesh: [Time] (Muhurat)
Lakshmi Puja: [Time]
Prasad & Lunch: [Time] onwards
Kindly honour us with your presence and blessings.
Contact: [Phone Number]` },
    ],
  },
  {
    id: 'whatsapp',
    toc: 'Short WhatsApp',
    title: 'Short WhatsApp Griha Pravesh Message',
    intro: 'For WhatsApp, shorter messages work better — paste the digital invite link right after so guests can tap it for the full details, map, and schedule.',
    messages: [
      { title: '1. Simple casual', text: `We are moving into our new home and would love your blessings!
Griha Pravesh: [Date] at [Muhurat Time]
Address: [New Address, City]
Please do join us. Lunch follows the ceremony.
Details & map: [Digital Invite Link]` },
      { title: '2. Muhurat time prominent', text: `Griha Pravesh — [Date]
Shubh Muhurat: [Time] SHARP
Please arrive by [15 mins before time] so the puja begins on time.
Venue: [Address, City]
Lunch: [Time] onwards
Invite & map 👉 [Digital Invite Link]` },
      { title: '3. From the joint family', text: `With the blessings of [Elder's Name / Dada-Dadi / Nana-Nani],
our family is stepping into our new home.
Griha Pravesh: [Date] at [Time]
New Address: [Address, City]
[Grandfather's/Head of family's name] & the entire [Family Surname] family
invite you to join us for this auspicious occasion.
Map & full schedule: [Digital Invite Link]` },
      { title: '4. Hindi / English bilingual', text: `नए घर में प्रवेश का मंगल अवसर!
[Family Name] परिवार के नए घर का गृह प्रवेश
दिनांक: [Date] | मुहूर्त: [Time]
पता: [Address, City]
आपके आशीर्वाद और उपस्थिति के बिना यह शुभ कार्य अधूरा है।
Our Griha Pravesh ceremony — do join us!
Map & details: [Digital Invite Link]` },
    ],
  },
  {
    id: 'housewarming-english',
    toc: 'Housewarming (English)',
    title: 'New Home & Housewarming Invitation Messages (English)',
    intro: 'Clean English wording for a housewarming or new-home celebration — perfect when guests span friends, colleagues and family. Copy, add your details and share on WhatsApp.',
    messages: [
      { title: '1. Warm new-home invite', text: `We've found our new home — and we'd love you in it! 🏡

Join us for our housewarming on [Date] at [Time].
Venue: [New Address, City]

Come bless our new beginning with your presence.
— [Host Family Names]` },
      { title: '2. Simple & short', text: `🏡 Housewarming time! Join us to celebrate our new home.
📅 [Date] · 🕖 [Time] · 📍 [New Address]
Your blessings mean everything to us!` },
      { title: '3. Muhurat-focused (English)', text: `With gratitude, we invite you to the Griha Pravesh of our new home.

🕉️ Muhurat: [Muhurat Time] on [Date]
Gathering from: [Time]
Address: [Full New Address + Landmark]

Please arrive before the muhurat for the auspicious entry. Lunch to follow.` },
      { title: '4. Formal — both hosts named', text: `[Host 1 Name] & [Host 2 Name]
request the pleasure of your company at the
Housewarming (Griha Pravesh) of their new home

🕉️ Muhurat: [Muhurat Time] · [Day, Date]
[New Address, City]

Your presence and blessings are eagerly awaited.
RSVP: [Phone]` },
      { title: '5. Evening housewarming party', text: `We're warming up the new place — come join the fun! 🏡🎉

Housewarming get-together
[Date] · [Time] onwards
[New Address, City]

Good food, good company, and a home full of love. RSVP: [Phone]` },
      { title: '6. With a Google Maps note', text: `You're invited to our housewarming! 🏡
🕉️ Muhurat: [Muhurat Time] · [Date]
📍 [New Address] — map & full details 👉 [Digital Invite Link]

The new place is easy to find with the map — see you there!` },
    ],
  },
  {
    id: 'friends',
    toc: 'For friends',
    title: 'Housewarming Invitation Messages for Friends',
    intro: 'Relaxed messages for the friends group — say whether it is the pooja, the party or both, so nobody turns up in party clothes for the havan.',
    messages: [
      { title: '1. We finally moved', text: `We finally moved! 🏡
Come see the new place and celebrate with us on [Date] at [Time].
📍 [New Address, City]
Food's on us — just bring yourselves! [Invitation Link]` },
      { title: '2. For the friends group', text: `Housewarming at ours! 🎉
[Date] · [Time] onwards · [New Address]
Pooja in the morning for family, party in the evening for you lot. 😄` },
      { title: '3. One-to-one', text: `Hey [Friend's Name]! We've moved into our new home and the housewarming is on [Date].
It won't feel like home until you've been over — please come! 💛
📍 [Address] · [Time]` },
      { title: "4. Inviting a friend's family", text: `Dear [Friend's Name], we're doing the Griha Pravesh of our new home on [Date] at [Muhurat Time], with lunch after.
We'd love for you to come with the family. 🙏
📍 [New Address, City]` },
    ],
  },
  {
    id: 'colleagues',
    toc: 'For colleagues',
    title: 'Housewarming Invitation Message for Colleagues & Office',
    intro: 'Polite and short — colleagues usually come for the lunch or the evening, not the morning pooja, so give that time.',
    messages: [
      { title: '1. Office WhatsApp group', text: `Dear all,
We've moved into our new home and are having a small housewarming on [Date] from [Time].
I'd be happy if you could drop by — [New Address, City].
Map: [Invitation Link]
— [Your Name]` },
      { title: '2. Email to your team', text: `Subject: Housewarming — you're invited!

Dear team,
We're celebrating the Griha Pravesh of our new home on [Date]. The pooja is in the morning, and we'd love to have you for lunch from [Time].
Address and map: [Invitation Link]

Warm regards,
[Your Name]` },
      { title: '3. Short', text: `Hi team 👋 Housewarming at my new place on [Date], [Time] onwards.
Would love to see you there! 📍 [Area, City]` },
    ],
  },
  {
    id: 'modern',
    toc: 'Modern & casual',
    title: 'Modern & Casual Housewarming Messages',
    intro: 'For friends and a relaxed crowd, keep it light and fun. These match a casual house party more than a formal pooja.',
    messages: [
      { title: '1. Fun & casual', text: `New keys, new address, same us — and a party to prove it! 🎉🏡

Housewarming at our place:
📅 [Date] · 🕖 [Time] · 📍 [New Address]

Bring your appetite. We'll bring the housewarming vibes!` },
      { title: '2. Short group message', text: `We moved! 🏡 Come see the new place on [Date] at [Time].
[New Address] · details 👉 [Digital Invite Link]
Can't wait to host you!` },
      { title: '3. Housewarming brunch', text: `Brunch + new home = the perfect combo! 🥞🏡

Join us to warm up our new place over good food.
[Date] · [Time] · [New Address]

Come hungry, leave happy!` },
      { title: '4. Blessings + party combined', text: `Pooja in the morning, party in the evening — you're invited to both! 🙏🎉

🕉️ Griha Pravesh muhurat: [Muhurat Time]
🎉 Get-together: [Evening Time]
📍 [New Address, City]

Come for the blessings, stay for the fun!` },
    ],
  },
  {
    id: 'hindi',
    toc: 'In Hindi',
    title: 'Griha Pravesh Invitation Messages in Hindi (गृह प्रवेश निमंत्रण)',
    intro: 'Hindi and bilingual wording for family groups and elders — from the traditional card text to a short WhatsApp message and a Hinglish version.',
    messages: [
      { title: '1. पारंपरिक (Traditional Hindi)', text: `॥ श्री गणेशाय नमः ॥

सहर्ष सूचित करते हैं कि हमारे नए गृह के गृह प्रवेश एवं पूजन का
शुभ मुहूर्त [Muhurat Time], दिनांक [Date] को है।

स्थान: [नया पता, शहर]

आपकी उपस्थिति एवं आशीर्वाद हमारे लिए अनमोल होंगे। 🙏
— [परिवार का नाम]` },
      { title: '2. छोटा संदेश (Short Hindi)', text: `🏡 हमारे नए घर के गृह प्रवेश पर आप सादर आमंत्रित हैं।
मुहूर्त: [Muhurat Time] · दिनांक: [Date]
पता: [नया पता]

कृपया पधारें और आशीर्वाद दें। 🙏` },
      { title: '3. बिलिंगुअल (Hindi + English)', text: `हमारे नए घर में आपका स्वागत है! 🏡
गृह प्रवेश मुहूर्त: [Muhurat Time], [Date]

Join us for our Griha Pravesh at [New Address].
Map & details 👉 [Digital Invite Link]` },
      { title: '4. आधुनिक (Modern Hindi)', text: `नया घर, नई शुरुआत — और आपके बिना अधूरी! 🏡

गृह प्रवेश: [Date] · मुहूर्त [Muhurat Time]
[नया पता, शहर]

आइए, हमारी खुशियों में शामिल होइए।` },
      { title: '5. निमंत्रण पत्र (Card wording)', text: `॥ श्री गणेशाय नमः ॥
सादर आमंत्रण

प्रभु की असीम कृपा से हमारे नवनिर्मित गृह का
गृह प्रवेश एवं वास्तु पूजन
दिनांक [तारीख] को शुभ मुहूर्त [समय] पर सम्पन्न होगा।

इस शुभ अवसर पर आप सपरिवार सादर आमंत्रित हैं।
पता: [नया पता, शहर]
दर्शनाभिलाषी: [परिवार के नाम]` },
      { title: '6. Hinglish', text: `Humare naye ghar ka Griha Pravesh hai! 🏡
[Date] ko muhurat [Time] baje hai — pooja ke baad lunch bhi.
Aap sab parivaar sahit zaroor aaiye. 🙏
📍 [New Address]` },
    ],
  },
  {
    id: 'regional',
    toc: 'Regional traditions',
    title: 'Griha Pravesh Invitation for Different Regional Traditions',
    intro: 'The ceremony name changes by region, but the invitation needs are similar. Adjust the ceremony name and deity references to match your tradition.',
    messages: [
      { title: 'Griha Pravesh — North & Central India', text: `[Father's Name] & [Mother's Name]
request your presence at the
Griha Pravesh
of their new home
Shubh Muhurat: [Time], [Date]
Address: [Full Address, City]
Ganesh Puja | Grah Shanti | Lakshmi Puja | Lunch
[Full schedule on digital invite]
Your blessings make our new home complete.
Contact: [Phone]` },
      { title: 'Gruhapravesham — South India (Tamil / Telugu families)', text: `Sri [Family Deity] Thiruvadigale Saranam
[Father's Name] & [Mother's Name]
invite you to the
Gruhapravesham
of their new residence
Muhurtam: [Day], [Date] at [Time]
[Full Address, City]
Ganapathi Homam — [Time]
Gruhapravesham — [Muhurtam Time]
Lunch — [Time]
Kindly bless us with your presence.
RSVP: [Phone]` },
      { title: 'Ghar Pravesh / Naye Ghar ki Khushi — informal Hindi', text: `🏠 नए घर में आपका स्वागत है!
हम बड़ी खुशी से आपको अपने नए घर के गृह प्रवेश में आमंत्रित करते हैं।
तारीख: [Date]
मुहूर्त: [Time]
पता: [Address, City]
पूजा, प्रसाद और भोजन — सब कुछ है।
बस आपके आशीर्वाद चाहिए! 🙏
संपर्क: [Phone Number]` },
      { title: 'Vastu Puja + housewarming combined', text: `[Family Name] Family
joyfully invites you to the
Vastu Puja & Griha Pravesh Ceremony
of their new home
Date: [Date]
Vastu Puja Muhurat: [Time]
Griha Pravesh: [Time]
Lunch: [Time] onwards
Address: [Full Address with Landmark]
[Google Maps: Digital Invite Link]
Your presence and blessings would make this occasion truly auspicious.` },
    ],
  },
  {
    id: 'vastu-shanti',
    toc: 'Vastu Shanti',
    title: 'Vastu Shanti Pooja Invitation Message',
    intro: 'Vastu Shanti is the name many Marathi and Gujarati families use for the pooja that blesses a new home — often held together with the Griha Pravesh. Give the pooja time and the meal time separately.',
    messages: [
      { title: '1. Formal', text: `With the blessings of Shri Ganesha, we invite you to the Vastu Shanti pooja of our new home.

Date: [Date]
Pooja muhurat: [Time]
Mahaprasad: [Time] onwards
Address: [New Address, City]

Your presence and blessings are requested.
— [Family Name]` },
      { title: '2. With the Griha Pravesh', text: `Shri Ganeshay Namah 🙏
We are happy to invite you and your family to the Vastu Shanti and Griha Pravesh of our new home on [Date].
Pooja: [Time] · Lunch: [Time]
📍 [Address]` },
      { title: '3. Vastu Pujan (Gujarati families)', text: `Jai Shri Krishna 🙏
With joy, the [Family Name] family invites you to the Vastu Pujan of our new home.
[Date] · [Time]
[Address, City]
Please join us for the pooja and prasad.` },
      { title: '4. Short', text: `Vastu Shanti pooja at our new home 🏡
[Date] · muhurat [Time] · [Address]
Do come with family! [Invitation Link]` },
    ],
  },
  {
    id: 'satyanarayan-pooja',
    toc: 'With Satyanarayan pooja',
    title: 'Griha Pravesh with Satyanarayan Katha',
    intro: 'Many families hold a Satyanarayan pooja and katha on the day they move in. Mention it by name — guests who know the katha will want to arrive in time for it.',
    messages: [
      { title: '1. Griha Pravesh & Satyanarayan pooja', text: `With the blessings of our elders, we invite you to the Griha Pravesh of our new home, followed by the Satyanarayan Katha.

Date: [Date]
Griha Pravesh muhurat: [Time]
Satyanarayan Katha: [Time]
Aarti & prasad lunch: [Time] onwards

Address: [New Address, City]

Please come with your family and bless our new home. 🙏
— [Host Family Names]` },
      { title: '2. In Hindi', text: `॥ श्री गणेशाय नमः ॥

हमारे नए घर के गृह प्रवेश एवं श्री सत्यनारायण कथा के शुभ अवसर पर आप सपरिवार सादर आमंत्रित हैं।

दिनांक: [Date]
गृह प्रवेश मुहूर्त: [Time]
सत्यनारायण कथा: [Time]
आरती एवं प्रसाद: [Time]

पता: [नया पता, शहर]
— [परिवार का नाम]` },
      { title: '3. Short WhatsApp message', text: `🏡 Griha Pravesh & Satyanarayan pooja at our new home
[Date] · muhurat [Time] · katha [Time]
📍 [New Address]
Prasad lunch to follow — do come! Map 👉 [Digital Invite Link]` },
    ],
  },
  {
    id: 'office-shop',
    toc: 'New office or shop',
    title: 'New Office & Shop Opening Pooja Invitation',
    intro: 'The same blessing for a new workplace — an office, a shop or a clinic. Say what is being opened and who is inviting, and keep the tone a little more formal for clients.',
    messages: [
      { title: '1. New office', text: `With the blessings of the Almighty, we invite you to the opening pooja of our new office.
[Company Name]
[Date] · Pooja: [Time] · Lunch: [Time]
[Office Address, City]
Your presence and good wishes mean a lot to us.` },
      { title: '2. New shop', text: `Shubh Aarambh! 🪔
We are opening our new shop, [Shop Name], with a Lakshmi-Ganesh pooja on [Date] at [Time].
📍 [Shop Address]
Please come and bless our new beginning.` },
      { title: '3. To clients and partners', text: `Dear [Name],
We are moving to a new office and would be delighted if you could join us for the inauguration pooja on [Date] at [Time], at [New Address].
Warm regards,
[Your Name], [Company Name]` },
      { title: '4. Short', text: `New office, new beginning! 🏢
Opening pooja on [Date] at [Time] · [Address].
Do join us!` },
    ],
  },
  {
    id: 'situations',
    toc: 'Rented home, renovation…',
    title: 'Griha Pravesh Messages for Different Situations',
    intro: 'Not every move is a newly built home — wording for a rented flat, a small family pooja, a renovated home, and relatives who can only join from afar.',
    messages: [
      { title: '1. Rented home', text: `We've moved into a new home on rent and are doing a small pooja to begin well. 🙏
[Date] · [Time] · [Address]
It would be lovely to see you there.` },
      { title: '2. Small family pooja', text: `Just a small family pooja for our new home — and we'd love you to be part of it. 🏡
[Date] · muhurat [Time] · [Address]
Prasad & lunch to follow.` },
      { title: '3. After a renovation', text: `Our home has a fresh new look! 🏡
We're doing a pooja after the renovation on [Date] at [Time], and would love your blessings.
📍 [Address]` },
      { title: '4. For relatives abroad', text: `We wish you could be here for our Griha Pravesh on [Date]! 🙏
Photos of the new home, the pooja schedule and a place to leave your blessings are all on this link:
[Invitation Link]` },
    ],
  },
  {
    id: 'reminders',
    toc: 'Reminders & thank-yous',
    title: 'Griha Pravesh Reminder & Thank-You Messages',
    intro: 'A reminder the day before — with the muhurat and the parking — saves a dozen phone calls. Re-send the same invitation link; the map is already in it.',
    messages: [
      { title: '1. Reminder', text: `Just a reminder 😊 Our Griha Pravesh is on [Date] — muhurat at [Time] sharp.
📍 [New Address] · map: [Invitation Link]
See you there!` },
      { title: '2. The day before, with parking', text: `See you tomorrow! 🏡
The pooja starts at [Time].
Visitor parking: [Gate / Level].
Call [Phone] if you can't find us.` },
      { title: '3. RSVP reminder', text: `Hi [Name], hope you can make it to our housewarming on [Date]!
Could you let us know by [RSVP Date] so we can plan the lunch? 🙏` },
      { title: '4. Thank you, after the Griha Pravesh', text: `Thank you for coming to our Griha Pravesh! 🙏
Your blessings have made our new house a home.
— [Family Name]` },
    ],
  },
]
