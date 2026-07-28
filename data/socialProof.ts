export const NAMES = [
  // Global mix — ShareInvite is used by families and couples worldwide
  'Emma', 'Liam', 'Sofia', 'Noah', 'Mia',
  'Aarav', 'Priya', 'Rohan', 'Ananya', 'Ishita',
  'Wei', 'Aisha', 'Diego', 'Yuki', 'Omar',
  'Chloe', 'Mateo', 'Hana', 'Zara', 'Lucas',
  'Fatima', 'Ethan', 'Ava', 'Arjun',
] as const

export const CITIES = [
  // Worldwide reach
  'London', 'New York', 'Dubai', 'Singapore', 'Toronto',
  'Sydney', 'San Francisco', 'Dublin', 'Melbourne', 'Auckland',
  'Doha', 'Kuala Lumpur', 'Chicago', 'Vancouver', 'Abu Dhabi',
  'Manchester', 'Hong Kong', 'Amsterdam',
  'Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Dallas', 'Riyadh',
] as const

export const INVITATION_TYPES = [
  // Classic invitations
  'Wedding Invitation',
  'Birthday Invitation',
  'Engagement Invitation',
  'Anniversary Invitation',
  'Baby Shower Invitation',
  'Naming Ceremony Invitation',
  'Housewarming Invitation',
  'Reception Invitation',
  // New 3D & animated greeting templates
  '3D Surprise Gift',
  '3D Love Card',
  "Valentine's Day Card",
  'Anniversary Card',
  'Proposal Card',
  'Promise Day Card',
  'Congratulations Card',
  'Festival Greeting Card',
  'Family Wishes Card',
  'Friendship Day Card',
] as const

// Each template receives (name, city, invitationType) — unused params prefixed with _
// Wording works for both invitations and greeting cards ("created" / "sent" / "designing").
export const MESSAGE_TEMPLATES: Array<(n: string, c: string, t: string) => string> = [
  (n, c, t) => `${n} from ${c} just created a ${t}.`,
  (n, c, t) => `${n} from ${c} started designing a ${t}.`,
  (n, c, t) => `${n} from ${c} published a ${t}.`,
  (n, c, t) => `${n} from ${c} just sent a ${t}.`,
  (n, c, t) => `${n} in ${c} shared a ${t} on WhatsApp.`,
  (n, c)    => `${n} from ${c} joined ShareInvite.`,
  (n, c)    => `${n} from ${c} is now using ShareInvite.`,
  (_n, c, t) => `Someone in ${c} started designing a ${t}.`,
  (_n, c, t) => `A ${t} was just created in ${c}.`,
]

export const TIMES = [
  'just now',
  '1 min ago',
  '2 min ago',
  '3 min ago',
  '5 min ago',
  '8 min ago',
  '12 min ago',
] as const

// Brand-aligned avatar palette (warm, matches ShareInvite gold/maroon/teal)
export const AVATAR_COLORS = [
  '#7A3E4A', // maroon
  '#2F766D', // teal
  '#B87924', // gold
  '#4A407A', // indigo
  '#3E7A56', // forest
  '#7A5A3E', // sienna
  '#4A7A6A', // sage
  '#6A3E7A', // purple
  '#7A6A3E', // olive
  '#3E5A7A', // slate
] as const
