import type { Metadata } from 'next'
import OccasionPage from '@/components/landing/OccasionPage'
import { CakeIcon, ClockIcon, MapPinIcon, CameraIcon, ShirtIcon, UsersIcon } from '@/components/ui/Icons'
import { templatePrice } from '@/lib/plans'

/**
 * Kids' birthday invitations: the six themed designs (components/templates/KidsParty.tsx) and Pehla
 * Janamdin, for searches like "kids birthday invitation", "dinosaur birthday invitation" and
 * "superhero birthday invitation". The artwork is original; the page says so, because parents
 * searching for a theme often expect a character they cannot legally be sold.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'
const PRICE = templatePrice('kids-dinosaur')

const KIDS_IDS = ['kids-dinosaur', 'kids-superhero', 'kids-unicorn', 'kids-space', 'kids-jungle', 'kids-cars', 'first-birthday']

export const metadata: Metadata = {
  title: { absolute: `Kids Birthday Invitation Online: 6 Themes, ₹${PRICE} | ShareInvite` },
  description:
    `Kids birthday invitations for WhatsApp: dinosaur, space, superhero, unicorn, jungle safari and race car themes, with a countdown, map and RSVP. Preview free; ₹${PRICE} once.`,
  keywords: [
    'kids birthday invitation',
    'kids birthday invitation online',
    'dinosaur birthday invitation',
    'superhero birthday invitation',
    'unicorn birthday invitation',
    'space birthday invitation',
    'jungle theme birthday invitation',
    'car theme birthday invitation',
    'birthday invitation for kids WhatsApp',
  ],
  alternates: { canonical: `${APP_URL}/kids-birthday-invitation` },
  openGraph: {
    title: 'Kids Birthday Invitations: Dinosaur, Space, Superhero & More | ShareInvite',
    description: `Six themed kids birthday invitations with original artwork, a countdown in sleeps, the party plan, a map and an RSVP that counts the children. ₹${PRICE} once.`,
    type: 'website',
    locale: 'en_IN',
    url: `${APP_URL}/kids-birthday-invitation`,
    images: [{ url: `${APP_URL}/templates/kids-dinosaur.jpg`, width: 960, height: 1200, alt: 'Dino Roar, a dinosaur birthday invitation for kids' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a kids birthday invitation cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Each kids theme (Dino Roar, Blast Off, Super Squad, Rainbow Dream, Wild One and Race Day) is ₹${PRICE}, paid once when you publish. You build and preview the whole invitation free first. There is no subscription and no charge per guest, and the design stays yours for a sibling's party later.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Which birthday themes are there for kids?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Six, and each opens like a short video: a dinosaur egg that hatches with a ROAR, a rocket that launches after 3, 2, 1, a comic book that bursts open with POW and BAM, a star that turns into a rainbow and a unicorn, jungle leaves that part for a swinging monkey, and five start lights before a race car zooms off. For a first birthday there is also Pehla Janamdin, a storybook design with hot-air balloons.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are there designs for girls as well as boys?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every theme comes in three colours you choose in the builder: a pink-and-lilac dinosaur, a pink galaxy, a pink-and-purple superhero, a pink race car, a boho pastel jungle, and lavender or mint unicorns, alongside the classic greens, blues and reds. The whole invitation changes colour, the opening scene too.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it play music and show my child’s photo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. When a guest taps to open it, the scene plays with the Happy Birthday tune as a music box (or a song you add). Then your child’s photo appears as the star, inside the theme: a dinosaur peeking over it, an astronaut’s helmet, a comic-book poster, a unicorn’s horn and flower crown, a lion’s mane or a racing licence.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do the designs have cartoon characters?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. All the artwork is drawn by us and original: generic dinosaurs, rockets, superheroes, unicorns, safari animals and race cars, never a character from a cartoon, film or toy brand, which belong to their owners. Your child’s photo, the theme line and the dress-up note make it theirs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can parents reply with how many children are coming?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. A guest taps “We’ll be there”, chooses how many children and grown-ups are coming, and a message to you opens on WhatsApp, as a text or by email, ready to send: “Yes! We’ll be at Aarav’s 5th birthday on Saturday 12 December: 2 children and 1 grown-up.” You can also add a reply-by date.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I put on a kids birthday invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The child’s name and age, the theme, the date with a start and end time (so parents can plan the pick-up), the venue with a map, what to wear, a note for parents about food, allergies or siblings, and how and by when to reply. Each kids design has a place for all of these, and you can remove any part you don’t need.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I send the invitation in the class WhatsApp group?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You get one link that opens in any phone’s browser, with no app to install. Paste it in the class or society group with a short message; the date, time, map and RSVP stay in one place instead of getting lost under the replies.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I publish a kids birthday invitation for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes. Any design can be published free with ShareInvite branding on it. If you want the clean invitation later, pay ₹${PRICE} once and the branding comes off on the same link.`,
      },
    },
  ],
}

const FEATURES = [
  { icon: <CakeIcon />, title: 'Opens like a video', desc: 'A tap hatches the egg, launches the rocket or starts the race, with the Happy Birthday tune and confetti.' },
  { icon: <CameraIcon />, title: 'Your child as the star', desc: 'Their photo inside the theme: an astronaut’s helmet, a comic poster, a unicorn crown, a lion’s mane, a racing licence.' },
  { icon: <ClockIcon />, title: 'A countdown in sleeps', desc: '“12 sleeps until the big roar”: children love counting down, and parents remember the date.' },
  { icon: <MapPinIcon />, title: 'Time, venue & map', desc: 'Start and end time for the pick-up, the venue and one-tap directions.' },
  { icon: <ShirtIcon />, title: 'Party plan & dress-up', desc: 'Games, magic show, cake and dinner, what to wear, and a note for parents about food or siblings.' },
  { icon: <CameraIcon />, title: 'For a girl or a boy', desc: 'Three colours for every theme: pink and lilac dinosaurs, a pink galaxy, a pink race car, and the classic colours too.' },
  { icon: <UsersIcon />, title: 'RSVP that counts heads', desc: 'Parents reply on WhatsApp with how many children and grown-ups are coming, for food and return gifts.' },
]

export default function Page() {
  const faqs = faqSchema.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }))
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <OccasionPage
        occasion="birthday"
        templateIds={KIDS_IDS}
        designsTitle="Kids birthday designs"
        templateId="kids-dinosaur"
        pageKey="kids_birthday_landing"
        crumb="Kids birthday invitations"
        eyebrow="Kids birthday invitations"
        title={<>Kids Birthday Invitations <em className="font-medium text-burnished">they’ll love</em></>}
        lede={`Dinosaurs, space, superheroes, unicorns, a jungle safari or race cars: six birthday invitations that open like a short video with the Happy Birthday tune, put your child’s photo at the heart of the theme, and come in colours for a girl or a boy. Then the date, a map, a countdown in sleeps and an RSVP that tells you how many children are coming. Preview free, then publish for ₹${PRICE} once and share one WhatsApp link.`}
        ctaLabel="Start my kids invite"
        features={{ title: 'What’s in a kids birthday invitation', items: FEATURES }}
        steps={[
          { title: 'Pick your child’s theme', copy: 'Open each design live and see it exactly as the guests will.' },
          { title: 'Add the party details', copy: 'Name, age, date and time, venue, plan, dress-up and photos. The preview updates as you type.' },
          { title: 'Publish & share', copy: 'Pay once (or publish free with branding) and send the link to the class and family groups.' },
        ]}
        compare={{ noun: 'kids birthday invitation', guests: 30 }}
        faqTitle="Kids birthday invitation questions"
        faqs={faqs}
        related={[
          { href: '/blog/kids-birthday-party-theme-ideas-with-invitation-messages', label: 'Kids party themes & messages' },
          { href: '/birthday-invitation-wording#kids', label: 'Kids birthday wording' },
          { href: '/blog/first-birthday-invitation-ideas-for-indian-families', label: 'First birthday ideas' },
          { href: '/birthday-invitation', label: 'All birthday invitations' },
        ]}
        closing={{ title: 'Make their party invitation tonight' }}
      />
    </>
  )
}
